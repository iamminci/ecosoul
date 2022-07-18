require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const EcoSoul = await hre.ethers.getContractFactory("EcoSoul");

  const nft = await EcoSoul.attach(
    process.env.CONTRACT_ADDRESS // deployed contract address
  );
  console.log("EcoSoul attached to:", nft.address);

  console.log(`setting contract mint state to active...`);

  const res = await nft.setMintActive();

  console.log("set mint state active", res);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
