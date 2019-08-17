const config = require('config') ;
const {calculateResponse} = require('./utils');
const debug = require('debug')('jambonz:auth');

module.exports = function routeCall(req, res) {
  debug(`received incoming call with body ${JSON.stringify(req.body)}`);

  const credsDb = config.get('credentials');
  if (!Object.keys(credsDb).find((r) => r === req.body.realm)) {
    console.log(`unknown realm value ${req.body.realm}`);
    return res.json({status: 'fail', msg: 'unknown realm'});
  }

  const credentials = credsDb[req.body.realm].find((c) => c.username === req.body.username);
  if (!credentials) {
    debug(`unknown username ${req.body.username}`);
    return res.json({status: 'fail', msg: 'unknown user'});
  }

  const myResponse = calculateResponse(req.body, credentials.password);

  if (myResponse === req.body.response) {
    debug('authorized request');
    return res.json({status: 'ok'});
  }
  debug(`invalid password supplied ${req.body.username}`);
  return res.json({status: 'fail', msg: 'invalid password'});
} ;
