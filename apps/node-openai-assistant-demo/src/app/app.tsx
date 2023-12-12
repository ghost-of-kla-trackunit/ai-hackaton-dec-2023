import { useState } from 'react';
import { marked } from 'marked';
import '@ai-hackaton-dec-2023/libs/shared-styles';
import { useAI } from './AIContext';

export interface Message {
  owner: 'assistant' | 'user';
  message: string;
}

export function App() {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState<string>(
    'Tell me a joke about the weather'
  );
  const {
    isReady,
    status,
    initializeOpenAI,
    messages,
    sendMessageToAI,
    loading,
  } = useAI();

  const handleSubmit = async () => {
    sendMessageToAI(message);
  };

  return (
    <div className="container">
      <header>
        <h2>Node OpenAi Assistant</h2>

        <div className="status-container">
          <span className="status">🤖 Status 🤖</span>
          {status.map((message) => (
            <span>{message}</span>
          ))}
        </div>
      </header>
      <div className="messages-container">
        {messages.map(({ owner, message }) => (
          <div
            className={`message ${owner}`}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: marked.parse(message),
            }}
          />
        )).reverse()}
      </div>
      <form>
        {!isReady ? (
          <>
            <div className="field">
              <label>OpenAI Token</label>
              <input
                type="password"
                name="openai_token"
                id="openai_token"
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <button type="button" onClick={() => initializeOpenAI(apiKey)}>
              Initialize
            </button>
          </>
        ) : loading ? (
          'Loading...'
        ) : (
          <>
            <div className="field">
              <label>Message to AI</label>
              <textarea
                name="message"
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button type="button" onClick={() => handleSubmit()}>
              Send Message
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default App;
