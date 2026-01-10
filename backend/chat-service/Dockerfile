FROM node:20

WORKDIR /app

# 🔑 Install build tools for native modules
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install dotenv
RUN npm i -D @types/node



# Let node-gyp know python path (important)
ENV PYTHON=/usr/bin/python3


RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
