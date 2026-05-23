FROM node:18-alpine

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY server.js server.js

EXPOSE 3001

CMD ["node", "server.js"]