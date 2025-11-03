# ---- Base image ----
    FROM node:18-bullseye

    # Set working directory inside container
    WORKDIR /usr/src/app
    
    # Install dependencies
    COPY package*.json ./
    RUN npm ci && npm cache clean --force
    
    # Copy source code and public assets
    COPY src ./src
    COPY public ./public
    
    # Expose server port
    EXPOSE 3000
    
    # Start in dev mode (can switch to prod in compose)
    CMD ["npm", "run", "dev"]
    