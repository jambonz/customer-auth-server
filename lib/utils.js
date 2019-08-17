const crypto = require('crypto');

function calculateResponse({username, realm, method, nonce, uri, nc, cnonce, qop}, password) {
  const ha1 = crypto.createHash('md5');
  ha1.update([username, realm, password].join(':'));
  const ha2 = crypto.createHash('md5');
  ha2.update([method, uri].join(':'));

  // Generate response hash
  const response = crypto.createHash('md5');
  const responseParams = [
    ha1.digest('hex'),
    nonce
  ];

  if (cnonce) {
    responseParams.push(nc);
    responseParams.push(cnonce);
  }

  if (qop) {
    responseParams.push(qop);
  }
  responseParams.push(ha2.digest('hex'));
  response.update(responseParams.join(':'));

  return response.digest('hex');
}

module.exports = { calculateResponse };
