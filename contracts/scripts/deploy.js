const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  const deployedContract = await MyNFT.deploy();

  await deployedContract.deployed();

  console.log("MyNFT deployed to:", deployedContract.address);

  fs.copyFile(
    "artifacts/contracts/nft.sol/MyNFT.json",
    "../frontend/data/MyNFT.json",
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        console.log(
          "\nCopied ABI file:",
          fs.readFileSync("../frontend/data/MyNFT.json", "utf8")
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
