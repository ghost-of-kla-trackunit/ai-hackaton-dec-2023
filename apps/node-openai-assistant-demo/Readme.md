# node-openai-assistant-demo

A simple react app the uses the openai node sdk to chat with an assistant.
To create an assistant login to openai ai go to: https://platform.openai.com/assistants (can also be done through the api)

## DISCLAIMER

**This runs 100% client side which is not recommended for production as the Token is exposed in the browser**  
This was chosen for the simplicity of this demo!

**This is using the OpenAI GPT model, remember to follow the AI Guidelines:**  
https://trackunit.atlassian.net/wiki/spaces/COM/pages/3577872389/Company+policies?preview=/3577872389/4298211442/AI-tool-policy.pdf

## How to run

Run `nx run apps/node-openai-assistant-demo:serve` to serve.

## Resources:

OpenAI sdk docs: https://platform.openai.com/docs/quickstart?context=node  
OpenAI Assistants: https://platform.openai.com/assistants  
OpenAI tokens: https://platform.openai.com/api-keys  
How to get access to openai API at Trackunit: https://www.dropbox.com/scl/fi/7s0xqafm6krvd3sd6aii8/OpenAI-API-Access-at-Trackunit.paper?rlkey=8rb24jm2r7ny88xkqp1ru3mqc&dl=0

## How it looks:

![Screenshot of the app](./openai-assistant-app.png)
