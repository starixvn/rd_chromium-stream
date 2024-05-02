FROM node:alpine
ENV STREAM_FROM "https://www.youtube.com/embed/qZcSgGQc4-I?autoplay=1"
ENV USE_GPU "false"
ENV BROWSER_TOKEN "rd"
ENV BROWSER_WS_ENDPOINT "wss://browserless.lumigame.com/"

RUN apk add ffmpeg --no-cache
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "src/index.js"]
