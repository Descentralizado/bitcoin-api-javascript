/**
 * Objetivo transacao entre enderecos
 * Entrada: from, to, value, fee
 * Saida: Hash / Erro
 *  */

const axios = require('axios').default;

 //responsavel pela interacao com o no

const rpcuser = 'daniel';
const rpcpassword = 'u9phrqQafychcG9PcZqTD0UYpX5CtjdaJLTEo2UVf0Y=';

async function api(method, params = [], route = '') {
  return await axios.post(`http://159.89.53.60:18332/${route}`, { "id": "0", "method": `${method}`, "params": params }, {
    auth: {
      username: rpcuser,
      password: rpcpassword
    }
  });
}

async function getAccounts(accounts) {
  accounts.map(async account => {
    const { data } = await api('getaddressesbylabel', ['dkdaniz'], `wallet/${account}`);
    console.log('getAccounts', data);
  })
}

async function getblockcount() {
  const { data } = await api('getblockcount');
  console.log('getblockcount',data);
}

async function addNewAddressToLabel(accounts) {
  return accounts.map(async account => {
    const { data } = await api('getnewaddress', ['joao'], `wallet/${account}`);
    console.log('addNewAddressToLabel', data);
  });
}

async function getBalance(otxos) {
  return otxos.reduce((arr, otxo) => arr + otxo.amount, 0);
}

async function listUnspentNode(accounts, wallet) {
  const { data } = await api('listunspent', [0, 999999999, [wallet]], `wallet/${accounts[0]}`);
  const { result } = data;
  return result;
}

const accounts = ['pedro'];
const wallets = ['tb1q40vkqummdz7qufycvygr9wezkv2jf4yef8s5ve', 'tb1qkqzj4az73e2usd4h9a6sh435eut3ae8mrtlnle'];


//conected(accounts);

async function setup() {
  // await getblockcount();

  // const address = await addNewAddressToLabel(accounts);
  // await getAccounts(accounts);

  // getAddressInfo(accounts);

  const otxo = await listUnspentNode(accounts, wallets[0]);
  const balance = await getBalance(otxo);

  console.log(balance);

  // const privkey = await bitcoinRpc('dumpprivkey', [from]);
  // console.log({ privkey });

  // accounts.map(async account => {
  //   const { data } = await api('getbalance', [], `wallet/${account}`);
  //   console.log('getbalance', data);
  // });
}

setup();


 
//Hashing curva eliptica
// const secp256k1 = require('secp256k1');
// const ecc = require('tiny-secp256k1');
// const secp256k1 = require('secp256k1');

// //criptografia / descriptografia
// const crypto = require('crypto');

// //Utils
// const reverse = require('buffer-reverse');
// const uint64LE = require('int64-buffer').Uint64LE;
// const bip66 = require('bip66');

// const OPS = require('bitcoin-ops');
// const bitcoinjs = require('bitcoinjs-lib');

// const base58check = require('bs58check');
// const Buffers = require('buffer').Buffer;

