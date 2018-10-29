FROM mhart/alpine-node:10
WORKDIR /consumers
COPY package.json package-lock.json ./

RUN echo "http://dl-2.alpinelinux.org/alpine/v3.7/community" >> /etc/apk/repositories; \
    echo "http://dl-3.alpinelinux.org/alpine/v3.7/community" >> /etc/apk/repositories; \
    echo "http://dl-4.alpinelinux.org/alpine/v3.7/community" >> /etc/apk/repositories; \
    echo "http://dl-5.alpinelinux.org/alpine/v3.7/community" >> /etc/apk/repositories
RUN apk add make gcc g++ python

RUN npm install

COPY . .

RUN npm run build

# Remove dev dependencies
RUN npm prune --production

ENV NODE_ENV=production

CMD ["npm", "start"]