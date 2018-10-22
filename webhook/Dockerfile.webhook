FROM mhart/alpine-node:10
WORKDIR /app
COPY package.json package-lock.json ./

RUN apk add --no-cache make gcc g++ python

RUN npm install

COPY . .

RUN npm run build
# Remove dev dependencies
RUN npm prune --production

ENV NODE_ENV=production

CMD ["npm", "start"]