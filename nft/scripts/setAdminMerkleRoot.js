require("dotenv").config();
const hre = require("hardhat");
const { generateMerkleRoot } = require("./generateMerkleRoot");
const fs = require("fs");

async function main() {
  const ADMIN_MERKLE_ROOT = await generateMerkleRoot(
    "../data/adminWallets.json",
    "adminMerkleRoot"
  );

  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.attach(
    process.env.CONTRACT_ADDRESS // deployed contract address
  );

  console.log("MyNFT attached to:", nft.address);

  console.log("Setting admin wallet list merkle root...");

  const res = await nft.setAdminMerkleRoot(ADMIN_MERKLE_ROOT);

  console.log("Admin wallet list merkle root set as:", res);

  fs.copyFile(
    "data/adminWallets.json",
    "../frontend/data/adminWallets.json",
    (err) => {
      if (err) {
        console.log("Error Found:", err);
      } else {
        console.log(
          "\nAdmin Wallet List set for frontend:",
          fs.readFileSync("../frontend/data/adminWallets.json", "utf8")
        );
      }
    }
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
