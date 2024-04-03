const { launch } = require("puppeteer");
const FfmpegCommand = require("fluent-ffmpeg");

const from = process.env.STREAM_FROM || "https://google.com";
const to = process.env.STREAM_TO || "rtmp://localhost:1935/stream/test";

async function start() {
  const size = {
    width: 1280,
    height: 720,
  };
  const browser = await launch({
    headless: true,
    executablePath: process.env.CHROME_BIN || null,
    defaultViewport: size,
    args: [`--window-size=${size.width},${size.height}`, "--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(from);
  await page.mouse.down();
  const stream = await page.screencast();

  FfmpegCommand()
    .input(stream)
    .videoCodec("libx264")
    .audioCodec("aac")
    .addOption("-fflags nobuffer")
    .size(`${size.width}x${size.height}`)
    .format("flv")
    .output(to)
    .on("start", console.log)
    .on("error", () => {
      browser.close();
      start();
    })
    .run();
}

start();
