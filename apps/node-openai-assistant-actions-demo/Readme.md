# node-openai-assistant-actions-demo

A simple react app the uses the openai node sdk to chat with an assistant.
This Assistant has access to functions/actions!

To create an assistant login to openai ai go to: https://platform.openai.com/assistants (can also be done through the api)

Assistant prompt:

```
You are an very enthusiastic ChatBot that loves colors, and what to help the user with anything color related!

Always ask the user what their favorite color is!

You are able to use provided functions to change the color or the chat interface for the user, to match the colors they like.
```

Actions:

```
{
  "name": "set_background_color",
  "parameters": {
    "type": "object",
    "properties": {
      "red": {
        "type": "number",
        "description": "The Red value for the RGB color used for the background"
      },
      "green": {
        "type": "number",
        "description": "The Green value for the RGB color used for the background"
      },
      "blue": {
        "type": "number",
        "description": "The Blue value for the RGB color used for the background"
      }
    },
    "required": [
      "red",
      "green",
      "blue"
    ]
  },
  "description": "Sets the color of the background of the chat application"
}
```

```
{
  "name": "set_foreground_color",
  "parameters": {
    "type": "object",
    "properties": {
      "red": {
        "type": "number",
        "description": "The Red value for the RGB color used for the foreground"
      },
      "green": {
        "type": "number",
        "description": "The Green value for the RGB color used for the foreground"
      },
      "blue": {
        "type": "number",
        "description": "The Blue value for the RGB color used for the foreground"
      }
    },
    "required": [
      "red",
      "green",
      "blue"
    ]
  },
  "description": "Sets the color of the foreground of the chat application"
}
```

## DISCLAIMER

**This runs 100% client side which is not recommended for production as the Token is exposed in the browser**  
This was chosen for the simplicity of this demo!

**This is using the OpenAI GPT model, remember to follow the AI Guidelines:**  
https://trackunit.atlassian.net/wiki/spaces/COM/pages/3577872389/Company+policies?preview=/3577872389/4298211442/AI-tool-policy.pdf

## How to run

Run `nx run apps/node-openai-assistant-actions-demo:serve` to serve.

## Resources:

OpenAI sdk docs: https://platform.openai.com/docs/quickstart?context=node  
OpenAI Assistants: https://platform.openai.com/assistants  
OpenAI tokens: https://platform.openai.com/api-keys  
How to get access to openai API at Trackunit: https://www.dropbox.com/scl/fi/7s0xqafm6krvd3sd6aii8/OpenAI-API-Access-at-Trackunit.paper?rlkey=8rb24jm2r7ny88xkqp1ru3mqc&dl=0

## How it looks:

![Screenshot of the app](./openai-assistant-actions.png)
