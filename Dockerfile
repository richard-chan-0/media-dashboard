FROM node:18-alpine AS builder

ARG VITE_MEDIA_UTILITY_API_LINK
ARG VITE_FFMPEG_UTILITY_API_LINK

ENV VITE_MEDIA_UTILITY_API_LINK=$VITE_MEDIA_UTILITY_API_LINK
ENV VITE_FFMPEG_UTILITY_API_LINK=$VITE_FFMPEG_UTILITY_API_LINK

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
