FROM node:18

WORKDIR /Auth

COPY package*.json ./

RUN npm install --legacy-peer-deps --no-audit --no-fund
RUN npm ci && npm cache clean --force


COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
