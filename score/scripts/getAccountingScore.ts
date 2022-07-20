import axios from "axios";
import fs from "fs";
import { Contract } from "./types";

function getDeltaValue(contract: Contract): number {
  const { contractDate, reportingStart, reportingEnd } = contract;

  const purchaseDate = new Date(contractDate).getTime();
  const reportingStartDate = new Date(reportingStart).getTime();
  const reportingEndDate = new Date(reportingEnd).getTime();

  const deltaPurchaseStart = Math.abs(purchaseDate - reportingStartDate);
  const deltaPurchaseEnd = Math.abs(purchaseDate - reportingEndDate);

  const totalDeltaInSeconds = (deltaPurchaseStart + deltaPurchaseEnd) / 1000;
  const totalDeltaInMins = totalDeltaInSeconds / 60;
  const totalDeltaInHours = totalDeltaInMins / 60;
  const totalDeltaInDays = totalDeltaInHours / 24;

  return totalDeltaInDays;
}

// fetch total available (unredeemed) REC purchased energy in MWh for given miner of minerId
export async function getAccountingScore(minerId: string): Promise<number[]> {
  const url = `https://proofs-api.zerolabs.green/api/partners/filecoin/nodes/${minerId}/contracts`;

  const contractsData = await axios.get(url);
  const contracts = contractsData.data.contracts;

  const accountingScore: number = contracts.reduce(
    (acc: number, curr: Contract) => {
      const deltaValue = getDeltaValue(curr);

      // return acc.map((val, i) => val + deltaValues[i]);
      return acc + deltaValue;
    },
    0
  );

  // const averagedScores = accountingScore.map((val) =>
  //   (val / contracts.length).toFixed(2)
  // );
  const score = (accountingScore / contracts.length).toFixed(2);

  return [score, contracts.length];
}

async function fetchSingleMiner(minerId: string) {
  const scores = await getAccountingScore(minerId);
  console.log("ratio: ", scores);
}

// fetch list of all Filecoin Storage Providers who have purchased and consumed RECs
async function fetchMinerRECList() {
  const response = await axios.get(
    `https://proofs-api.zerolabs.green/api/partners/filecoin/nodes`
  );

  const minerList = response.data.data;

  const minerMap = {} as any;

  const scoreList: number[][] = [];
  for (let i = 200; i < 400; i++) {
    //   for (let i = 0; i < minerList.length; i++) {
    const scoreArr = await getAccountingScore(minerList[i].id);
    minerMap[minerList[i].id] = scoreArr;
    scoreList.push(scoreArr);
  }

  scoreList.sort((a, b) => b[0] - a[0]);

  return [scoreList, minerMap];
}

async function writeFile() {
  const [scoreList, minerMap] = await fetchMinerRECList();
  //   const map = minerList.reduce((acc: any, curr: any, idx: number) => {
  //     acc[minerList[idx].id] = minerRatios[idx];
  //     return acc;
  //   }, {});
  fs.writeFileSync(`./scoreData200-400.json`, JSON.stringify(minerMap));
  fs.writeFileSync(`./scoreList200-400.json`, JSON.stringify(scoreList));
}

if (require.main === module) {
  writeFile();
  //   fetchSingleMiner("f010490");
}
