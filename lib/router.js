const config = require("config");
const { calculateResponse } = require("./utils");

module.exports = function routeCall(req, res) {
  const { expires } = req.body;
  console.log(
    `received incoming call with expires ${expires} and body ${JSON.stringify(
      req.body
    )}`
  );

  const credsDb = config.get("credentials");
  if (!Object.keys(credsDb).find((r) => r === req.body.realm)) {
    console.log(`unknown realm value ${req.body.realm}`);
    return res.json({ status: "fail", msg: "unknown realm" });
  }

  const credentials = credsDb[req.body.realm].find(
    (c) => c.username === req.body.username
  );
  if (!credentials) {
    console.log(`unknown username ${req.body.username}`);
    return res.json({ status: "fail", msg: "unknown user" });
  }

  const myResponse = calculateResponse(req.body, credentials.password);
  if (myResponse === req.body.response) {
    const configuredExpires = credentials.expires ? +credentials.expires : 45;
    const grantedExpires = Math.min(expires, configuredExpires);
    console.log(`authorized request, granting expires ${grantedExpires}`);
    const payload = {
      status: "ok",
      expires: grantedExpires,
      call_hook: credentials.call_hook ? credentials.call_hook : null,
      call_status_hook: credentials.call_status_hook
        ? credentials.call_status_hook
        : null,
    };
    // remove possible empty values
    Object.keys(payload).forEach((k) => payload[k] == null && delete payload[k])
    return res.json(payload);
  }
  console.log(`invalid password supplied ${req.body.username}`);
  return res.json({ status: "fail", msg: "invalid password" });
};
