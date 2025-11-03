FROM nginx:latest

COPY ./api-gateway.conf /etc/nginx/conf.d/api-gateway.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]