// f010528 has 7 contracts (one year long, many 2-3 month long)
// f0101570 has 2 contracts (one six month, one two month long)
// f010088 has 1 contract (one year long)

import axios from "axios";
import { Contract } from "./getAccountingScore";
import { getMinerTimePeriod } from "./getTotalConsumedEnergy";

// depending on gaps, should result in a pretty clear ranking

type MinerContractReportingPeriod = {
  id: string;
  startTime: number;
  endTime: number;
  period: number;
};

async function getTime(minerId: string) {
  const [startTime, endTime] = await getMinerTimePeriod(minerId);
  const minerPeriod = (endTime - startTime) / (1000 * 60 * 60 * 24);
  return [startTime, endTime, minerPeriod];
}

// fetch total available (unredeemed) REC purchased energy in MWh for given miner of minerId
async function getMinerReportingPeriods(
  minerId: string
): Promise<[MinerContractReportingPeriod[], number]> {
  const url = `https://proofs-api.zerolabs.green/api/partners/filecoin/nodes/${minerId}/contracts`;

  const availableRECData = await axios.get(url);
  const availableRECDataContracts = availableRECData.data.contracts;

  const [startTime, _, minerPeriod] = await getTime(minerId);

  let accumulatedReportingTime = 0;

  const minerReportingPeriods: MinerContractReportingPeriod[] =
    availableRECDataContracts.map((contract: Contract) => {
      let reportingStartTime = new Date(contract.reportingStart).getTime();

      if (reportingStartTime < startTime) reportingStartTime = startTime;

      const reportingEndTime = new Date(contract.reportingEnd).getTime();
      const reportingPeriod =
        (reportingEndTime - reportingStartTime) / (1000 * 60 * 60 * 24);

      const newReportingPeriod: MinerContractReportingPeriod = {
        id: minerId,
        startTime: reportingStartTime,
        endTime: reportingEndTime,
        period: reportingPeriod,
      };

      accumulatedReportingTime += reportingPeriod;

      return newReportingPeriod;
    });

  const accumulatedGapTime = minerPeriod - accumulatedReportingTime;

  console.log("minerId: ", minerId);
  console.log("startTime: ", startTime);
  console.log("miningHistory: ", minerPeriod);
  console.log("accumulatedReportingTime: ", accumulatedReportingTime);
  console.log("accumulatedGapTime: ", accumulatedGapTime);

  return [minerReportingPeriods, accumulatedGapTime];
}

async function calculateAccountingScore(minerId: string) {
  const [reportingPeriods, gapTime] = await getMinerReportingPeriods(minerId);
  let score = 0;
  reportingPeriods.forEach(({ startTime, endTime, period }) => {
    score += getWeight(period) * period;
  });
  score -= 0.1 * gapTime;
  console.log("score: ", score);
  return score;
}

function getWeight(period: number) {
  const quarterlyWeight = 0.5;
  const halfWeight = 0.4;
  const annualWeight = 0.3;
  const bimonthlyWeight = 0.6;
  const monthlyWeight = 0.65;

  return 0.6966 * Math.exp(-1 * 0.0023 * period);
  //   if (period > 28 && period < 32) {
  //     return monthlyWeight;
  //   } else if (period > 58 && period < 62) {
  //     return bimonthlyWeight;
  //   } else if (period > 88 && period < 92) {
  //     return quarterlyWeight;
  //   } else if (period > 178 && period < 182) {
  //     return halfWeight;
  //   } else if (period > 363 && period < 367) {
  //     return annualWeight;
  //   } else {
  //     console.log("werid period: ", period);
  //     throw new Error("broken period!");
  //   }
}

// getMinerReportingPeriods("f010528");
// getMinerReportingPeriods("f0101570");
// getMinerReportingPeriods("f010088");
calculateAccountingScore("f010528");
calculateAccountingScore("f0101570");
calculateAccountingScore("f010088");

// data for f010528
//       // 12 months
//       "reportingStart": "2020-01-01T00:00:00.000Z",
//       "reportingEnd": "2020-12-31T23:59:59.999Z",

//       // 3 months
//       "reportingStart": "2021-01-01T00:00:00.000Z",
//       "reportingEnd": "2021-03-31T23:59:59.999Z",

//       // 3 months
//       "reportingStart": "2021-04-01T00:00:00.000Z",
//       "reportingEnd": "2021-06-30T23:59:59.999Z",

//       // 2 months
//       "reportingStart": "2021-07-01T00:00:00.000Z",
//       "reportingEnd": "2021-08-31T23:59:59.999Z",

//       // 2 months
//       "reportingStart": "2021-07-01T00:00:00.000Z",
//       "reportingEnd": "2021-09-30T23:59:59.999Z",

//       // 3 months
//       "reportingStart": "2021-10-01T00:00:00.000Z",
//       "reportingEnd": "2021-12-31T23:59:59.999Z",

//       // 3 months
//       "reportingStart": "2022-04-01T00:00:00.000Z",
//       "reportingEnd": "2022-06-30T23:59:59.999Z",
