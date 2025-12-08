FROM node:18

WORKDIR /tournament

COPY package*.json ./

RUN npm install --legacy-peer-deps --no-audit --no-fund
RUN npm ci && npm cache clean --force


COPY . .

CMD ["npm", "run", "dev"]
