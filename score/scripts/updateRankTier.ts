import fs from "fs";
import { FinalMinerScoreData } from "./types";

const SILVER_TIER_THRESHOLD = 300;
const GOLD_TIER_THRESHOLD = 150;
const PLATINUM_TIER_THRESHOLD = 50;

async function updateRankTier() {
  const file = fs.readFileSync(`data/finalGreenScores.json`);
  const minersMap = JSON.parse(file.toString());
  const miners: FinalMinerScoreData[] = Object.values(minersMap);

  const rankedMinerMap = {} as { [minerId: string]: FinalMinerScoreData };

  miners.sort((a: FinalMinerScoreData, b: FinalMinerScoreData) => {
    return b.score - a.score;
  });

  // add rank to each miner
  for (let i = 0; i < miners.length; i++) {
    miners[i].rank = i + 1;
  }

  // add tier to each miner
  for (let i = 0; i < miners.length; i++) {
    if (miners[i].rank! <= PLATINUM_TIER_THRESHOLD) {
      miners[i].tier = "Platinum";
    } else if (miners[i].rank! <= GOLD_TIER_THRESHOLD) {
      miners[i].tier = "Gold";
    } else if (miners[i].rank! <= SILVER_TIER_THRESHOLD) {
      miners[i].tier = "Silver";
    } else if (!miners[i].tier && miners[i].score >= 7.5) {
      miners[i].tier = "Certified";
    }
  }

  miners.forEach((miner) => {
    rankedMinerMap[miner.minerId] = miner;
  });

  fs.writeFileSync(`finalRankedMiners.json`, JSON.stringify(rankedMinerMap));
}

updateRankTier();
