import { config } from "dotenv";
import launch from "./browser";
import express from "./express";
import ffmpeg from "./ffmpeg";
import logger from "./logger";

config();

async function start() {
  const { browser, stream } = await launch({
    url: process.env.STREAM_FROM || "https://google.com",
    browserEndpoint: process.env.BROWSER_ENDPOINT || "wss://browserless:3000",
    browserToken: process.env.BROWSER_TOKEN,
    height: Number(process.env.BROWSER_HEIGHT || 0),
    width: Number(process.env.BROWSER_WIDTH || 0),
  });

  ffmpeg({
    gpu: process.env.FFMPEG_GPU === "true",
    stream: stream,
    onError: () => {
      browser.close();
    },
    resolutions: [
      {
        size: "?x480",
        aspect: "16:9",
        name: "480p30",
        fps: 30,
        videoBitrate: "256k",
      },
      {
        size: "?x720",
        aspect: "16:9",
        name: "720p30",
        fps: 30,
        videoBitrate: "768k",
      },
    ],
  });

  process.on("SIGTERM", () => browser.close());
}

start().catch((error) => {
  logger.error(error);

  start();
});

const port = Number(process.env.PORT || 5000);

express.listen(port, () => {
  logger.info(`Server is running http://localhost:${port}`);
});
