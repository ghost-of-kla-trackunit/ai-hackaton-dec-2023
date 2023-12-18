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
  setCurrentThread: (threadId: string | null) => void;
}

export interface Message {
  owner: 'assistant' | 'user';
  message: string;
}

const ASSISTANT_ID = 'asst_x2Ge4RPdABFgbFUwLWKHZX1V';
const POLL_INTERVAL = 2000;

const AIContext = createContext<AIContextProps | undefined>(undefined);

interface RGB {
  red: number;
  green: number;
  blue: number;
}

const setBackgroundColor = ({ red, green, blue }: RGB) => {
  console.log('setBackgroundColor', { red, green, blue });
  const root = document.querySelector(':root') as HTMLHtmlElement;
  root?.style.setProperty(
    '--base-background-color-rgb',
    [red, green, blue].join(', ')
  );
};

const setForegroundColor = ({ red, green, blue }: RGB) => {
  console.log('setForegroundColor', { red, green, blue });
  const root = document.querySelector(':root') as HTMLHtmlElement;
  root?.style.setProperty(
    '--base-foreground-color-rgb',
    [red, green, blue].join(', ')
  );
};

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
    'thread_id_actions_demo',
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

        if (
          runStatus.status === 'requires_action' &&
          runStatus.required_action?.type === 'submit_tool_outputs'
        ) {
          pushStatus('🔧 Got Action request...');
          // Map over the tool calls and submit the outputs
          const tool_outputs =
            runStatus.required_action.submit_tool_outputs.tool_calls.map(
              (action) => {
                if (action.function.name === 'set_background_color') {
                  pushStatus('🎨 Setting background...');
                  const rgb: RGB = JSON.parse(action.function.arguments) as RGB;
                  setBackgroundColor(rgb);
                  return {
                    tool_call_id: action.id,
                    output: "I've set the background color",
                  };
                }

                if (action.function.name === 'set_foreground_color') {
                  pushStatus('🎨 Setting foreground...');
                  const rgb: RGB = JSON.parse(action.function.arguments) as RGB;
                  setForegroundColor(rgb);
                  return {
                    tool_call_id: action.id,
                    output: "I've set the foreground color",
                  };
                }
                pushStatus('😬 Color actions failed...');

                return {
                  tool_call_id: action.id,
                  output: 'Action not supported',
                };
              }
            );

          await openAIInstance.beta.threads.runs.submitToolOutputs(
            currentThread,
            run.id,
            {
              tool_outputs,
            }
          );
        }
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
        setCurrentThread,
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
