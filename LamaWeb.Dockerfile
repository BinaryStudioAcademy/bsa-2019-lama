FROM node:alpine AS builder

WORKDIR /app

COPY WebClient/lama .

RUN npm install && \
    npm run prod

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html/
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf