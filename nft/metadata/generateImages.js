const fs = require("fs");
// import path from "path";
// import pinataSDK, { PinataPinOptions } from "@pinata/sdk";
const { createCanvas, loadImage } = require("canvas");
const { Console } = require("console");
// const defaultImage = require("./assets/default.png");

// const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
// const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

async function main() {
  const greenScoresMap = require("../data/finalRankedMiners.json");
  const minerGreenScores = Object.values(greenScoresMap);
  const minerCount = minerGreenScores.length;

  minerGreenScores.forEach((miner) => {
    generateImages(miner, minerCount);
  });
}

async function generateImages(miner, minerCount) {
  const canvas = createCanvas(660, 660);
  const context = canvas.getContext("2d");

  // construct background gradient
  const gradient = context.createLinearGradient(330, 0, 330, 660);
  gradient.addColorStop(0, "#01DFB6");
  gradient.addColorStop(1, "#1F9EFD");

  // draw background gradient
  roundRect(context, 0, 0, 660, 660, 20, gradient);

  // draw white border
  roundRect(
    context,
    20,
    20,
    620,
    620,
    20,
    undefined,
    "rgba(255, 255, 255, 0.8)"
  );

  // draw image-based accessories
  await drawPFP(context);
  await drawLogo(context);
  await drawBgPattern(context);
  await drawBadge(context, miner.tier);

  // STORAGE PROVIDER ID
  const SPID = `#${miner.minerId}`;
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "bold 32px Menlo";
  context.fillText(SPID, 72, 360);

  let font = 26;
  let y = 400;
  if (miner.region.length > 15) {
    font = 22;
    y = 404;
  }
  if (miner.region.length > 20) {
    font = 19;
    y = 408;
  }

  // REGION
  const region = miner.region;
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = `italic ${font}px Menlo`;
  context.fillText(region, 72, y);

  // RANK
  const rankLabel = `Rank ${miner.rank}`;
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "normal 26px Menlo";
  context.fillText(rankLabel, 325, 375);

  let x = 478;
  if (miner.rank < 1000) x = 462;
  if (miner.rank < 100) x = 447;
  if (miner.rank < 10) x = 432;

  // TOTAL
  const totalLabel = `out of ${minerCount}`;
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "italic 14px Menlo";
  context.fillText(totalLabel, x, 388);

  // green score meter. TODO: MAKE PERCENTAGE
  const length = 232 * (miner.score / 10);
  roundRect(context, 328, 415, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)");
  roundRect(context, 328, 415, length, 7.54, 5, "#9DFFAD");

  context.beginPath();
  context.moveTo(66, 449);
  context.lineTo(592, 449);
  context.lineWidth = 3;
  context.strokeStyle = "rgba(255, 255, 255, 0.4)";
  context.stroke();

  // METRICS LABEL
  const metrics = "Metrics";
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "bold 22px Menlo";
  context.fillText(metrics, 68, 467);

  // rScore LABEL
  const rscoreLabel = "Renewable Ratio";
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "normal 20px Arial";
  context.fillText(rscoreLabel, 68, 500);

  // aScore LABEL
  const ascoreLabel = "Accounting Granularity";
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "normal 20px Arial";
  context.fillText(ascoreLabel, 68, 532);

  // aScore LABEL
  const iscoreLabel = "Grid Carbon Intensity";
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "normal 20px Arial";
  context.fillText(iscoreLabel, 68, 564);

  // SCORE LABEL
  const current = "Current Scores";
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "bold 22px Menlo";
  context.fillText(current, 324, 467);

  // r score meter. TODO MAKE PERCENTAGE
  const rLength = 232 * (miner.rScore / 10);
  roundRect(context, 328, 506, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)"); // score frame
  roundRect(context, 328, 506, rLength, 7.54, 5, "#FFDFBA"); // score meter

  // a score meter. TODO MAKE PERCENTAGE
  const aLength = 232 * (miner.aScore / 10);
  roundRect(context, 328, 538, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)"); // score frame
  roundRect(context, 328, 538, aLength, 7.54, 5, "#FFFFBA"); // score meter

  // i score meter. TODO MAKE PERCENTAGE
  const iLength = 232 * (miner.iScore / 10);
  roundRect(context, 328, 570, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)"); // score frame
  roundRect(context, 328, 570, iLength, 7.54, 5, "#BAE1FF"); // score meter

  // RANK
  const totalScore = miner.score.toFixed(1);
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "normal 18px Arial";
  context.fillText(totalScore, 570, 408);

  // RANK
  const rScore = miner.rScore.toFixed(1);
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "normal 18px Arial";
  context.fillText(rScore, 570, 500);

  // RANK
  const aScore = miner.aScore.toFixed(1);
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "normal 18px Arial";
  context.fillText(aScore, 570, 532);

  // RANK
  const iScore = miner.iScore.toFixed(1);
  context.textBaseline = "top";
  context.fillStyle = "#fff";
  context.font = "normal 18px Arial";
  context.fillText(iScore, 570, 564);

  const buffer = canvas.toBuffer("image/png");

  if (!fs.existsSync("./metadata/images")) {
    fs.mkdirSync("./metadata/images");
  }

  await fs.writeFileSync(`./metadata/images/${miner.minerId}.png`, buffer);
}

