import { useRef, useState } from 'react';
import { Ollama } from 'langchain/llms/ollama';
import { PromptTemplate } from 'langchain/prompts';
import '@ai-hackaton-dec-2023/libs/shared-styles';

const prompt = PromptTemplate.fromTemplate(
  'Generate a pure typescript function for that follows the spec: {spec} With the input: {input} it should return: {output}. Always make it typesafe and pure.'
);

export function App() {
  const [spec, setSpec] = useState<string>(
    'a noneNullable typesafe function to use with Use with filter() to remove null and undefined from an array but keep the type'
  );
  const [input, setInput] = useState<string>(
    '[1, 2, 0, null].filter(nonNullable) '
  );
  const [output, setOutput] = useState<string>('[1, 2, 0]: number[]');
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const llm = useRef<Ollama | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    if (!spec || !input || !output) {
      setCode('Please fill out all fields');
      return;
    }

    if (!llm.current) {
        llm.current = new Ollama({
          model: 'codellama',
          baseUrl: 'http://localhost:11434',
        });
    }

    const formattedPrompt = await prompt.format({
      spec,
      input,
      output,
    });

    try {
      const llmResult = await llm.current.predict(formattedPrompt);
      llmResult && setCode(llmResult);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError('Something went wrong. Check the console for more info.');
    }
  };

  return (
    <div className="container">
      <header>
        <h2>Ollama</h2>
        {error && <div className="alert">{error}</div>}
      </header>
      <code>
        <pre>{loading ? 'waiting...' : code}</pre>
      </code>
      <form>
        <div className="field">
          <label>Function Spec</label>
          <textarea
            name="spec"
            id="spec"
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Function Input</label>
          <textarea
            name="input"
            value={input}
            id="input"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Function Output</label>
          <textarea
            name="output"
            value={output}
            id="output"
            onChange={(e) => setOutput(e.target.value)}
          />
        </div>
        <button type="button" onClick={() => handleSubmit()}>
          Ask the Ai
        </button>
      </form>
    </div>
  );
}

export default App;
