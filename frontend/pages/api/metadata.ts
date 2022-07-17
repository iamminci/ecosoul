// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import pinataSDK, { PinataPinOptions } from "@pinata/sdk";

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

// This handler supports both GET and POST requests.
// GET will ...
// POST will ...
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const dirRelativeToPublicFolder = "metadata";
  const metadataDirPath = path.resolve("./public", dirRelativeToPublicFolder);
  const poggoFile = "poggo.jpg";
  const poggoPath = path.resolve("./public", poggoFile);

  if (req.method === "GET") {
    // fetch all orders
  } else if (req.method === "POST") {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      console.log("No Pinata API or Secret key");
      return;
    }

    const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

    const options: PinataPinOptions = {
      pinataMetadata: {
        name: "PBNFT Image",
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    const newUser = req.body;
    const { score1, tokenId } = newUser;

    try {
      // TODO: replace with dynamically rendered canvas image based on traits
      const imgResult = await pinata.pinFromFS(poggoPath, options);
      console.log("Images successfully uploaded to IPFS: ", imgResult);
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imgResult.IpfsHash}`;

      const userMetadataPath = `${metadataDirPath}/${tokenId}`;
      const fileData = await fs.readFileSync(userMetadataPath);
      const json = JSON.parse(fileData.toString());
      json.image_url = imageUrl;
      json.score = score1;
      const newJson = JSON.stringify(json);

      await fs.writeFileSync(userMetadataPath, newJson);
      console.log(`Updated metadata for token ${tokenId}`);

      const result = await pinata.pinFromFS(metadataDirPath, options);
      console.log("Metadata successfully uploaded to IPFS: ", result);
      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;

      res.status(200).json(metadataUrl);
    } catch (err) {
      console.log(err);
      res.status(400).json("Unable to upload image to Pinata");
    }
  }
}
