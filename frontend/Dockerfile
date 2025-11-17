FROM node:20-alpine

WORKDIR /app

COPY ./*.json ./

RUN npm install 

COPY ./index.html ./
COPY ./chat-frontend ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
