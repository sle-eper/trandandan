FROM node:20-alpine

WORKDIR /app

COPY ./*.json ./

RUN npm install 

COPY ./index.html ./
COPY ./chat-frontend ./
COPY ./auth_frontend ./
COPY ./profile_frontend ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
