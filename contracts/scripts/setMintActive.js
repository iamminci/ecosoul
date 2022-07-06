require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // deployed contract address
  );
  console.log("MyNFT attached to:", nft.address);

  console.log(`setting contract mint state to active...`);

  const res = await nft.setMintActive();

  console.log("set mint state active", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
