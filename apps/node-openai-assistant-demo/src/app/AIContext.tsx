import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocalStorage } from 'react-use';

import OpenAI from 'openai';

export interface AIContextProps {
  initializeOpenAI: (apiKey: string) => void;
  status: string[];
  currentThread: string | null | undefined;
  isReady: boolean;
  pushStatus: (message: string) => void;
  loading: boolean;
  sendMessageToAI: (data: string) => Promise<
    | {
        success: boolean;
      }
    | undefined
  >;
  messages: Message[];
}

export interface Message {
  owner: 'assistant' | 'user';
  message: string;
}

const ASSISTANT_ID = 'asst_saKSiiL3YTFxDFY83nGcufXX';
const POLL_INTERVAL = 2000;

const AIContext = createContext<AIContextProps | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState(['👨‍💻 Waiting for user Input...']);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const pushStatus = useCallback(
    (message: string) => setStatus((prev) => [...prev, message]),
    []
  );
  const [openAIInstance, setOpenAIInstance] = useState<OpenAI | null>(null);
  const [currentThread, setCurrentThread] = useLocalStorage<string | null>(
    'thread_id',
    null
  );
  const isReady = useMemo(
    () => Boolean(openAIInstance && currentThread),
    [openAIInstance, currentThread]
  );

  useEffect(() => {
    const initializeThread = async () => {
      if (openAIInstance && !currentThread) {
        pushStatus('🧵 Starting new Thread...');
        openAIInstance.beta.threads
          .create({})
          .then((thread) => {
            setCurrentThread(thread.id);
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('Failed to create thread:', error);
          });
      } else if (openAIInstance && currentThread) {
        pushStatus('🧵 Getting existing message...');
        const existingMessages =
          await openAIInstance.beta.threads.messages.list(currentThread);
        setMessages(
          existingMessages.data.map((response) => {
            const messageContent = response.content[0];
            return {
              owner: response.role,
              message:
                messageContent.type === 'text'
                  ? messageContent.text.value
                  : '🤷‍♂️',
            };
          })
        );
      }
    };

    initializeThread();
  }, [openAIInstance, currentThread, setCurrentThread, pushStatus]);

  const initializeOpenAI = useCallback(
    (apiKey: string) => {
      pushStatus('🤖 Initializing OpenAI...');
      const openAI = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });
      setOpenAIInstance(openAI);
    },
    [pushStatus]
  );

  const sendMessageToAI = useCallback(
    async (message: string) => {
      setLoading(true);
      if (!openAIInstance || !currentThread) {
        return;
      }

      pushStatus('🧵 Add message to thread...');
      await openAIInstance.beta.threads.messages.create(currentThread, {
        role: 'user',
        content: message,
      });

      pushStatus('🏃🏻‍♂️ Starting run...');
      const run = await openAIInstance.beta.threads.runs.create(currentThread, {
        assistant_id: ASSISTANT_ID,
        instructions: '',
      });

      pushStatus('⏳ Waiting for response...');
      let runStatus = await openAIInstance.beta.threads.runs.retrieve(
        currentThread,
        run.id
      );
      while (runStatus.status !== 'completed') {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        runStatus = await openAIInstance.beta.threads.runs.retrieve(
          currentThread,
          run.id
        );
      }

      const openAiResponses = await openAIInstance.beta.threads.messages.list(
        currentThread
      );
      const responseMessages: Message[] = openAiResponses.data.map(
        (response) => {
          const messageContent = response.content[0];
          return {
            owner: response.role,
            message:
              messageContent.type === 'text' ? messageContent.text.value : '🤷‍♂️',
          };
        }
      );
      pushStatus('✅ Response received!');

      setMessages(responseMessages);
      setLoading(false);

      return { success: true };
    },
    [currentThread, openAIInstance, pushStatus]
  );

  return (
    <AIContext.Provider
      value={{
        messages,
        sendMessageToAI,
        initializeOpenAI,
        isReady,
        status,
        currentThread,
        pushStatus,
        loading,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};

export const useAI = (): AIContextProps => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within a AIProvider');
  }
  return context;
};
