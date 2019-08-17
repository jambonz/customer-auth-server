const config = require('config') ;

module.exports = function routeCall(req, res) {
  console.log(`received incoming call with body ${JSON.stringify(req.body)}`);

  const credsDb = config.get('credentials');
  if (!Object.keys(credsDb).find(req.body.realm)) {
    console.log(`unknown realm value ${req.body.realm}`);
    return res.json({status: 'fail', 'msg': 'unknown realm'});
  }

  const credentials = credsDb[req.body.realm].find((c) => c.username === req.body.username);
  if (!credentials) {
    console.log(`unknown username ${req.body.username}`);
    return res.json({status: 'fail', 'msg': 'unknown user'});
  }

  // TODO: calculate A1 hash etc and verify response


  res.json({status: 'ok'});
} ;
