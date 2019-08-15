FROM node:alpine AS builder

WORKDIR /app

COPY WebClient/lama .

RUN npm install && \
    npm run build

FROM nginx:alpine

COPY --from=builder /app/dist/lama/* /usr/share/nginx/html/