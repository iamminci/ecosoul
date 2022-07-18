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
  try {
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

    return [minerReportingPeriods, accumulatedGapTime];
  } catch (err) {
    return [[], 999];
  }
}

// calculate accounting granularity score with periods weighted by their duration, shorter the larger weights
export async function calculateGranularityScore(minerId: string) {
  const [reportingPeriods, gapTime] = await getMinerReportingPeriods(minerId);

  if (reportingPeriods.length === 0 || gapTime === 999) return 0;

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
