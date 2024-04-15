const { launch: launchBrowser } = require("puppeteer");

async function launch(url) {
  const size = {
    width: 1280,
    height: 720,
  };

  const gpuOptions = [
    "--use-gl=angle",
    "--use-angle=gl-egl",
    "--use-cmd-decoder=passthrough",
  ];

  const browser = await launchBrowser({
    headless: true,
    executablePath: process.env.CHROME_BIN || null,
    defaultViewport: size,
    args: [
      ...gpuOptions,
      `--window-size=${size.width},${size.height}`,
      "--no-sandbox",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });

  const page = await browser.newPage();

  await page.goto(url);

  return await page.screencast();
}

module.exports = launch;
