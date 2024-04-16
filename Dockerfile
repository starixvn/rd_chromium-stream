ARG UBUNTU_VERSION=22.04
ARG CUDA_VERSION=12.4.1
FROM nvidia/cuda:${CUDA_VERSION}-runtime-ubuntu${UBUNTU_VERSION}
ENV STREAM_FROM "https://google.com"
ENV USE_GPU "true"
ENV CHROME_BIN=/usr/bin/google-chrome

RUN apt-get update && apt-get install -y ca-certificates curl gnupg
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg --yes
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install -y nodejs

RUN apt-get install -y ffmpeg chromium-browser

WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "src/index.js"]
