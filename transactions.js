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
  });
}

async function getBalance(otxos) {
  return otxos.reduce((arr, otxo) => arr + otxo.amount, 0);
}

async function listUnspentNode(accounts, wallet, confirmation=0) {
  const { data } = await api('listunspent', [confirmation, 999999999, [wallet]], `wallet/${accounts[0]}`);
  const { result } = data;
  return result;
}

async function getPrivateKey(account, wallet) {
  const { data } = await api('dumpprivkey', [wallet], `wallet/${account}`);
  return data;
}

const accounts = ['pedro'];


//conected(accounts);

async function setup(from, to, value, fee) {
  // await getblockcount();

  // const address = await addNewAddressToLabel(accounts);
  // await getAccounts(accounts);

  // getAddressInfo(accounts);

  const otxoBalance = await listUnspentNode(accounts, from, 6);
  const balanceTotal = await getBalance(otxoBalance);

  const balance = [];
  balance.push(balanceTotal);

  console.log('balance que esta disponivel visualizacao', balance)

  const privateKey = await getPrivateKey(accounts[0], from);
  console.log(privateKey);

  if (balance > value) {

    const vins = [];
    const vouts = [];
    const tx = { version: 1, locktime: 0, vins: [], vouts: [] };
    let txValues = 0;



    const validOtxo = otxoBalance.filter(otxo => otxo.amount > value);

    
    
    if (validOtxo.length) {
      // pega sempre primeiro as transacoes que sao menores, assim com o tempo a taxa fica mais barata

      txValues = validOtxo.reduce(function (acc, otxo) {
        if (acc < value) {
          vins.push({
            txid: otxo.txid,
            vout: otxo.vout,
            scriptPubKey: otxo.scriptPubKey,
            privateKey,
          });

          return acc + otxo.amount;
        }
        return acc + 0;
      }, 0)

      console.log(txValues)

      // if (txValues > value) {
      //   const feeEstimative = (10 + i * 146 + i * 33) * fee;

      //   const vlrTransaction = feeEstimative + value;
      //   if (txValues > vlrTransaction) {
      //     console.log('Sem funcao createTransaction');
      //     let scriptP2pkh = await getscriptPubKey(from);
      //     vouts.push({ value, script: scriptP2pkh.scriptPubKey });

      //     if (vlrTransaction != txValues) {
      //       const valueUnspent = (txValues - vlrTransaction).toFixed(8);
      //       scriptP2pkh = await getscriptPubKey(from);
      //       vouts.push({
      //         value: valueUnspent,
      //         script: scriptP2pkh.scriptPubKey,
      //       });
      //     }
      //   } else {
      //     return signedTx(createTxWithOneInput(otxo, fee, value, privkey));
      //   }

      //   tx.vins = vins;
      //   tx.vouts = vouts;
      //   return signedTx(tx);
      // }

      // return signedTx(createTxWithOneInput(otxo, fee, value, privkey));
    }
    // return signedTx(createTxWithOneInput(otxo, fee, value, privkey));
  }
  // return false;
};


setup('tb1q40vkqummdz7qufycvygr9wezkv2jf4yef8s5ve', 'tb1qkqzj4az73e2usd4h9a6sh435eut3ae8mrtlnle', 0.00001, 0.00000006);


 