const launchBrowser = require("./browser");
const sendStream = require("./ffmpeg");

async function start() {
  const from =
    process.env.STREAM_FROM ||
    "https://www.youtube.com/embed/qZcSgGQc4-I?autoplay=1";

  const stream = await launchBrowser(from);

  sendStream(stream);
}

start();
