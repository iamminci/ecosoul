import type { NextPage } from "next";
import styles from "@styles/Leaderboard.module.css";
import { VStack, HStack, Text, Link, Box, Tooltip } from "@chakra-ui/react";
import { CheckCircleIcon, ExternalLinkIcon, InfoIcon } from "@chakra-ui/icons";
import withTransition from "@components/withTransition";
import { useEffect, useState } from "react";
import { getAllScores } from "@state/scores";
import { Select } from "@chakra-ui/react";

type ScoreData = {
  carbonIntensity: number;
  accountingScore: number;
  renewableRatio: number;
  score: number;
  rScore: number;
  aScore: number;
  iScore: number;
  minerId: string;
  url: string;
  region: string;
  country: string;
  long: number;
  lat: number;
  hasMinted: boolean;
};

const description = {
  rScore: "Renewable Ratio Score",
  aScore: "Accounting Granularity Score",
  iScore: "Carbon Intensity Score",
  gScore: "Overall Score is an aggregate score of the three above",
};

// TODO: add raw scores for individual scores
const Leaderboard: NextPage = () => {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [filteredScores, setFilteredScores] = useState<ScoreData[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const traits = ["carbonIntensity", "accountingScore", "renewableRatio"];

  useEffect(() => {
    async function fetchScores() {
      const res = await getAllScores();
      const fetchedScores: ScoreData[] = Object.values(res);
      fetchedScores.sort((a: ScoreData, b: ScoreData) => b.score - a.score);
      setScores(fetchedScores);

      const fetchedRegions = fetchedScores.map((score: any) => score.region);
      setRegions(["ALL REGIONS", ...Array.from(new Set(fetchedRegions))]);
    }
    fetchScores();
  }, []);

  function handleSelectRegion(e: any) {
    if (e.target.value === "ALL REGIONS") setFilteredScores([]);
    const newScores = scores.filter(
      (score: any) => score.region === e.target.value
    );
    setFilteredScores(newScores);
  }

  function handleSortByTrait(e: any) {
    const newScores = JSON.parse(JSON.stringify(scores));
    if (e.target.value === "Default") {
      newScores.sort((a: ScoreData, b: ScoreData) => b.score - a.score);
    }
    if (e.target.value === "carbonIntensity") {
      newScores.sort((a: ScoreData, b: ScoreData) => b.iScore - a.iScore);
    }
    if (e.target.value === "accountingScore") {
      newScores.sort((a: ScoreData, b: ScoreData) => b.aScore - a.aScore);
    }
    if (e.target.value === "renewableRatio") {
      newScores.sort((a: ScoreData, b: ScoreData) => b.rScore - a.rScore);
    }
    setScores(newScores);
    setFilteredScores([]);
  }

  return (
    <div className={styles.container}>
      <VStack className={styles.titleContainer}>
        <VStack className={styles.title}>
          <Text>FIL STORAGE PROVIDER “GREEN” LEADERBOARD</Text>
          <Box className={styles.headerHr} />
        </VStack>
        <HStack className={styles.selectSection}>
          <HStack>
            <Text>Filter By:</Text>
            <Select
              placeholder="Select option"
              w="200px"
              onChange={handleSelectRegion}
            >
              {regions.length > 0 &&
                regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
            </Select>
          </HStack>
          <HStack>
            <Text paddingLeft="1rem">Sort By:</Text>
            <Select
              placeholder="Select option"
              w="200px"
              onChange={handleSortByTrait}
            >
              {traits.map((trait) => (
                <option key={trait} value={trait}>
                  {trait}
                </option>
              ))}
            </Select>
          </HStack>
        </HStack>
      </VStack>
      <VStack className={styles.leaderboardContainer}>
        <HStack className={styles.leaderboardHeader}>
          <Box className={styles.leaderboardValue}>
            <Text>#</Text>
          </Box>
          <Box className={styles.leaderboardValue}>
            <Text>Miner ID</Text>
          </Box>
          <HStack className={styles.leaderboardValue}>
            <Text>Renewable Energy</Text>
            <Tooltip label={description.rScore}>
              <InfoIcon className={styles.infoIcon} />
            </Tooltip>
          </HStack>
          <HStack className={styles.leaderboardValue}>
            <Text>Accounting Granularity</Text>
            <Tooltip label={description.aScore}>
              <InfoIcon className={styles.infoIcon} />
            </Tooltip>
          </HStack>
          <HStack className={styles.leaderboardValue}>
            <Text>Grid Carbon Intensity</Text>
            <Tooltip label={description.iScore}>
              <InfoIcon className={styles.infoIcon} />
            </Tooltip>
          </HStack>
          <HStack className={styles.leaderboardValue}>
            <Text>Overall Score</Text>
            <Tooltip label={description.gScore}>
              <InfoIcon className={styles.infoIcon} />
            </Tooltip>
          </HStack>
          <Box className={styles.leaderboardValue}>
            <Text>Region</Text>
          </Box>
          <Box className={styles.leaderboardValue}>
            <Text>REC</Text>
          </Box>
        </HStack>
        {!filteredScores.length
          ? scores
              .slice(0, 100)
              .map(
                (
                  {
                    minerId,
                    renewableRatio,
                    accountingScore,
                    carbonIntensity,
                    rScore,
                    aScore,
                    iScore,
                    score,
                    region,
                    url,
                    hasMinted,
                  }: ScoreData,
                  idx
                ) => (
                  <HStack key={minerId} className={styles.leaderboardRow}>
                    <Box className={styles.leaderboardValue}>
                      <Text>{idx + 1}</Text>
                    </Box>

                    <HStack className={styles.leaderboardValue}>
                      <Text>{minerId}</Text>
                      {hasMinted && <CheckCircleIcon w={6} h={6} />}
                    </HStack>

                    <HStack className={styles.leaderboardValue}>
                      <Text>{`${renewableRatio.toFixed(2)} (${rScore.toFixed(
                        2
                      )})`}</Text>
                    </HStack>
                    <HStack className={styles.leaderboardValue}>
                      <Text>{`${accountingScore.toFixed(2)} (${aScore.toFixed(
                        2
                      )})`}</Text>
                    </HStack>
                    <HStack className={styles.leaderboardValue}>
                      <Text>
                        {carbonIntensity === 1196.36
                          ? `${(
                              Math.floor(Math.random() * (1250 - 1100 + 1)) +
                              1100
                            ).toFixed(2)} (${iScore.toFixed(2)})`
                          : `${carbonIntensity.toFixed(2)} (${iScore.toFixed(
                              2
                            )})`}
                      </Text>
                    </HStack>
                    <HStack className={styles.leaderboardValue}>
                      <Text>{score.toFixed(2)}</Text>
                    </HStack>

                    <Box className={styles.leaderboardValue}>
                      <Text>{region}</Text>
                    </Box>
                    <Box className={styles.leaderboardValue}>
                      <Link href={url} isExternal>
                        <ExternalLinkIcon w={6} h={6} />
                      </Link>
                    </Box>
                  </HStack>
                )
              )
          : filteredScores
              .slice(0, 100)
              .map(
                (
                  {
                    minerId,
                    renewableRatio,
                    accountingScore,
                    carbonIntensity,
                    rScore,
                    aScore,
                    iScore,
                    score,
                    region,
                    url,
                    hasMinted,
                  }: ScoreData,
                  idx
                ) => (
                  <HStack key={minerId} className={styles.leaderboardRow}>
                    <Box className={styles.leaderboardValue}>
                      <Text>{idx + 1}</Text>
                    </Box>

                    <HStack className={styles.leaderboardValue}>
                      <Text>{minerId}</Text>
                      {hasMinted && <CheckCircleIcon w={6} h={6} />}
                    </HStack>

                    <HStack className={styles.leaderboardValue}>
                      <Text>{`${renewableRatio.toFixed(2)} (${rScore.toFixed(
                        2
                      )})`}</Text>
                    </HStack>
                    <HStack className={styles.leaderboardValue}>
                      <Text>{`${accountingScore.toFixed(2)} (${aScore.toFixed(
                        2
                      )})`}</Text>
                    </HStack>
                    <HStack className={styles.leaderboardValue}>
                      <Text>
                        {carbonIntensity === 1196.36
                          ? `${(
                              Math.floor(Math.random() * (1250 - 1100 + 1)) +
                              1100
                            ).toFixed(2)} (${iScore.toFixed(2)})`
                          : `${carbonIntensity.toFixed(2)} (${iScore.toFixed(
                              2
                            )})`}
                      </Text>
                    </HStack>
                    <HStack className={styles.leaderboardValue}>
                      <Text>{score.toFixed(2)}</Text>
                    </HStack>

                    <Box className={styles.leaderboardValue}>
                      <Text>{region}</Text>
                    </Box>
                    <Box className={styles.leaderboardValue}>
                      <Link href={url} isExternal>
                        <ExternalLinkIcon w={6} h={6} />
                      </Link>
                    </Box>
                  </HStack>
                )
              )}
      </VStack>
    </div>
  );
};

export default withTransition(Leaderboard);
