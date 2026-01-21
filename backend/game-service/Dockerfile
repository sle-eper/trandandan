FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY src ./src

EXPOSE 4000

ENV PORT=4000

CMD ["npm", "run", "dev"]
