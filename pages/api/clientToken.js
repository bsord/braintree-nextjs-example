const braintree = require("braintree");

const btGateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "",
  publicKey: "",
  privateKey: ""
});

export default function handler(req, res) {
  return new Promise((resolve,reject) => {
    generateClientToken().then(clientToken => {
      res.json(clientToken);
      resolve();
    }).catch(error => {
      res.json(error);
      res.status(405).end();
      resolve();
    });
  })
}

export function generateClientToken() {
  return new Promise((resolve,reject) => {
    btGateway.clientToken.generate({}).then(btResponse => {
      resolve(btResponse);
    }).catch(error => {
      resolve(error);
    });
  })
}
