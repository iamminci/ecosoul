import { HashConnect } from "hashconnect";

import {
  AccountId,
  PrivateKey,
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
} from "@hashgraph/sdk";

const ACCOUNT_ID = process.env.NEXT_PUBLIC_ACCOUNT_ID ?? "0.0.47565504";
const PRIVATE_KEY =
  process.env.NEXT_PUBLIC_PRIVATE_KEY ??
  "302e020100300506032b657004220420fb283e621c42370894aab971a8fa3d0ca6f1e0875ea41635631f552621149306";

let hashconnect: HashConnect;

type DataType = {
  topic: string;
  pairingString: string;
  privateKey: string;
  pairedWalletData: any;
  pairedAccounts: string[];
};

let saveData: DataType = {
  topic: "",
  pairingString: "",
  privateKey: "",
  pairedWalletData: null,
  pairedAccounts: [],
};

let appMetadata = {
  name: "dApp Example",
  description: "An example hedera dApp",
  icon: "https://www.hashpack.app/img/logo.svg",
};

export async function connectWallet() {
  console.log("connect wallet");
  //create the hashconnect instance
  hashconnect = new HashConnect();

  //first init and store the private for later
  let initData = await hashconnect.init(appMetadata);
  saveData.privateKey = initData.privKey;

  //then connect, storing the new topic for later
  const state = await hashconnect.connect();
  console.log("connection state: ", state);
  saveData.topic = state.topic;

  //generate a pairing string, which you can display and generate a QR code from
  saveData.pairingString = hashconnect.generatePairingString(
    state,
    "testnet",
    true
  );

  hashconnect.pairingEvent.once((pairingData) => {
    console.log("pairing data: ", pairingData);
    saveData.pairedAccounts.push(pairingData.accountIds[0]);
    localStorage.setItem("pairedAccounts", pairingData.accountIds[0]);
  });

  //find any supported local wallets
  hashconnect.findLocalWallets();
  hashconnect.connectToLocalWallet(saveData.pairingString);
  return saveData;
}

export const contractCreationFunction = async () => {
  const accountId = AccountId.fromString(ACCOUNT_ID);
  const privateKey = PrivateKey.fromString(PRIVATE_KEY);
  const supplyKey = PrivateKey.generate();
  const adminKey = PrivateKey.generate();
  const client = Client.forTestnet().setOperator(accountId, privateKey);

  const provider = hashconnect.getProvider(
    "testnet",
    saveData.topic,
    saveData.pairedAccounts[0]
  );
  const signer = hashconnect.getSigner(provider);

  const createNFT = await new TokenCreateTransaction()
    .setTokenName("EcoSoul Community NFT")
    .setTokenSymbol("ECOSOUL")
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(accountId)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(5000)
    .setAdminKey(adminKey)
    .setSupplyKey(supplyKey)
    .freezeWithSigner(signer);

  const nftCreateSign = await createNFT.sign(adminKey);
  const mintTxSubmit = await nftCreateSign.execute(client);
  const nftCreateReceipt = await mintTxSubmit.getReceipt(client);
  const tokenId = nftCreateReceipt.tokenId;
  console.log("tokenId: ", tokenId);
};

export const contractSigningFunction = async (CID: string) => {
  const accountId = AccountId.fromString(ACCOUNT_ID);
  const privateKey = PrivateKey.fromString(PRIVATE_KEY);

  const client = Client.forTestnet().setOperator(accountId, privateKey);

  const supplyKey = PrivateKey.generate();
  const createNFT = await new TokenCreateTransaction()
    .setTokenName("EcoSoul Community NFT v2")
    .setTokenSymbol("ECOSOULV2")
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(accountId)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(1)
    .setSupplyKey(supplyKey)
    .freezeWith(client);

  const contractRes = await createNFT.execute(client);
  const receipt = await contractRes.getReceipt(client);

  if (!receipt.tokenId) {
    console.log("exit with no token ID");
    return;
  }

  const provider = hashconnect.getProvider(
    "testnet",
    saveData.topic,
    saveData.pairedAccounts[0]
  );
  const signer = hashconnect.getSigner(provider);

  const mintTx = await new TokenMintTransaction()
    .setTokenId(receipt.tokenId)
    .setMetadata([Buffer.from(CID)])
    .freezeWithSigner(signer);

  const minTxSign = await mintTx.sign(supplyKey);
  const result = await (await minTxSign).executeWithSigner(signer);
  console.log("result: ", result);
};
