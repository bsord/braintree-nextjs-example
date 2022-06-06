const braintree = require("braintree");

const btGateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "",
  publicKey: "",
  privateKey: ""
});

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  console.log(req.body)
  const clientNonce = req.body.nonce;
  const deviceData = req.body.deviceData;
  const amount = req.body.amount;
  return new Promise((resolve,reject) => {
    createTransaction(clientNonce, deviceData, amount).then(transaction => {
      console.log(transaction.transaction.id)
      res.json(transaction);
    }).catch(error => {
      console.log(error)
      res.json(error);
      res.status(405).end();
    });
  })
}

export function createTransaction(clientNonce, deviceData, amount) {
  return new Promise((resolve,reject) => {
    btGateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: clientNonce,
      deviceData: deviceData,
      options: {
        submitForSettlement: true
      }
    }).then(result => {
      resolve(result)
    }).catch(error => {
      reject(error)
    });;
  })
}
