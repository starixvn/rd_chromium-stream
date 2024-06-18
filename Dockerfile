FROM node:alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nvidia/cuda:12.4.1-runtime-ubuntu20.04
ENV STREAM_FROM "https://www.youtube.com/embed/qZcSgGQc4-I?autoplay=1"
ENV FFMPEG_GPU 1
ENV PORT 5000
ENV BROWSER_ENDPOINT "wss://browserless.lumigame.com/"
ENV BROWSER_TOKEN rd
ENV BROWSER_HEIGHT 720
ENV BROWSER_WIDTH 1280

RUN apt-get update && apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg --yes
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
    | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install -y nodejs ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY public public
COPY hls hls
COPY --from=builder /app/dist dist
EXPOSE 5000
CMD ["node", "dist/index.js"]
