import express, { Response } from "express";
import { extname } from "path";
import cors from "cors";
import bundle from "express-prom-bundle";

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

app.use(
  bundle({
    includeMethod: true,
    includePath: true,
    promClient: {
      collectDefaultMetrics: {},
    },
    normalizePath: [
      ["^/720p30.*.ts", "/720p30.ts"],
      ["^/480p30.*.ts", "/480p30.ts"],
    ],
  }),
);
app.use(cors());
app.use(express.static("hls", { setHeaders }));
app.use(express.static("public"));

export default app;
