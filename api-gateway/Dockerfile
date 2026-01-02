FROM nginx:latest

RUN apt-get update && apt-get install -y \
    wget \
    libnss3-tools \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN wget -O /usr/local/bin/mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64 \
    && chmod +x /usr/local/bin/mkcert


RUN mkdir -p /etc/nginx/certs



COPY ssl_script.sh /docker-entrypoint.d/01-generate-certs.sh
RUN chmod +x /docker-entrypoint.d/01-generate-certs.sh

# Remove default server
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy your API Gateway config
COPY ./api-gateway.conf /etc/nginx/conf.d/


EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]