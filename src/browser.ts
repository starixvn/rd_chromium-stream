import { connect } from "puppeteer";
import logger from "./logger";
import { ok } from "assert";

export interface BrowserOptions {
  browserEndpoint: string;
  browserToken?: string;
  url: string;
  width?: number;
  height?: number;
}

export default async function launch(options: BrowserOptions) {
  ok(!!options);
  ok(!!options.url);
  ok(!!options.browserEndpoint);

  logger.info(`Opening ${options.url}`);

  const size = {
    width: options.width || 1280,
    height: options.height || 720,
  };

  const args = JSON.stringify({
    defaultViewport: size,
    args: [
      `--window-size=${size.width},${size.height}`,
      "--autoplay-policy=no-user-gesture-required",
      "--use-gl=angle",
      "--use-angle=gl",
    ],
  });

  const queries = `token=${options.browserToken}&launch=${args}`;
  const browserWSEndpoint = `${options.browserEndpoint}?${queries}`;

  const browser = await connect({ browserWSEndpoint });
  const page = await browser.newPage();

  await page.goto(options.url);

  const stream = await page.screencast();

  return { browser, stream };
}
