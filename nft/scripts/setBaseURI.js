require("dotenv").config();
const hre = require("hardhat");
// const { generateMerkleProof } = require("./generateMerkleProof");

async function main() {
  const BASE_URI = process.env.BASE_URI;

  if (!BASE_URI) {
    console.log("BASE_URI is required. Please add it to your environment.");
    return;
  }

  // TODO: remove hard coded admin addresses
  // const adminList = [
  //   "0xD07b84827096306B01a2EF3193026Ed6A6BF8Fb8",
  //   "0xC33003bcEF8DB78167EC77f6ed3B904f8C814649",
  // ];

  // const address = "0xD07b84827096306B01a2EF3193026Ed6A6BF8Fb8";

  // const merkle = generateMerkleProof(adminList, address);

  const EcoSoul = await hre.ethers.getContractFactory("EcoSoul");

  const nft = await EcoSoul.attach(
    process.env.CONTRACT_ADDRESS // The deployed contract address
  );

  console.log("EcoSoul attached to:", nft.address);

  console.log("setting base uri...", BASE_URI);

  const res = await nft.setBaseURI(BASE_URI);

  console.log("set base uri", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
