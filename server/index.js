const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const key = ec.genKeyPair();

const secp = require("ethereum-cryptography/secp256k1");
const { recoverPublicKey } = require("@noble/secp256k1");
const {
  toHex,
  utf8ToBytes,
  hexToBytes,
} = require("ethereum-cryptography/utils");

let publicKey1 =
  "045e5097674c2cc499ba1c23d4b5a2fb324e0f221fe50959c20e01c0ebaca0c8b953c8f1b051441927027e97c418794a6dfaa3cac03bbb0fa46fda81b3812bdb12";
let privateKey1 =
  "8f4d3d2d519de2fa1371725a87d825ada638c04e188f80769131d22b56ef03a9";

let publicKey2 =
  "04040a9416e092766fa6aa5a675cc1400d8fe014d594ad83c1472d2fef987ff5632aa811aa44887ac89d84ae162cd37aeb4f292135d4e52defc7f4fadf91b6972b";
let privateKey2 =
  "15c0674c74f3d6bef2ddb7ce7b836decfdf86e11d0108e940290a2e4aa361eee";

let publicKey3 =
  "04307afbcaa6dc262445bb5869a7e301d69423f1a11f29d8ffa9cb20ac7c104204f5b53fd5e601137fe141907407d35ef7e059bb1bdebd9bc1c35505d1b2109a0b";
let privateKey3 =
  "10a2e10e44ecac8efb4c70c713b0d0e13a4a86e7ada910cff9a32bd35cc0e506";

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const balances = {
  "045e5097674c2cc499ba1c23d4b5a2fb324e0f221fe50959c20e01c0ebaca0c8b953c8f1b051441927027e97c418794a6dfaa3cac03bbb0fa46fda81b3812bdb12": 100,
  "04040a9416e092766fa6aa5a675cc1400d8fe014d594ad83c1472d2fef987ff5632aa811aa44887ac89d84ae162cd37aeb4f292135d4e52defc7f4fadf91b6972b": 50,
  "04307afbcaa6dc262445bb5869a7e301d69423f1a11f29d8ffa9cb20ac7c104204f5b53fd5e601137fe141907407d35ef7e059bb1bdebd9bc1c35505d1b2109a0b": 75,
};
// console.log(balances);
/*
Get keys
console.log({
  privateKey: key.getPrivate().toString(16),
  publicKey: key.getPublic().encode("hex"),
});
*/

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  // console.log(balances);
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, privateKey, recipient, amount } = req.body;
  // console.log(req.body);
  // receive privateKey from client
  let check = secp.getPublicKey(privateKey);
  console.log(toHex(check));
  console.log(sender);
  // if public key produced from above function == public key passed in from server, pass authentication - else fail!
  if (toHex(check) === sender) {
    console.log("it worked!");
    balances[sender] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
    res.send({ balance: balances[sender] });
  }else{
    console.log("it failed!");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

// receive privateKey from client
// secp.getPublicKey(privateKey);

// if public key produced from above function == public key passed in from server, pass authentication - else fail!