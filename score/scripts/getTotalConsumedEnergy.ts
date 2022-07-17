import axios from "axios";

type Epoch = {
  epoch: string;
  miner: string;
  timestamp: string;
};

// fetch all epochs for a given data model and minerId
async function getAllEpochs(
  modelCodeName: string,
  minerId: string
): Promise<Epoch[]> {
  const limit = 1000; // will give incorrect results if over limit
  const startDate = new Date("2020-07-01").toISOString();

  const allEnergyEpochs: Epoch[] = [];
  let isLastEpoch = false;
  let offset = 0;

  // run a loop to exhaust epochs fetching limited number at a time due to API limit
  do {
    const url = `https://api.filecoin.energy/models/export?code_name=${modelCodeName}&limit=${limit}&offset=${offset}&start=${startDate}&miner=${minerId}`;
    const energyData = await axios.get(url);
    const energyEpochs: Epoch[] = energyData.data.data;
    allEnergyEpochs.push(...energyEpochs);
    isLastEpoch = energyEpochs.length < limit;
    offset += energyEpochs.length;
  } while (!isLastEpoch);

  return allEnergyEpochs;
}

// calculate total energy used to seal data for given miner of minerId
async function getTotalSealingUpperBoundMWh(minerId: string): Promise<number> {
  const allSealingEnergyEpochs = await getAllEpochs(
    "SealingEnergyModelv_1_0_1",
    minerId
  );

  const totalSealingUpperBoundKWh = allSealingEnergyEpochs.reduce(
    (acc: number, curr: any) => {
      const sealingKWhUpperBound = Number(curr.sealing_energy_kW_upper);
      return acc + sealingKWhUpperBound;
    },
    0
  );

  const totalSealingUpperBoundMWh = totalSealingUpperBoundKWh / Math.pow(10, 3);

  return totalSealingUpperBoundMWh;
}

// calculate total energy used to store data for given miner of minerId
async function getTotalStorageUpperBoundMWh(minerId: string): Promise<number> {
  const allStorageEnergyEpochs = await getAllEpochs(
    "StorageEnergyModelv_1_0_1",
    minerId
  );

  const totalStorageUpperBoundKWh = allStorageEnergyEpochs.reduce(
    (acc: number, curr: any) => {
      const storageKWhUpperBound = Number(curr.storage_energy_kW_upper);
      return acc + storageKWhUpperBound;
    },
    0
  );

  const totalStorageUpperBoundMWh = totalStorageUpperBoundKWh / Math.pow(10, 3);

  return totalStorageUpperBoundMWh;
}

// get cumulative energy usage upper bound for given miner of minerId
async function getCumulativeEnergyUpperBoundMWh(
  minerId: string
): Promise<number> {
  const allCumulativeEnergyEpochs = await getAllEpochs(
    "CumulativeEnergyModel_v_1_0_1",
    minerId
  );

  const finalCumulativeEnergyEpoch: any =
    allCumulativeEnergyEpochs[allCumulativeEnergyEpochs.length - 1];
  const cumulativeEnergyUpperBoundMWh =
    finalCumulativeEnergyEpoch.energy_use_kW_upper / Math.pow(10, 3);

  return cumulativeEnergyUpperBoundMWh;
}

export async function getTotalConsumedEnergy(minerId: string) {
  const cumulativeEnergyUpperBoundMWh = await getCumulativeEnergyUpperBoundMWh(
    minerId
  );
  // console.log("JM energyConsumed_Upper_MWh: ", cumulativeEnergyUpperBoundMWh);
  return cumulativeEnergyUpperBoundMWh;
}

export const defaultStartTime = new Date("2020-07-01").getTime(); // some hard coded value from Alan's data

// get the start, end time for a miner's total operation in milliseconds
export async function getMinerOperationTime(
  minerId: string
): Promise<[number, number]> {
  const allCumulativeEnergyEpochs = await getAllEpochs(
    "CumulativeEnergyModel_v_1_0_1",
    minerId
  );

  let startTime = 0;

  // find the first epoch with energy use > 0
  for (let i = 0; i < allCumulativeEnergyEpochs.length; i++) {
    const epoch = allCumulativeEnergyEpochs[i] as any;
    if (Number(epoch.energy_use_kW_estimate) > 0) {
      startTime = new Date(epoch.timestamp).getTime();
      break;
    }
  }

  // if no epoch with energy use > 0, use default start time
  startTime = startTime ? startTime : defaultStartTime;

  const finalEpochIdx = allCumulativeEnergyEpochs.length - 1;
  // const startTimestamp = allCumulativeEnergyEpochs[0].timestamp;
  const endTimestamp = allCumulativeEnergyEpochs[finalEpochIdx].timestamp;

  // const startTime = new Date(startTimestamp).getTime();
  const endTime = new Date(endTimestamp).getTime();

  return [startTime, endTime];
}

// if (require.main === module) {
//   getTotalConsumedEnergy("f010528");
// }
