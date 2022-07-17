import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import { StringifyOptions } from "querystring";
dotenv.config();

type Location = {
  latitude: number;
  longitude: number;
};

type MinerLocationData = {
  provider: string;
  region: string;
  long: number;
  lat: number;
  numLocations: number;
  country: string;
  city: string;
  delegate: string;
};

// fetch locations of all Filecoin SPs
async function fetchMinerLocations() {
  const URL =
    "https://provider-quest.s3.us-west-2.amazonaws.com/dist/geoip-lookups/synthetic-locations-latest.json";
  const res = await axios.get(URL);
  const locations = res.data.providerLocations;

  const locationMap = {} as { [key: string]: MinerLocationData };

  locations.forEach((location: MinerLocationData) => {
    locationMap[location.provider] = location;
  });

  fs.writeFileSync("locationMap.json", JSON.stringify(locationMap));
  return locationMap;
}

// login to WattTime API and return token
export async function getAccessToken() {
  const loginURL = "https://api2.watttime.org/v2/login";

  const username = process.env.WT_USERNAME;
  const password = process.env.WT_PASSWORD;

  if (!username || !password) throw new Error("Missing username or password");

  const res = await axios.get(loginURL, {
    auth: {
      username: username,
      password: password,
    },
  });

  const token = res.data.token;

  return token;
}

export async function getBalancingAuthority(location: Location) {
  const URL = `https://api2.watttime.org/v2/ba-from-loc?latitude=${location.latitude}&longitude=${location.longitude}`;

  const token = await getAccessToken();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const res = await axios.get(URL, config);
  const ba = res.data.abbrev;
  return ba;
}

// return percentile value between 0 (minimum MOER in the last month i.e. clean) and
// 100 (maximum MOER in the last month i.e. dirty) representing the relative realtime marginal emissions intensity.
export async function getCarbonIntensity(minerId: string): Promise<any> {
  const location = getMinerLocation(minerId);
  const file = fs.readFileSync("baMap.json") as any;
  const baMap = JSON.parse(file);

  if (!location) return null;
  const { lat, long } = location;

  const indexURL = `https://api2.watttime.org/v2/index?latitude=${lat}&longitude=${long}`;

  const token = await getAccessToken();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  let result;

  try {
    const res = await axios.get(indexURL, config);
    result = res.data;
  } catch (error) {
    return null;
  }

  if (!result) {
    try {
      const ba = baMap(minerId);
      const baURL = `https://api2.watttime.org/v2/index?ba=${ba}`;
      const res = await axios.get(baURL, config);
      result = res.data;
    } catch (error) {
      return null;
    }
  }

  return result.moer;
}

function getMinerLocation(minerId: string): MinerLocationData {
  const file = fs.readFileSync("locationMap.json") as any;
  const locationMap = JSON.parse(file);
  const location = locationMap[minerId];
  return location;
}
