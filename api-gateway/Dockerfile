FROM nginx:latest

# Remove default server
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy your API Gateway config
COPY ./api-gateway.conf /etc/nginx/conf.d/


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]