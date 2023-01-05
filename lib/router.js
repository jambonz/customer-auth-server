const config = require('config') ;
const {calculateResponse} = require('./utils');

module.exports = function routeCall(req, res) {
  const {expires} = req.body;
  console.log(`received incoming call with body ${JSON.stringify(req.body)}`);

  const credsDb = config.get('credentials');
  if (!Object.keys(credsDb).find((r) => r === req.body.realm)) {
    console.log(`unknown realm value ${req.body.realm}`);
    return res.json({status: 'fail', msg: 'unknown realm'});
  }

  const credentials = credsDb[req.body.realm].find((c) => c.username === req.body.username);
  if (!credentials) {
    console.log(`unknown username ${req.body.username}`);
    return res.json({status: 'fail', msg: 'unknown user'});
  }

  const myResponse = calculateResponse(req.body, credentials.password);

  if (myResponse === req.body.response) {
    console.log('authorized request');
    return res.json({
      status: 'ok',
      expires: expires < 45 ? 45 : expires,
      call_hook: 'http://127.0.0.1/call',
      call_status_hook: 'http://127.0.0.1/call-status'
    });
  }
  console.log(`invalid password supplied ${req.body.username}`);
  return res.json({status: 'fail', msg: 'invalid password'});
} ;
