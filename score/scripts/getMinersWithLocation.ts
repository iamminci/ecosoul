import fs from "fs";
import axios from "axios";
import { getAccessToken } from "./getCarbonIntensity";

export type Miner = {
  id: string;
  buyerId: string;
  blockchainAddress: string;
  region: string;
  country: string;
  createdAt: string;
  updatedAt: string;
};

async function getMinerBAWithLocation() {
  const file = fs.readFileSync("minerData/miners.json") as any;
  const miners = JSON.parse(file);

  const locationMapFile = fs.readFileSync("locationMap.json") as any;
  const locationMap = JSON.parse(locationMapFile);

  const baMap = {} as any;

  console.log("miners.length", miners.length);

  await Promise.all(
    miners.map(async (miner: Miner) => {
      if (!(miner.id in locationMap)) return;
      const { long, lat } = locationMap[miner.id];
      const URL = `https://api2.watttime.org/v2/ba-from-loc?latitude=${lat}&longitude=${long}`;
      try {
        const token = await getAccessToken();

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const res = await axios.get(URL, config);
        const ba = res.data.abbrev;

        baMap[miner.id] = ba;
      } catch (err) {
        return;
      }
    })
  );

  fs.writeFileSync("baMap.json", JSON.stringify(baMap));
  return baMap;
}

async function getAllGridRegions() {
  const URL = `https://api2.watttime.org/v2/ba-access`;

  const token = await getAccessToken();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const res = await axios.get(URL, config);
  console.log("res", res.data);
  fs.writeFileSync("gridRegions.json", JSON.stringify(res.data));
  //   return ba;
}

async function getGridMap() {
  const URL = `https://api2.watttime.org/v2/maps`;

  const token = await getAccessToken();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const res = await axios.get(URL, config);
  console.log("res", res.data);
  fs.writeFileSync("gridMap.json", JSON.stringify(res.data));
  //   return ba;
}

getMinerBAWithLocation();
