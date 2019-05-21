# Visit Gent Chatbot

This is a chatbot for [Visit-Gent](https://visit.gent.be/en). It is implemented with [Microsoft Bot Framework](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0) in Typescript.

## Prerequisites

- Nodejs
- NPM

## Setup

- Clone the repository

```bash
git clone https://github.com/lab9k/visit-gent-botframework.git
```

- Install dependencies

```bash
cd ./visit-gent-botframework
npm install
```

- Run development server

```bash
npm run watch
```

- Build and run in production mode

```bash
npm run build
node ./lib/index.js
```

## interaction

You can interact with the bot in different ways.

- In development mode

Use the [Microsoft Botframework Emulator](https://github.com/microsoft/BotFramework-Emulator)

- In production mode

Deploy the bot on azure with [this guide](https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-deploy-az-cli?view=azure-bot-service-4.0)

When deployed, you can enable different channels to communicate trough. (Facebook, Webchat, etc...)
