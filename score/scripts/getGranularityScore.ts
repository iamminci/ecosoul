// f010528 has 7 contracts (one year long, many 2-3 month long)
// f0101570 has 2 contracts (one six month, one two month long)
// f010088 has 1 contract (one year long)

// depending on gaps, should result in a pretty clear ranking
import axios from "axios";
import { Contract } from "./getAccountingScore";
import { getMinerOperationTime } from "./getTotalConsumedEnergy";

type MinerContractReportingPeriod = {
  id: string;
  startTime: number;
  endTime: number;
  period: number;
};

async function getOperationTime(minerId: string) {
  const [startTime, endTime] = await getMinerOperationTime(minerId);
  // find miner operation time period in days
  const minerPeriod = (endTime - startTime) / (1000 * 60 * 60 * 24);
  return [startTime, endTime, minerPeriod];
}

//
async function getMinerReportingPeriods(
  minerId: string
): Promise<[MinerContractReportingPeriod[], number]> {
  const url = `https://proofs-api.zerolabs.green/api/partners/filecoin/nodes/${minerId}/contracts`;

  const availableRECData = await axios.get(url);
  const availableRECDataContracts = availableRECData.data.contracts;

  const [startTime, _, minerPeriod] = await getOperationTime(minerId);

  let accumulatedReportingTime = 0;

  const alreadyReported = new Set();
  const minerReportingPeriods: MinerContractReportingPeriod[] =
    availableRECDataContracts.map((contract: Contract) => {
      let reportingStartTime = new Date(contract.reportingStart).getTime();

      // if there is a reporting period that starts before the miner's operation, use operation start time
      if (reportingStartTime < startTime) reportingStartTime = startTime;

      const reportingEndTime = new Date(contract.reportingEnd).getTime();

      // reporting period in days
      const reportingPeriod =
        (reportingEndTime - reportingStartTime) / (1000 * 60 * 60 * 24);

      const reportingPeriodID = `${reportingStartTime}-${reportingEndTime}`;

      if (alreadyReported.has(reportingPeriodID)) return {};

      const newReportingPeriod: MinerContractReportingPeriod = {
        id: minerId,
        startTime: reportingStartTime,
        endTime: reportingEndTime,
        period: reportingPeriod,
      };

      accumulatedReportingTime += reportingPeriod;

      alreadyReported.add(reportingPeriodID);

      return newReportingPeriod;
    });

  // find gap time
  const accumulatedGapTime = minerPeriod - accumulatedReportingTime;

  //   console.log("minerId: ", minerId);
  //   console.log("startTime: ", startTime);
  //   console.log("miningHistory: ", minerPeriod);
  //   console.log("accumulatedReportingTime: ", accumulatedReportingTime);
  //   console.log("accumulatedGapTime: ", accumulatedGapTime);

  return [minerReportingPeriods, accumulatedGapTime];
}

// calculate accounting granularity score with periods weighted by their duration, shorter the larger weights
export async function calculateGranularityScore(minerId: string) {
  const [reportingPeriods, gapTime] = await getMinerReportingPeriods(minerId);
  let score = 0;

  // console.log("reportingPeriods: ", reportingPeriods);

  reportingPeriods.forEach(({ period }) => {
    if (period) {
      score += getWeight(period) * period;
    }
  });

  // score -= 0.05 * gapTime;
  // console.log("score: ", score);
  return score;
}

function getWeight(period: number) {
  return 0.6966 * Math.exp(-1 * 0.0023 * period);
}

calculateGranularityScore("f01320931");
// calculateAccountingScore("f0101570");
// calculateAccountingScore("f010088");

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
