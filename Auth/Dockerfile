FROM node:18

WORKDIR /Auth

COPY package*.json ./

RUN npm install --legacy-peer-deps --no-audit --no-fund


COPY . .
RUN touch /Auth/DataBase/mydatabase.db

EXPOSE 3000

CMD ["node", "server.js"]
