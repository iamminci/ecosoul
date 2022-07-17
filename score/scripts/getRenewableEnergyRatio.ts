import axios from "axios";
import fs from "fs";
import { getTotalConsumedEnergy } from "./getTotalConsumedEnergy";
import { getTotalRenewableEnergy } from "./getTotalRenewableEnergy";

export async function calculateRenewableEnergyRatio(
  minerId: string
): Promise<number> {
  const totalConsumedEnergy = await getTotalConsumedEnergy(minerId);
  const totalRenewableEnergy = await getTotalRenewableEnergy(minerId);
  const renewableEnergyRatio = totalRenewableEnergy / totalConsumedEnergy;
  return renewableEnergyRatio;
}

async function fetchSingleMiner(minerId: string) {
  const ratio = await calculateRenewableEnergyRatio(minerId);
  console.log("ratio: ", ratio);
}

// fetch list of all Filecoin Storage Providers who have purchased and consumed RECs
async function fetchMinerRECList() {
  const response = await axios.get(
    `https://proofs-api.zerolabs.green/api/partners/filecoin/nodes`
  );

  const minerList = response.data.data;

  const minerMap = {} as any;
  //   console.log("minerList: ", minerList);
  //   console.log("minerList length: ", minerList.length);

  for (let i = 0; i < 500; i++) {
    //   for (let i = 0; i < minerList.length; i++) {
    const ratio = await calculateRenewableEnergyRatio(minerList[i].id);
    minerMap[minerList[i].id] = ratio;
  }

  return minerMap;
}

async function writeFile() {
  const minerMap = await fetchMinerRECList();
  //   const map = minerList.reduce((acc: any, curr: any, idx: number) => {
  //     acc[minerList[idx].id] = minerRatios[idx];
  //     return acc;
  //   }, {});
  fs.writeFileSync(`./ratioData500.json`, JSON.stringify(minerMap));
}

// if (require.main === module) {
// writeFile();
// fetchSingleMiner("f010490");
// }

// if (require.main === module) {
//     calculateRenewableEnergyRatio("f01051178");
//   }

// module.exports = { fetchMinerRECList };
