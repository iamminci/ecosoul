// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import getConfig from "next/config";
import pinataSDK, { PinataPinOptions } from "@pinata/sdk";

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

// const serverPath = (staticFilePath: string) => {
//   return path.join(
//     getConfig().serverRuntimeConfig.PROJECT_ROOT,
//     staticFilePath
//   );
// };

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

  //   const jsonFiles = filenames.map((name) =>
  //     path.join("/", dirRelativeToPublicFolder, name)
  //   );

  if (req.method === "GET") {
    // fetch all orders
  } else if (req.method === "POST") {
    console.log("PINATA_API_KEY: ", PINATA_API_KEY);
    console.log("PINATA_SECRET_KEY: ", PINATA_SECRET_KEY);
    console.log("req.body: ", req.body);

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

    try {
      const imgResult = await pinata.pinFromFS(poggoPath, options);
      console.log("Images successfully uploaded to IPFS: ", imgResult);
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imgResult.IpfsHash}`;

      const fileData = await fs.readFileSync(`${metadataDirPath}/1`);
      const json = JSON.parse(fileData.toString());
      json.image_url = imageUrl;
      const newJson = JSON.stringify(json);

      await fs.writeFileSync(`${metadataDirPath}/1`, newJson);
      console.log(`Updated metadata for token: 1`);

      //   const metadata = {
      //     name: "Plastic Bagz NFT",
      //     description: "EcoSoul starts with Plastic Bagz",
      //     image_url: imageUrl,
      //     tokenId: 1,
      //     attributes: [{ trait_type: "Score", value: "1" }],
      //   };

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