// helper functions to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius, fillColor, strokeColor) {
  let radiusObj = {};
  if (typeof radius === "number") {
    radiusObj = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radiusObj = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radiusObj.tl, y);
  ctx.lineTo(x + width - radiusObj.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radiusObj.tr);
  ctx.lineTo(x + width, y + height - radiusObj.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radiusObj.br,
    y + height
  );
  ctx.lineTo(x + radiusObj.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radiusObj.bl);
  ctx.lineTo(x, y + radiusObj.tl);
  ctx.quadraticCurveTo(x, y, x + radiusObj.tl, y);
  ctx.closePath();
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }
}

// draw PFP image
async function drawPFP(context) {
  const image = await loadImage("./metadata/assets/default.png");

  const x = 200;
  const y = 70;
  const width = 260;
  const height = 260;
  const radius = width / 2;

  context.save();
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.clip();
  context.drawImage(image, x, y, width, height);
  context.restore();
}

// draw badge image
async function drawBadge(context, badgeType) {
  if (!["Platinum", "Gold", "Silver"].includes(badgeType)) return;
  const image = await loadImage(
    `./metadata/assets/${badgeType.toLowerCase()}.png`
  );
  context.drawImage(image, 383, 240, 90, 92);
}

// draw FIL logo
async function drawLogo(context) {
  const image = await loadImage("./metadata/assets/fil.png");
  context.globalAlpha = 0.5;
  context.drawImage(image, 40, 40, 50, 60);
  context.globalAlpha = 1;
}

// draw vaporwave texture
async function drawBgPattern(context) {
  const image = await loadImage("./metadata/assets/vaporwave.png");
  context.globalAlpha = 0.3;
  context.drawImage(image, -205, 318, 1070, 341);
  context.globalAlpha = 1;
}

main();

function updateMetadata() {
  // if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
  //   console.log("No Pinata API or Secret key");
  //   return;
  // }
  // const defaultImg = fs.readFileSync("./assets/default.jpg");
  // const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);
  //   const readableStreamForFile = fs.createReadStream("@public/image.png");
  //   const options: PinataPinOptions = {
  //     pinataMetadata: {
  //       name: "PBNFT Image",
  //     },
  //     pinataOptions: {
  //       cidVersion: 0,
  //     },
  //   };
  //   // TODO: replace with dynamically rendered canvas image based on traits
  //   const imgResult = await pinata.pinFileToIPFS(readableStreamForFile, options);
  //   console.log("Images successfully uploaded to IPFS: ", imgResult);
  //   const imageUrl = `https://gateway.pinata.cloud/ipfs/${imgResult.IpfsHash}`;
  //   const userMetadataPath = `${metadataDirPath}/${tokenId}`;
  //   const fileData = await fs.readFileSync(userMetadataPath);
  //   const json = JSON.parse(fileData.toString());
  //   json.image_url = imageUrl;
  //   json.score = score1;
  //   const newJson = JSON.stringify(json);
  //   await fs.writeFileSync(userMetadataPath, newJson);
  //   console.log(`Updated metadata for token ${tokenId}`);
  //   const result = await pinata.pinFromFS(metadataDirPath, options);
  //   console.log("Metadata successfully uploaded to IPFS: ", result);
  //   const metadataUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
}
