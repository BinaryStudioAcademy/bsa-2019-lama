FROM node:alpine AS builder

WORKDIR /app

COPY WebClient/lama .

RUN apt-get update && \
    apt-get install python && \
    npm install && \
    npm run prod

FROM nginx:alpine

COPY --from=builder /app/dist/lama/* /usr/share/nginx/html/
COPY --from=builder /app/dist/lama/assets/* /usr/share/nginx/html/assets/
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf
