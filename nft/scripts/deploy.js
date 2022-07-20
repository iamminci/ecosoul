const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const EcoSoul = await hre.ethers.getContractFactory("EcoSoul");

  const deployedContract = await EcoSoul.deploy();

  await deployedContract.deployed();

  console.log("EcoSoul deployed to:", deployedContract.address);

  fs.copyFile(
    "artifacts/contracts/nft.sol/EcoSoul.json",
    "../frontend/data/EcoSoul.json",
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        console.log(
          "\nCopied ABI file:",
          fs.readFileSync("../frontend/data/EcoSoul.json", "utf8")
        );
      }
    }
  );

  return deployedContract;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
