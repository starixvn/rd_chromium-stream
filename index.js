const { launch } = require("puppeteer");
const FfmpegCommand = require("fluent-ffmpeg");

const from = process.env.STREAM_FROM || "https://google.com";

async function start() {
  const size = {
    width: 640,
    height: 360,
  };
  const browser = await launch({
    headless: true,
    executablePath: process.env.CHROME_BIN || null,
    defaultViewport: size,
    args: [
      `--window-size=${size.width},${size.height}`,
      "--no-sandbox",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });

  const page = await browser.newPage();
  await page.goto(from);
  await page.mouse.down();
  const stream = await page.screencast();

  const hlsOptions = [
    "-hls_time 0",
    "-hls_list_size 3",
    "-hls_delete_threshold 1",
    "-hls_flags delete_segments",
    "-strftime 1",
  ];

  FfmpegCommand()
    .input(stream)
    .videoCodec("libx264")
    .audioCodec("aac")
    .size(`${size.width}x${size.height}`)
    .format("hls")
    .outputOption(hlsOptions)
    .output("hls/live.m3u8")
    .on("start", console.log)
    .on("error", () => {
      browser.close();
      start();
    })
    .run();
}

start();