/*
const ZERO = Buffer.alloc(1, 0);

const _from = '2NFPaxfumpBq5toTC76ts2nUZdPzwFpsxtV';
const _to = '2NGMAWK1sFnHbx7WgE6EUzGLwE5FRQtHoyP';
const _value = 0.0001;
const _fee = 0.00000006;
satoshi / byte;

const getFeeFromBytes = fee => 189 * fee;
const getOtxoWithAmount = (list, value) =>
  list.filter(obj => obj.amount > value);
const getscriptPubKey = async _hashAddress => {
  return await bitcoinRpc('validateaddress', [_hashAddress]);
};

const createTransaction = async (
  from = _from,
  to = _to,
  value = _value,
  fee = _fee,
) => {
  console.log({ from }, { to });
  const listunspent = await bitcoinRpc('listunspent');
  console.log({ listunspent });

  const otxo = listunspent.filter(obj => obj.address == from);
  console.log({ otxo });

  const balance = await bitcoinRpc('getbalance', ['suissa', 6]);
  console.log({ balance });

  const privkey = await bitcoinRpc('dumpprivkey', [from]);
  console.log({ privkey });

  if (balance > value) {
    const vins = [];
    const vouts = [];
    const tx = { version: 1, locktime: 0, vins: [], vouts: [] };
    let txValues = 0;
    let i = 0;

    const validOtxo = getOtxoWithAmount(otxo, value);
    const validOtxo = otxo.filter(obj => obj.amount > value);

    if (validOtxo.length) {
      // pega sempre primeiro as transacoes que sao menores, assim com o tempo a taxa fica mais barata
      for (i; txValues < value; i++) {
        txValues += validOtxo[i].amount;
        vins.push({
          txid: otxo[i].txid,
          vout: otxo[i].vout,
          scriptPubKey: otxo[i].scriptPubKey,
          privateKey: privkey,
        });
      }

      if (txValues > value) {
        const feeEstimative = (10 + i * 146 + i * 33) * fee;

        const vlrTransaction = feeEstimative + value;
        if (txValues > vlrTransaction) {
          console.log('Sem funcao createTransaction');
          let scriptP2pkh = await getscriptPubKey(from);
          vouts.push({ value, script: scriptP2pkh.scriptPubKey });

          if (vlrTransaction != txValues) {
            const valueUnspent = (txValues - vlrTransaction).toFixed(8);
            scriptP2pkh = await getscriptPubKey(from);
            vouts.push({
              value: valueUnspent,
              script: scriptP2pkh.scriptPubKey,
            });
          }
        } else {
          return signedTx(createTxWithOneInput(otxo, fee, value, privkey));
        }

        tx.vins = vins;
        tx.vouts = vouts;
        return signedTx(tx);
      }

      return signedTx(createTxWithOneInput(otxo, fee, value, privkey));
    }
    return signedTx(createTxWithOneInput(otxo, fee, value, privkey));
  }
  return false;
};

const createTxWithOneInput = (_otxo, _fee, _value, _privKey) => {
  const vins = [];
  const vouts = [];
  const tx = { version: 1, locktime: 0, vins: [], vouts: [] };

  validOtxo = _otxo.filter(obj => obj.amount > _value);
  if (validOtxo.length > 0) {
    vins.push({
      txid: otxo[0].txid,
      vout: otxo[0].vout,
      scriptPubKey: otxo[0].scriptPubKey,
      privateKey: _privKey,
    });

    // 186 byte * fee
    const feeEstimative = getFeeFromBytes(_fee);

    const vlrTransaction = feeEstimative + _value;

    if (validOtxo[0].amount > vlrTransaction) {
      console.log('Com createTransaction');

      const valueUnspent = (validOtxo[0].amount - vlrTransaction).toFixed(8);
      let scriptP2pkh = getscriptPubKey(to);
      vouts.push({ value: _value, script: scriptP2pkh });

      if (valueUnspent) {
        scriptP2pkh = getscriptPubKey(from);
        vouts.push({ value: valueUnspent, script: scriptP2pkh });
      }
    }
    console.log(vouts);
    console.log(vins);

    tx.vins = vins;
    tx.vouts = vouts;

    return tx;
  }
};

const createUnsignTx = _tx => {
  const data = [];
  const version = Buffer.allocUnsafe(4);
  const numInputs = Buffer.allocUnsafe(1);
  const numOutputs = Buffer.allocUnsafe(1);
  const locktime = Buffer.allocUnsafe(4);

  version.writeUInt32LE(_tx.version);
  numInputs.writeInt8(_tx.vins.length);
  numOutputs.writeInt8(_tx.vouts.length);

  data.push(version);
  data.push(numInputs);

  for (const i in _tx.vins) {
    const txOutHash = Buffer.from(_tx.vins[i].txid, 'hex');
    const txOutIndex = Buffer.allocUnsafe(4);
    const utxoScriptLenght = Buffer.allocUnsafe(1);
    const utxoScript = Buffer.from(_tx.vins[i].scriptPubKey, 'hex');
    const sequence = Buffer.from('FFFFFFFF', 'hex');

    txOutIndex.writeUInt32LE(_tx.vins[i].vout);
    utxoScriptLenght.writeUInt8(utxoScript.length);

    data.push(reverse(txOutHash));
    data.push(txOutIndex);
    data.push(utxoScriptLenght);
    data.push(utxoScript);
    data.push(sequence);
  }

  data.push(numOutputs);

  for (const i in _tx.vouts) {
    const scriptLenght = Buffer.allocUnsafe(1);
    const script = Buffer.from(_tx.vouts[i].script, 'hex');
    const value = new uint64LE(_tx.vouts[i].value);

    scriptLenght.writeUInt8(script.length);

    data.push(value.toBuffer());
    data.push(scriptLenght);
    data.push(script);
  }

  locktime.writeUInt32LE(_tx.locktime);
  data.push(locktime);

  return data;
};

const createSignedTx = (_tx, origArray) => {
  const pub = 'cRHfaZVp3Hkd2cFAaLekotvy73xa1bWpMRFySKyuqKERa8qnSV2Z';
  console.log(_tx);
  const decoded = base58check.decodeUnsafe(
    'cRHfaZVp3Hkd2cFAaLekotvy73xa1bWpMRFySKyuqKERa8qnSV2Z',
  );
  const decodeds = base58check.decode(
    'cRHfaZVp3Hkd2cFAaLekotvy73xa1bWpMRFySKyuqKERa8qnSV2Z',
  );
  const pri = new Buffers.from(pub.toString('hex'), 'hex');
  console.log(pri);
  console.log(decodeds);
  console.log(decoded);
  console.log(pri.toString('hex'));

  //  VEEWgYhDhqWnNnDCXXjirJYXGDFPjH1B8v6hmcnj1kLXrkpxArmz7xXw
  //  cRHfaZVp3H kd2cFAaLek otvy73xa1b WpMRFySKyu qKERa8qnSV 2Z
  //  b69ca8ffae36f11ad445625e35bf6ac57d6642ddbe470dd3e7934291b2000d78

  const signHash = Buffer.allocUnsafe(4);
  signHash.writeUInt32LE(1);
  origArray.push(signHash);

  let transaction = '';
  for (const item in origArray) {
    transaction += origArray[item].toString('hex');
  }

  const data = [];
  const msg = Buffer.from(transaction, 'hex');
  const version = Buffer.allocUnsafe(4);
  const numInputs = Buffer.allocUnsafe(1);
  const numOutputs = Buffer.allocUnsafe(1);
  const locktime = Buffer.allocUnsafe(4);

  const hash256 = crypto
    .createHash('sha256')
    .update(crypto.createHash('sha256').update(msg).digest())
    .digest();

  version.writeUInt32LE(_tx.version);
  numInputs.writeInt8(_tx.vins.length);
  numOutputs.writeInt8(_tx.vouts.length);
  data.push(version);
  data.push(numInputs);

  for (const i in _tx.vins) {
    const privateKey = decoded;
    const pubkey = secp256k1.publicKeyCreate(pri);
    const txOutHash = Buffer.from(_tx.vins[i].txid);
    const txOutIndex = Buffer.allocUnsafe(4);

    txOutIndex.writeUInt32LE(_tx.vins[i].vout);
    data.push(reverse(txOutHash));
    data.push(txOutIndex);

    // sign and encode
    const sig = ecc.sign(hash256, privateKey);

    const r = toOrder(sig.slice(0, 32));
    const s = toOrder(sig.slice(32, 64));
    const signature = bip66.encode(r, s);

    data.push(Buffer.from([signature.length + 2 + 1 + pubkey.length]));
    data.push(Buffer.from([signature.length + 1]));
    data.push(signature);
    data.push(Buffer.from([1]));
    data.push(Buffer.from([pubkey.length]));
    data.push(Buffer.from([pubkey]));

    const sequence = Buffer.from('FFFFFFFF', 'hex');
    data.push(sequence);
  }

  data.push(numOutputs);

  for (const i in _tx.vouts) {
    const striptLength = Buffer.allocUnsafe(1);
    const script = Buffer.from(_tx.vouts[i].script, 'hex');
    const value = new Uint64LE(_tx.vouts[i].value);

    striptLength.writeUInt8(script.length);

    data.push(value.toBuffer());
    data.push(scriptLenght);
    data.push(script);
  }

  locktime.writeUInt32LE(tx.locktime);
  data.push(locktime);

  return data;
};

const signedTx = _tx => {
  const unsignedTx = createUnsignTx(_tx);
  const signedTx = createSignedTx(_tx, unsignedTx);

  const transactionuUnsignedTx = '';
  for (const i in unsignedTx) {
    transactionuUnsignedTx += unsignedTx[i].toString('hex');
  }
  console.log({ transactionuUnsignedTx });

  const transactionSignedTx = '';
  for (const i in signedTx) {
    transactionSignedTx += signedTx[i].toString('hex');
  }
  console.log({ transactionSignedTx });

  const txHex = Buffer.from(transaction, 'hex');
  const txId = reverse(
    crypto
      .createHash('sha256')
      .update(crypto.createHash('sha256').update(txHex))
      .digest()
      .digest(),
  );
  console.log({ txId });

  return txId;
};

const toOrder = x => {
  let i = 0;
  while (x[i] === 0) i++;
  if (i === x.length) return ZERO;
  x = x.slice(i);
  if (x[0] && 0x80) return Buffer.concat([ZERO, x], 1 + x.length);
  return x;
};

try {
  createTransaction().then(hash => {
    console.log({ hash });
  });
} catch (error) {
  console.log({ error });
}

/// create Tx object

// tx = {
//   version: 1,
//   vins:[
//     {
//       txid:'',
//       vout:'',
//       scriptPubKey:'',
//       privateKey:''
//     }
//   ],
//   vouts:[
//     {
//       value:'',
//       script:p2pkh(fromBase58Check(pubkey).hash)
//     }
//   ],
//   locktime:0
// }

// tx = {
//   version: 1,
//   inputs:[
//     {
//       previousOutputTxHash:'',
//       previousOutputTxIndex:'',
//       utxoScript:'',
//       privateKey:''
//     }
//   ],
//   outputs:[
//     {
//       value:'',
//       script:p2pkh(fromBase58Check(pubkey).hash)
//     }
//   ],
//   locktime:0
// }

*/
