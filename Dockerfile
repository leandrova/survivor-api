FROM node:10
MAINTAINER Leandro Viana <leandroviana@gmail.com>

RUN mkdir -p /home/node/survivor-api/app/node_modules && chown -R node:node /home/node/survivor-api
WORKDIR /home/node/survivor-api/app

COPY package*.json ./
RUN npm install
COPY ./app/ .
RUN echo "" > /home/node/survivor-api/.env

USER node

EXPOSE 3000

CMD [ "node", "app.js" ]
