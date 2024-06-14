import cors from "cors";
import express, { Response } from "express";
import bundle, { Opts, normalizePath } from "express-prom-bundle";
import { statSync } from "fs";
import { extname } from "path";
import { Histogram } from "prom-client";

const app = express();
const summary = new Histogram({
  name: "hls_bytes",
  help: "hls transfer in bytes",
  labelNames: ["path"],
  buckets: [
    64, 256, 1024, 4096, 16384, 65536, 262144, 524288, 1048576, 4194304, 16777216,
  ],
});
const metricOptions: Opts = {
  includeMethod: true,
  includePath: true,
  promClient: {
    collectDefaultMetrics: {},
  },
  normalizePath: [
    ["^.*/720p30.*.ts", "/720p30.ts"],
    ["^.*/480p30.*.ts", "/480p30.ts"],
    ["^.*/720p30.*.m3u8", "/720p30.m3u8"],
    ["^.*/480p30.*.m3u8", "/480p30.m3u8"],
    ["^.*/live.*.m3u8", "/live.m3u8"],
  ],
};

export function setHeaders(response: Response, filePath: string) {
  summary.observe(
    { path: normalizePath({ url: filePath } as any, metricOptions) },
    statSync(filePath).size,
  );

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

app.use(bundle(metricOptions));
app.use(cors({ origin: "*" }));
app.use(express.static("public"));
app.use(express.static("hls", { setHeaders }));

export default app;
