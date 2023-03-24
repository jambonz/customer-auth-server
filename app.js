const express = require('express');
const config = require('config');
const router = require('./lib/router');

const app = express();
app.use(express.json());

const listenPort = config.get('server.port');
const listenPath = config.get('server.path');

console.log(`http auth server config: ${JSON.stringify(config)}`);

app.listen(listenPort, () => {
  console.log(`http auth server listening on ${listenPort}`);
});

// use basic auth if configured
if (config.has('server.auth')) {
  const basicAuth = require('express-basic-auth');
  app.use(basicAuth(config.get('server.auth')));
}

app.post(listenPath, router);
