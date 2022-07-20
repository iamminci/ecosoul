const fs = require("fs");

// update image URL for each token metadata file
const generateMetadata = async () => {
  try {
    const baseURI = await fs.readFileSync(
      "./metadata/generated/imgURI.txt",
      "utf8"
    );
    const greenScoresMap = require("../data/finalRankedMiners.json");
    const minerGreenScores = Object.values(greenScoresMap);

    const minerTokenIDMap = {};
    const minerMetadataMap = {};

    for (let tokenID = 1; tokenID <= minerGreenScores.length; tokenID++) {
      const miner = minerGreenScores[tokenID - 1];
      const metadataObj = createMetadataObj(miner, tokenID);
      metadataObj.image_url = `${baseURI}/${miner.minerId}.png`;

      const newJson = JSON.stringify(metadataObj);

      minerMetadataMap[miner.minerId] = metadataObj;
      minerTokenIDMap[miner.minerId] = tokenID;

      if (!fs.existsSync("./metadata/json")) {
        fs.mkdirSync("./metadata/json");
      }

      await fs.writeFileSync(`./metadata/json/${tokenID}`, newJson);
      console.log(
        `Updated metadata for miner: ${miner.minerId} with tokenID ${tokenID}`
      );
    }

    await fs.writeFileSync(
      `./metadata/minerTokenIDMap.json`,
      JSON.stringify(minerTokenIDMap)
    );

    await fs.writeFileSync(
      `./metadata/minerMetadataMap.json`,
      JSON.stringify(minerMetadataMap)
    );
  } catch (err) {
    throw err;
  }
};

// helper to create metadata JSON object
const createMetadataObj = (miner, tokenId) => {
  return {
    name: `EcoSoul #${miner.minerId}`,
    description:
      "EcoSoul: Community NFT for Filecoin Green's Certified Eco-friendly Storage Providers",
    image_url: "PLACEHOLDER",
    tokenId: tokenId,
    attributes: [
      {
        trait_type: "Tier",
        value: miner.tier,
      },
      {
        trait_type: "Rank",
        value: miner.rank,
      },
      {
        trait_type: "Overall Green Score",
        value: miner.score.toFixed(2),
      },
      {
        trait_type: "Renewable Energy Ratio Score",
        value: miner.rScore.toFixed(2),
      },
      {
        trait_type: "Accounting Granularity Score",
        value: miner.aScore.toFixed(2),
      },
      {
        trait_type: "Grid Carbon Intensity Score",
        value: miner.iScore.toFixed(2),
      },
    ],
  };
};

module.exports = { generateMetadata };
