import { getCarbonIntensity } from "./getCarbonIntensity";
import { calculateGranularityScore } from "./getGranularityScore";
import { calculateRenewableEnergyRatio } from "./getRenewableEnergyRatio";
import fs from "fs";
import { FinalMinerScoreData, Miner, MinerScoreData } from "./types";

// fetch list of all Filecoin Storage Providers who have purchased and consumed RECs
async function calculateGreenScores() {
  const file = fs.readFileSync("minerData/miners.json", "utf-8");
  const miners = JSON.parse(file);

  const scoreMap = {} as { [key: string]: MinerScoreData };

  await Promise.all(
    miners.map(async (miner: Miner) => {
      try {
        const renewableRatio = await calculateRenewableEnergyRatio(miner.id);
        const accountingScore = await calculateGranularityScore(miner.id);
        const carbonIntensity = await getCarbonIntensity(miner.id);

        scoreMap[miner.id] = {
          carbonIntensity,
          accountingScore,
          renewableRatio,
        };
      } catch (err) {
        console.log(err);
        return;
      }
    })
  );

  fs.writeFileSync(`finalCategoryScores.json`, JSON.stringify(scoreMap));
}

// fetch list of all Filecoin Storage Providers who have purchased and consumed RECs
async function calculateGreenScores_v1() {
  const file = fs.readFileSync(`finalCategoryScores.json`, "utf-8");
  const scoresMap = JSON.parse(file);
  // const file1 = fs.readFileSync(`1_finalRenewableScore.json`);
  // const file2 = fs.readFileSync(`2_finalAccountingScore.json`);
  // const file3 = fs.readFileSync(`3_finalIntensityScore.json`);
  // const renewableScoresMap = JSON.parse(file1);
  // const accountingScoresMap = JSON.parse(file2);
  // const intensityScoresMap = JSON.parse(file3);

  const rWeight = 0.6;
  const aWeight = 0.2;
  const iWeight = 0.2;

  const resultMap = {} as { [minerId: string]: number };

  const tempList: number[] = [];
  const miners = Object.keys(scoresMap);
  for (let i = 0; i < miners.length; i++) {
    const rScore = scoresMap[miners[i]].renewableRatio;
    const aScore = scoresMap[miners[i]].accountingScore;
    const iScore = scoresMap[miners[i]].carbonIntensity;
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
async function normalizeScores() {
  const file = fs.readFileSync("data/1_renewableScore.json", "utf-8");
  const file2 = fs.readFileSync("data/2_accountingScore.json", "utf-8");
  const file3 = fs.readFileSync("data/3_moerScore.json", "utf-8");
  const file4 = fs.readFileSync("data/locationMap.json", "utf-8");
  const renewableScoresMap = JSON.parse(file);
  const accountingScoresMap = JSON.parse(file2);
  const intensityScoresMap = JSON.parse(file3);
  const locationMap = JSON.parse(file4);

  const resultMap = {} as { [minerId: string]: FinalMinerScoreData };

  const rWeight = 0.6;
  const aWeight = 0.2;
  const iWeight = 0.2;

  const miners = Object.keys(renewableScoresMap);
  for (let i = 0; i < miners.length; i++) {
    resultMap[miners[i]] = {
      carbonIntensity: 99999,
      accountingScore: 99999,
      renewableRatio: 99999,
      score: 99999,
      rScore: 99999,
      aScore: 99999,
      iScore: 99999,
      minerId: "",
      url: "",
      region: "",
      country: "",
      long: 99999,
      lat: 99999,
      hasMinted: false,
    };

    const ratio = renewableScoresMap[miners[i]].renewableRatio;
    resultMap[miners[i]].renewableRatio = ratio; // retain value

    if (ratio <= 1) {
      const weightedBaseRatio = ratio * 9;
      resultMap[miners[i]].rScore = weightedBaseRatio;
    } else {
      let surplusRatio = ratio - 1;
      const weightedSurplusRatio = 0.2731 * Math.log(6.2403 * surplusRatio);
      const score =
        9 + weightedSurplusRatio > 10 ? 10 : 9 + weightedSurplusRatio;
      resultMap[miners[i]].rScore = score;
    }
  }

  const accountingScores: number[] = [];
  for (let i = 0; i < miners.length; i++) {
    if (miners[i] === "f01234") continue; // filecoin SP is an outlier
    // collect values for calculating minimum, maximum
    accountingScores.push(accountingScoresMap[miners[i]].accountingScore);
  }

  const aScoreMax = Math.max(...accountingScores);

  for (let i = 0; i < miners.length; i++) {
    // filecoin SP is an outlier
    if (miners[i] === "f01234") {
      resultMap[miners[i]].aScore = 10;
      continue;
    }
    const value = accountingScoresMap[miners[i]].accountingScore;
    const score = (value / aScoreMax) * 10;
    resultMap[miners[i]].aScore = score;
    resultMap[miners[i]].accountingScore = value; // retain old value
  }

  const intensityScores: number[] = [];
  for (let i = 0; i < miners.length; i++) {
    // collect values for calculating minimum, maximum
    intensityScores.push(intensityScoresMap[miners[i]].carbonIntensity);
  }

  const iScoreMin = Math.min(...intensityScores);
  const iScoreMax = Math.max(...intensityScores);
  const range = iScoreMax - iScoreMin;

  for (let i = 0; i < miners.length; i++) {
    // normalize score between 0 and 10
    const value = intensityScoresMap[miners[i]].carbonIntensity;
    const score = ((value - iScoreMin) / range) * 10;

    // invert the score
    const invertedScore = 10 - score;
    resultMap[miners[i]].iScore = invertedScore;
    resultMap[miners[i]].carbonIntensity = value; // retain old value
  }

  for (let i = 0; i < miners.length; i++) {
    const rScore = resultMap[miners[i]].rScore;
    const aScore = resultMap[miners[i]].aScore;
    const iScore = resultMap[miners[i]].iScore;
    const score = rWeight * rScore + aWeight * aScore + iWeight * iScore;
    resultMap[miners[i]].score = score;
    const url = `https://proofs.zerolabs.green/partners/filecoin/nodes/${miners[i]}/beneficiary`;
    resultMap[miners[i]].url = url;
    resultMap[miners[i]].minerId = miners[i];

    if (locationMap[miners[i]]) {
      resultMap[miners[i]].region = locationMap[miners[i]].region;
      resultMap[miners[i]].country = locationMap[miners[i]].country;
      resultMap[miners[i]].long = locationMap[miners[i]].long;
      resultMap[miners[i]].lat = locationMap[miners[i]].lat;
    }
  }

  fs.writeFileSync(`finalGreenScores.json`, JSON.stringify(resultMap));
}

// weight the renewable ratio to ensure 0-1 range => 0-9 range
// surplus ratio follows f(t)=0.2731ln(6.2403t) formula
// final renewable score is out of 10
async function calculateRenewableScores() {
  const file = fs.readFileSync("1_renewableScore.json", "utf-8");
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

  fs.writeFileSync(
    `data/1_finalRenewableScore.json`,
    JSON.stringify(resultMap)
  );
}

async function calculateAccountingScores() {
  const file2 = fs.readFileSync("data/2_accountingScore.json", "utf-8");
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
  const file2 = fs.readFileSync("3_moerScore.json", "utf-8");
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
