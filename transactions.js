/**
 * Objetivo transacao entre enderecos
 * Entrada: from, to, value, fee
 * Saida: Hash / Erro
 *  */

const axios = require('axios').default;

 //responsavel pela interacao com o no

const rpcuser = 'daniel';
const rpcpassword = 'uvkCNf8qazlb9spbyeyuzCZtj-ET7N-m70uy3vJgYH8=';

async function api(method, params = [], route = '') {
  return await axios.post(`http://142.93.241.215:18332/${route}`, { "id": "0", "method": `${method}`, "params": params }, {
    auth: {
      username: rpcuser,
      password: rpcpassword
    }
  });
}

async function getAccounts(accounts) {
  accounts.map(async account => {
    const { data } = await api('getaddressesbylabel', ['joao'], `wallet/${account}`);
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
  return data.result;
}

async function validateaddress(account, wallet) {
  const { data } = await api('validateaddress', [wallet], `wallet/${account}`);
  return data.result;
}

async function createTxWithOneInput(otxo, fee, value, privateKey) {
  
}

const accounts = ['pedro'];


//conected(['joao', 'alice']);

async function setup(from, to, value, fee) {
  // await getblockcount();

  //const address = await addNewAddressToLabel(accounts);
  //console.log(address);
  //await getAccounts(accounts);

  // getAddressInfo(accounts);

  const otxoBalance = await listUnspentNode(accounts, from, 0);
  const balanceTotal = await getBalance(otxoBalance);

  console.log(otxoBalance);
  console.log(balanceTotal);

  const balance = [];
  balance.push(balanceTotal);

  //console.log('balance que esta disponivel visualizacao', balance)

  const privateKey = await getPrivateKey(accounts[0], from);
  //console.log(privateKey);

  if (balance > value) {

    const vins = [];
    const vouts = [];
    const tx = { version: 1, locktime: 0, vins: [], vouts: [] };
    let txValues = 0;
    let i = 0;

    const validOtxo = otxoBalance.filter(otxo => otxo.amount > value);
    // console.log(validOtxo)
    
    if (validOtxo.length > 0) {
      // pega sempre primeiro as transacoes que sao menores, assim com o tempo a taxa fica mais barata

      txValues = validOtxo.reduce(function (acc, otxo) {
        console.log(acc)
        if (acc < value) {

          vins.push({
            txid: otxo.txid,
            vout: otxo.vout,
            scriptPubKey: otxo.scriptPubKey,
            privateKey,
          })
          console.log(vins);
          i++;
          return acc + otxo.amount;
        }
        return acc + 0;
      }, 0);

      console.log(txValues)

      if (txValues > value) {
        //cabecalho = feeEstimative 186 bytes

        // i = transaction 

        const feeEstimative = (10 + i * 146 + i * 33) * fee;
        console.log(feeEstimative);

        const vlrTransaction = feeEstimative + value;
        if (txValues >= vlrTransaction) {
          let scriptP2pkh = await validateaddress(accounts[0],from);
          vouts.push({ value, script: scriptP2pkh.scriptPubKey });

          if (vlrTransaction !== txValues) {
            const valueUnspent = (txValues - vlrTransaction).toFixed(8);
            scriptP2pkh = await validateaddress(accounts[0], from);
            vouts.push({
              value: valueUnspent,
              script: scriptP2pkh.scriptPubKey,
            });
          };

          console.log(vins);
          console.log(vouts);
        }
      } else {
        //return signedTx(createTxWithOneInput(otxo, fee, value, privkey))

        tx.vins = vins;
        tx.vouts = vouts;
        
      };
      // return signedTx(createTxWithOneInput(otxo, fee, value, privkey));
    }
    return signedTx(createTxWithOneInput(otxo, fee, value, privkey));
  }
};



setup('tb1q09jrh60yznafvcva562saqx68ks6shqnnc3xv5', 'tb1qthds8a68sfsrz5gm5fc5k96n9n2wmwk0c6evqt', 0.00001, 0.00000006);