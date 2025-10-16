FROM node:18

WORKDIR /app

COPY ./package.json ./
RUN npm install
    
RUN mkdir -p /app/data && chmod 777 /app/data
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
