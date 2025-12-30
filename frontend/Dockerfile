FROM node:20-alpine

WORKDIR /app

COPY ./*.json ./

RUN npm install 

COPY ./index.html ./
# COPY ./chat-frontend ./
# COPY ./spy_frontend ./
# COPY ./auth_frontend ./
# COPY ./profile_frontend ./
COPY ./vite.config.js ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
