ARG UBUNTU_VERSION=22.04
ARG CUDA_VERSION=12.4.1
FROM nvidia/cuda:${CUDA_VERSION}-runtime-ubuntu${UBUNTU_VERSION}
ENV STREAM_FROM "https://google.com"
ENV USE_GPU "true"
ENV CHROME_BIN=/usr/bin/chromium-browser
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && nvm install 20
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "src/index.js"]
