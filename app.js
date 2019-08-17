const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();
const config = require('config');
const router = require('./lib/router');

const listenPort = config.get('server.port') ;
const path = config.has('server.path') ? config.get('server.path') : '/';

app.listen(listenPort, () => {
  console.log(`http auth server listening on ${listenPort}`);
});

// use basic auth if configured
if (config.has('server.auth')) {
  const basicAuth = require('express-basic-auth');
  app.use(basicAuth(config.get('server.auth')));
}

app.post(path, jsonParser, router) ;
