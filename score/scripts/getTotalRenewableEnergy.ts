import axios from "axios";
import fs from "fs";

// fetch total redeemed REC purchased energy in MWh for given miner of minerId
async function getRedeemedRenewableMWh(minerId: string): Promise<number> {
  const url = `https://proofs-api.zerolabs.green/api/partners/filecoin/nodes/${minerId}/transactions`;

  const redeemedRECData = await axios.get(url);
  const totalRedeemedRECWh = redeemedRECData.data.recsTotal;
  const totalRedeemedRECMWh = Number(totalRedeemedRECWh) / Math.pow(10, 6);

  return totalRedeemedRECMWh;
}

// fetch total available (unredeemed) REC purchased energy in MWh for given miner of minerId
async function getAvailableRenewableMWh(minerId: string): Promise<number> {
  const url = `https://proofs-api.zerolabs.green/api/partners/filecoin/nodes/${minerId}/contracts`;

  const availableRECData = await axios.get(url);
  const availableRECDataContracts = availableRECData.data.contracts;

  const totalAvailableRECWh = availableRECDataContracts.reduce(
    (acc: number, curr: any) => {
      const availableRECMh = Number(curr.openVolume);
      return acc + availableRECMh;
    },
    0
  );

  const totalAvailableRECMWh = totalAvailableRECWh / Math.pow(10, 6);

  return totalAvailableRECMWh;
}

// fetch all REC purchased energy in MWh for given miner of minerId
async function getTotalRenewableMWh(minerId: string): Promise<number> {
  const totalRedeemedRECMWh = await getRedeemedRenewableMWh(minerId);
  const totalAvailableRECMWh = await getAvailableRenewableMWh(minerId);
  const totalRECMWh = totalRedeemedRECMWh + totalAvailableRECMWh;

  return totalRECMWh;
}

// given a minerID, fetch the total renewable energy purchased
export async function getTotalRenewableEnergy(minerId: string) {
  const totalRECMWh = await getTotalRenewableMWh(minerId);
  console.log("JM all EACs_MWh: ", totalRECMWh);
  return totalRECMWh;
}

// if (require.main === module) {
//   getTotalRenewableEnergy();
// }
