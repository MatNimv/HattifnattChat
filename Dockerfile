## Build Environment
FROM node:16

# Build steps
ADD . /app
WORKDIR /app

RUN npm install

COPY package.json package*.json ./

CMD ["node", "server.js"];
