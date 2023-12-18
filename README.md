# AiHackatonDec2023

This repository contains some simple apps that integrate with different LLMs.  
The aim is to give anyone a running start playing around with AI features!

## Apps:

- [langchain-ollama-demo](./apps/langchain-ollama-demo/Readme.md)
  - Using langchain and ollama to work with a set of fully local llm models.
- [langchain-openai-demo](./apps/langchain-openai-demo/Readme.md)
  - Using langchain with openai to get access to the GPT-4 models (replica of the Ollama example for model comparison).
- [node-openai-assistant-demo](./apps/node-openai-assistant-demo/Readme.md)
  - Using the openai node sdk directly to work with the Assistants concept.
- [node-openai-assistant-actions-demo](apps/node-openai-assistant-actions-demo/Readme.md)
  - Using the openai node sdk directly to work with the Assistants concept and giving the assistant the functions to change the colors of the UI.

## DISCLAIMER

**Some of these apps runs 100% client side which is not recommended for production as the Token is exposed in the browser**  
This was chosen for the simplicity of this demo!

**Some of these apps uses the OpenAI GPT model, remember to follow the AI Guidelines:**  
https://trackunit.atlassian.net/wiki/spaces/COM/pages/3577872389/Company+policies?preview=/3577872389/4298211442/AI-tool-policy.pdf

## Screenshots:

| [langchain-ollama-demo](./apps/langchain-ollama-demo/Readme.md)                 |         [langchain-openai-demo](./apps/langchain-openai-demo/Readme.md)         |      [node-openai-assistant-demo](./apps/node-openai-assistant-demo/Readme.md)       |        [node-openai-assistant-actions-demo](apps/node-openai-assistant-actions-demo/Readme.md) |
| ------------------------------------------------------------------------------- | :-----------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | ---------------------------------------------------------------------------------------------: |
| ![Screenshot of the app](./apps/langchain-ollama-demo/ollama-langchain-app.png) | ![Screenshot of the app](./apps/langchain-openai-demo/openai-langchain-app.png) | ![Screenshot of the app](./apps/node-openai-assistant-demo/openai-assistant-app.png) | ![Screenshot of the app](apps/node-openai-assistant-actions-demo/openai-assistant-actions.png) |
