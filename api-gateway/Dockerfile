FROM nginx:latest

COPY ./api-gateway.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]