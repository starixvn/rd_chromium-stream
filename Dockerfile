ARG UBUNTU_VERSION=22.04
ARG CUDA_VERSION=12.4.1
FROM nvidia/cuda:${CUDA_VERSION}-runtime-ubuntu${UBUNTU_VERSION}
ENV STREAM_FROM "https://google.com"
ENV USE_GPU "true"
ENV CHROME_BIN=/usr/bin/chromium-browser
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get update && apt-get -y install nodejs ffmpeg
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "src/index.js"]
