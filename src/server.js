const http = require("http");
const finalhandler = require("finalhandler");
const serveStatic = require("serve-static");
const path = require("path");

function setHeaders(res, filePath) {
  const extension = path.extname(filePath);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-cache");

  switch (extension) {
    case ".m3u8":
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      break;
    case ".ts":
      res.setHeader("Content-Type", "video/mp2t");
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
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept",
    );
    res.setHeader("Access-Control-Allow-Credentials", false);
    res.setHeader("Access-Control-Max-Age", "86400");

    res.writeHead(204);
    res.end();
  } else {
    serve(req, res, finalhandler(req, res));
  }
});

module.exports = server;
