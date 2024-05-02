const http = require("http");
const finalhandler = require("finalhandler");
const serveStatic = require("serve-static");
const path = require("path");

function setHeaders(res, filePath) {
  const extension = path.extname(filePath);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  switch (extension) {
    case ".m3u8":
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      break;
    case ".ts":
      res.setHeader("Content-Type", "video/MP2T");
      break;
  }
}

const serve = serveStatic("hls", {
  index: false,
  cacheControl: false,
  maxAge: 0,
  setHeaders: setHeaders,
});

const server = http.createServer(function onRequest(req, res) {
  serve(req, res, finalhandler(req, res));
});

module.exports = server;
