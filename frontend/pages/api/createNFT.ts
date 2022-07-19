// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import pinataSDK, { PinataPinOptions } from "@pinata/sdk";
import { createCanvas, loadImage } from "canvas";

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

// This handler supports both GET and POST requests.
function roundRect(
  ctx: any,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillColor?: any | string,
  strokeColor?: string
) {
  let radiusObj = {} as any;
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

async function drawPFP(context: any) {
  const image = await loadImage("@public//pfp.png");
  context.beginPath();
  context.arc(330, 200, 131, 0, 2 * Math.PI);
  context.stroke();
  context.drawImage(image, 200, 70, 260, 260);
}

async function drawGold(context: any) {
  const image = await loadImage("@public//gold.png");
  context.drawImage(image, 383, 228, 90, 92);
}

async function drawLogo(context: any) {
  const image = await loadImage("@public//fil.png");
  context.globalAlpha = 0.5;
  context.drawImage(image, 40, 40, 50, 60);
  context.globalAlpha = 1;
}

async function drawBg(context: any) {
  const image = await loadImage("@public//vaporwave4.png");
  context.globalAlpha = 0.3;
  context.drawImage(image, -205, 318, 1070, 341);
  context.globalAlpha = 1;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const dirRelativeToPublicFolder = "metadata";
  const metadataDirPath = path.resolve("@public/", dirRelativeToPublicFolder);
  const poggoFile = "poggo.jpg";
  const poggoPath = path.resolve("@public/", poggoFile);

  if (req.method === "GET") {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      console.log("No Pinata API or Secret key");
      return;
    }

    const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

    const canvas = createCanvas(660, 660);
    const context = canvas.getContext("2d");
    const gradient = context.createLinearGradient(330, 0, 330, 660);
    gradient.addColorStop(0, "#01DFB6");
    gradient.addColorStop(1, "#1F9EFD");

    roundRect(context, 0, 0, 660, 660, 20, gradient);
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
    await drawPFP(context);
    await drawLogo(context);
    await drawBg(context);
    await drawGold(context);

    // STORAGE PROVIDER ID
    const SPID = `SP #f999999`;
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "bold 32px Menlo";
    context.fillText(SPID, 72, 360);

    // TIER
    const tier = "Gold Tier";
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "italic 26px Menlo";
    context.fillText(tier, 72, 400);

    // RANK
    const rank = "137";
    const rankLabel = `Rank ${rank}`;
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "normal 26px Menlo";
    context.fillText(rankLabel, 325, 375);

    // RANK
    const totalCount = "1954";
    const totalLabel = `out of ${totalCount}`;
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "italic 14px Menlo";
    context.fillText(totalLabel, 457, 385);

    // green score meter. TODO MAKE PERCENTAGE
    roundRect(context, 328, 415, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)");
    roundRect(context, 328, 415, 180, 7.54, 5, "#9DFFAD");

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
    roundRect(context, 328, 506, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)");
    roundRect(context, 328, 506, 210, 7.54, 5, "#FFDFBA");

    // a score meter. TODO MAKE PERCENTAGE
    roundRect(context, 328, 538, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)");
    roundRect(context, 328, 538, 180, 7.54, 5, "#FFFFBA");

    // i score meter. TODO MAKE PERCENTAGE
    roundRect(context, 328, 570, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)");
    roundRect(context, 328, 570, 170, 7.54, 5, "#BAE1FF");

    // RANK
    const totalScore = "8.5";
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "normal 18px Arial";
    context.fillText(totalScore, 570, 410);

    // RANK
    const rScore = "9.2";
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "normal 18px Arial";
    context.fillText(rScore, 570, 500);

    // RANK
    const aScore = "8.2";
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "normal 18px Arial";
    context.fillText(aScore, 570, 532);

    // RANK
    const iScore = "7.8";
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "normal 18px Arial";
    context.fillText(iScore, 570, 564);

    const buffer = canvas.toBuffer("image/png");
    await fs.writeFileSync("@public/image.png", buffer);

    const readableStreamForFile = fs.createReadStream("@public/image.png");

    const options: PinataPinOptions = {
      pinataMetadata: {
        name: "PBNFT Image",
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    //   // TODO: replace with dynamically rendered canvas image based on traits
    const imgResult = await pinata.pinFileToIPFS(
      readableStreamForFile,
      options
    );
    console.log("Images successfully uploaded to IPFS: ", imgResult);
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${imgResult.IpfsHash}`;

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

    res.status(200).json(imageUrl);
  } else if (req.method === "POST") {
    const newUser = req.body;

    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      console.log("No Pinata API or Secret key");
      return;
    }

    const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

    const canvas = createCanvas(660, 660);
    const context = canvas.getContext("2d");
    const gradient = context.createLinearGradient(330, 0, 330, 660);
    gradient.addColorStop(0, "#01DFB6");
    gradient.addColorStop(1, "#1F9EFD");

    roundRect(context, 0, 0, 660, 660, 20, gradient);
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
    await drawPFP(context);
    await drawLogo(context);
    await drawBg(context);

    // STORAGE PROVIDER ID
    const SPID = `SP #f999999`;
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "bold 32px Menlo";
    context.fillText(SPID, 72, 360);

    // TIER
    const tier = "Gold Tier";
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "italic 26px Menlo";
    context.fillText(tier, 72, 400);

    // RANK
    const rank = "137";
    const rankLabel = `Rank ${rank}`;
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "normal 26px Menlo";
    context.fillText(rankLabel, 325, 375);

    // RANK
    const totalCount = "1954";
    const totalLabel = `out of ${totalCount}`;
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "italic 14px Menlo";
    context.fillText(totalLabel, 457, 385);

    // green score meter. TODO MAKE PERCENTAGE
    roundRect(context, 328, 415, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)");
    roundRect(context, 328, 415, 180, 7.54, 5, "#9DFFAD");

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
    roundRect(context, 328, 506, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)");
    roundRect(context, 328, 506, 210, 7.54, 5, "#FFDFBA");

    // a score meter. TODO MAKE PERCENTAGE
    roundRect(context, 328, 538, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)");
    roundRect(context, 328, 538, 180, 7.54, 5, "#FFFFBA");

    // i score meter. TODO MAKE PERCENTAGE
    roundRect(context, 328, 570, 232, 7.54, 5, "rgba(217, 217, 217, 0.6)");
    roundRect(context, 328, 570, 170, 7.54, 5, "#BAE1FF");

    // RANK
    const totalScore = "8.5";
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "normal 18px Arial";
    context.fillText(totalScore, 570, 410);

    // RANK
    const rScore = "9.2";
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "normal 18px Arial";
    context.fillText(rScore, 570, 500);

    // RANK
    const aScore = "8.2";
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "normal 18px Arial";
    context.fillText(aScore, 570, 532);

    // RANK
    const iScore = "7.8";
    context.textBaseline = "top";
    context.fillStyle = "#fff";
    context.font = "normal 18px Arial";
    context.fillText(iScore, 570, 564);

    const buffer = canvas.toBuffer("image/png");
    await fs.writeFileSync("@public/image.png", buffer);

    const readableStreamForFile = fs.createReadStream("@public/image.png");

    const options: PinataPinOptions = {
      pinataMetadata: {
        name: "PBNFT Image",
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    //   // TODO: replace with dynamically rendered canvas image based on traits
    // const imgResult = await pinata.pinFileToIPFS(
    //   readableStreamForFile,
    //   options
    // );
    // console.log("Images successfully uploaded to IPFS: ", imgResult);
    // const imageUrl = `https://gateway.pinata.cloud/ipfs/${imgResult.IpfsHash}`;

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

    // res.status(200).json(imageUrl);
  }
}
