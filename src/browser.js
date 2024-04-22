const { connect } = require("puppeteer");

const browserWSEndpoint =
  process.env.BROWSER_WS_ENDPOINT || "ws://localhost:3000";

const browserToken = process.env.BROWSER_TOKEN || "token";

async function launch(url) {
  console.log(`Opening ${url}`);

  const size = {
    width: 854,
    height: 480,
  };

  const launchArgs = JSON.stringify({
    defaultViewport: size,
    args: [
      `--window-size=${size.width},${size.height}`,
      "--autoplay-policy=no-user-gesture-required",
      "--use-gl=angle",
      "--use-angle=gl",
    ],
  });

  const browser = await connect({
    browserWSEndpoint: `${browserWSEndpoint}?token=${browserToken}&launch=${launchArgs}`,
  });

  const page = await browser.newPage();

  await page.goto(url);

  return { browser, stream: await page.screencast() };
}

module.exports = launch;
