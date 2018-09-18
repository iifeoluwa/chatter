FROM node:10-alpine

WORKDIR /home/troulette/webhook

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g typescript

EXPOSE 8080

CMD npm run dev