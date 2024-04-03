FROM node:alpine
ENV STREAM_FROM "https://google.com"
ENV STREAM_TO "rtmp://localhost:1935/stream/test"
ENV CHROME_BIN=/usr/bin/chromium-browser
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories
RUN apk add ffmpeg chromium@edge nss@edge --no-cache
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "index.js"]
