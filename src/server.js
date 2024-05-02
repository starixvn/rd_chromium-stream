const HLSServer = require("hls-server");
const http = require("http");

const server = http.createServer();

new HLSServer(server, {
  path: "/live",
  dir: "hls",
});

module.exports = server;
