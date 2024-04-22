const launchBrowser = require("./browser");
const sendStream = require("./ffmpeg");

async function start() {
  const from =
    process.env.STREAM_FROM ||
    "https://www.youtube.com/embed/qZcSgGQc4-I?autoplay=1";

  const { browser, stream } = await launchBrowser(from);

  try {
    sendStream(stream);
  } catch (error) {
    browser.close();
  }

  process.on("SIGTERM", () => browser.close());
}

start().catch(console.error);
