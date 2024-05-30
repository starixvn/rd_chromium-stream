import express, { Response } from "express";
import { extname } from "path";
import cors from "cors";
import logger from "./logger";

const app = express();

export function setHeaders(response: Response, filePath: string) {
  switch (extname(filePath)) {
    case ".m3u8":
      response.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      response.setHeader("Cache-Control", "no-cache");
      break;
    case ".ts":
      response.setHeader("Content-Type", "video/mp2t");
      response.setHeader("Cache-Control", "no-cache");
      break;
  }
}

app.use(cors());
app.use(express.static("hls", { setHeaders }));
app.use(express.static("public"));

export default app;
