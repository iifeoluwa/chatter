FROM node:10-alpine

WORKDIR /home/chatter/webhook

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g typescript

CMD npm start