import { getCarbonIntensity } from "./getCarbonIntensity";
import { calculateGranularityScore } from "./getGranularityScore";
import { Miner } from "./getMinersWithLocation";
import { calculateRenewableEnergyRatio } from "./getRenewableEnergyRatio";

const fs = require("fs");

type MinerScoreData = {
  // carbonIntensity: number;
  accountingScore: number;
  //   renewableRatio: number;
};

// fetch list of all Filecoin Storage Providers who have purchased and consumed RECs
async function calculateCategoryScore() {
  const file = fs.readFileSync("minerData/miners.json");
  const miners = JSON.parse(file);

  const moerMap = {} as { [key: string]: MinerScoreData };
  // const scoreMap = {} as { [key: string]: MinerScoreData };

  await Promise.all(
    miners.map(async (miner: Miner) => {
      try {
        // const carbonIntensity = await getCarbonIntensity(miner.id);
        const accountingScore = await calculateGranularityScore(miner.id);
        // const renewableRatio = await calculateRenewableEnergyRatio(miner.id);
        // moerMap[miner.id] = {
        //   carbonIntensity: carbonIntensity ? Number(carbonIntensity) : 1196.36,
        // };
        moerMap[miner.id] = {
          accountingScore,
        };
      } catch (err) {
        console.log(err);
        return;
      }
    })
  );

  fs.writeFileSync(`2_accountingScore.json`, JSON.stringify(moerMap));
}

// fetch list of all Filecoin Storage Providers who have purchased and consumed RECs
async function calculateGreenScores() {
  const file1 = fs.readFileSync(`1_finalRenewableScore.json`);
  const file2 = fs.readFileSync(`2_finalAccountingScore.json`);
  const file3 = fs.readFileSync(`3_finalIntensityScore.json`);
  const renewableScoresMap = JSON.parse(file1);
  const accountingScoresMap = JSON.parse(file2);
  const intensityScoresMap = JSON.parse(file3);

  const rWeight = 0.6;
  const aWeight = 0.2;
  const iWeight = 0.2;

  const resultMap = {} as { [minerId: string]: number };

  const tempList: number[] = [];
  const miners = Object.keys(renewableScoresMap);
  for (let i = 0; i < miners.length; i++) {
    const rScore = renewableScoresMap[miners[i]];
    const aScore = accountingScoresMap[miners[i]];
    const iScore = intensityScoresMap[miners[i]];
    const score = rWeight * rScore + aWeight * aScore + iWeight * iScore;
    tempList.push(score);
    resultMap[miners[i]] = score;
  }
  fs.writeFileSync(`tempscore.json`, JSON.stringify(tempList));
  fs.writeFileSync(`greenScores.json`, JSON.stringify(resultMap));
}

// weight the renewable ratio to ensure 0-1 range => 0-9 range
// surplus ratio follows f(t)=0.2731ln(6.2403t) formula
// final renewable score is out of 10
async function calculateRenewableScores() {
  const file = fs.readFileSync("1_renewableScore.json");
  const renewableScoresMap = JSON.parse(file);

  const resultMap = {} as { [minerId: string]: number };

  const miners = Object.keys(renewableScoresMap);
  for (let i = 0; i < miners.length; i++) {
    const ratio = renewableScoresMap[miners[i]].renewableRatio;

    if (ratio <= 1) {
      const weightedBaseRatio = ratio * 9;
      resultMap[miners[i]] = weightedBaseRatio;
    } else {
      let surplusRatio = ratio - 1;
      const weightedSurplusRatio = 0.2731 * Math.log(6.2403 * surplusRatio);
      const score =
        9 + weightedSurplusRatio > 10 ? 10 : 9 + weightedSurplusRatio;
      resultMap[miners[i]] = score;
    }
  }

  fs.writeFileSync(`1_finalRenewableScore.json`, JSON.stringify(resultMap));
}

async function calculateAccountingScores() {
  const file2 = fs.readFileSync("2_accountingScore.json");
  const accountingScoresMap = JSON.parse(file2);

  const resultMap = {} as { [minerId: string]: number };

  const accountingScores: number[] = [];
  const miners = Object.keys(accountingScoresMap);
  for (let i = 0; i < miners.length; i++) {
    if (miners[i] === "f01234") continue; // filecoin SP is an outlier
    // collect values for calculating minimum, maximum
    accountingScores.push(accountingScoresMap[miners[i]].accountingScore);
  }

  const aScoreMax = Math.max(...accountingScores);

  const tempList: number[] = [];

  for (let i = 0; i < miners.length; i++) {
    // filecoin SP is an outlier
    if (miners[i] === "f01234") {
      resultMap[miners[i]] = 10;
      continue;
    }
    const score =
      (accountingScoresMap[miners[i]].accountingScore / aScoreMax) * 10;
    tempList.push(score);
    resultMap[miners[i]] = score;
  }

  fs.writeFileSync(`tempscore.json`, JSON.stringify(tempList));
  fs.writeFileSync(`1_finalAccountingScore.json`, JSON.stringify(resultMap));
}

async function calculateIntensityScores() {
  const file2 = fs.readFileSync("3_moerScore.json");
  const intensityScoresMap = JSON.parse(file2);

  const resultMap = {} as { [minerId: string]: number };

  const intensityScores: number[] = [];
  const miners = Object.keys(intensityScoresMap);
  for (let i = 0; i < miners.length; i++) {
    // collect values for calculating minimum, maximum
    intensityScores.push(intensityScoresMap[miners[i]].carbonIntensity);
  }

  const iScoreMin = Math.min(...intensityScores);
  const iScoreMax = Math.max(...intensityScores);
  const range = iScoreMax - iScoreMin;

  for (let i = 0; i < miners.length; i++) {
    // normalize score between 0 and 10
    const score =
      ((intensityScoresMap[miners[i]].carbonIntensity - iScoreMin) / range) *
      10;

    // invert the score
    const invertedScore = 10 - score;
    resultMap[miners[i]] = invertedScore;
  }

  fs.writeFileSync(`3_finalIntensityScore.json`, JSON.stringify(resultMap));
}

if (require.main === module) {
  // calculateCategoryScores();
  calculateGreenScores();
  // calculateAccountingScores();
  // calculateIntensityScores();
}
