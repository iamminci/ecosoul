import type { NextPage } from "next";
import styles from "@styles/Leaderboard.module.css";
import { VStack, HStack, Text, Link, Box, Tooltip } from "@chakra-ui/react";
import { CheckCircleIcon, ExternalLinkIcon, InfoIcon } from "@chakra-ui/icons";
import withTransition from "@components/withTransition";

const data = [
  {
    id: "f01070149",
    rScore: 6.907767573112253,
    aScore: 6.77282,
    iScore: 5.719,
    greenScore: 7.517,
    region: "CN",
    link: "https://proofs.zerolabs.green/partners/filecoin/nodes/f01012/beneficiary",
    mintedNFT: true,
  },
  {
    id: "f01070149",
    rScore: 6.907767573112253,
    aScore: 6.77282,
    iScore: 5.719,
    greenScore: 7.517,
    region: "CN",
    link: "https://proofs.zerolabs.green/partners/filecoin/nodes/f01012/beneficiary",
    mintedNFT: true,
  },
  {
    id: "f01070149",
    rScore: 6.907767573112253,
    aScore: 6.77282,
    iScore: 5.719,
    greenScore: 7.517,
    region: "CN",
    link: "https://proofs.zerolabs.green/partners/filecoin/nodes/f01012/beneficiary",
    mintedNFT: true,
  },
  {
    id: "f01070149",
    rScore: 6.907767573112253,
    aScore: 6.77282,
    iScore: 5.719,
    greenScore: 7.517,
    region: "CN",
    link: "https://proofs.zerolabs.green/partners/filecoin/nodes/f01012/beneficiary",
    mintedNFT: true,
  },
  {
    id: "f01070149",
    rScore: 6.907767573112253,
    aScore: 6.77282,
    iScore: 5.719,
    greenScore: 7.517,
    region: "CN",
    link: "https://proofs.zerolabs.green/partners/filecoin/nodes/f01012/beneficiary",
    mintedNFT: true,
  },
  {
    id: "f01070149",
    rScore: 6.907767573112253,
    aScore: 6.77282,
    iScore: 5.719,
    greenScore: 7.517,
    region: "CN",
    link: "https://proofs.zerolabs.green/partners/filecoin/nodes/f01012/beneficiary",
    mintedNFT: true,
  },
  {
    id: "f01070149",
    rScore: 6.907767573112253,
    aScore: 6.77282,
    iScore: 5.719,
    greenScore: 7.517,
    region: "CN",
    link: "https://proofs.zerolabs.green/partners/filecoin/nodes/f01012/beneficiary",
    mintedNFT: true,
  },
  {
    id: "f01070149",
    rScore: 6.907767573112253,
    aScore: 6.77282,
    iScore: 5.719,
    greenScore: 7.517,
    region: "CN",
    link: "https://proofs.zerolabs.green/partners/filecoin/nodes/f01012/beneficiary",
    mintedNFT: true,
  },
  {
    id: "f01070149",
    rScore: 6.907767573112253,
    aScore: 6.77282,
    iScore: 5.719,
    greenScore: 7.517,
    region: "CN",
    link: "https://proofs.zerolabs.green/partners/filecoin/nodes/f01012/beneficiary",
    mintedNFT: true,
  },
  {
    id: "f01070149",
    rScore: 6.907767573112253,
    aScore: 6.77282,
    iScore: 5.719,
    greenScore: 7.517,
    region: "CN",
    link: "https://proofs.zerolabs.green/partners/filecoin/nodes/f01012/beneficiary",
    mintedNFT: true,
  },
  {
    id: "f01070149",
    rScore: 6.907767573112253,
    aScore: 6.77282,
    iScore: 5.719,
    greenScore: 7.517,
    region: "CN",
    link: "https://proofs.zerolabs.green/partners/filecoin/nodes/f01012/beneficiary",
    mintedNFT: true,
  },
];

const description = {
  rScore: "Renewable Ratio Score",
  aScore: "Accounting Granularity Score",
  iScore: "Carbon Intensity Score",
  gScore: "Overall Score is an aggregate score of the three above",
};

const Leaderboard: NextPage = () => {
  return (
    <div className={styles.container}>
      <VStack className={styles.titleContainer}>
        <VStack className={styles.title}>
          <Text>FIL STORAGE PROVIDER “GREEN” LEADERBOARD</Text>
          <Box className={styles.headerHr} />
        </VStack>
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
        {data.map(
          ({ id, rScore, aScore, iScore, greenScore, region, link }, idx) => (
            <HStack key={id} className={styles.leaderboardRow}>
              <Box className={styles.leaderboardValue}>
                <Text>{idx + 1}</Text>
              </Box>

              <HStack className={styles.leaderboardValue}>
                <Text>{id}</Text>
                <CheckCircleIcon w={6} h={6} />
              </HStack>

              <Box className={styles.leaderboardValue}>
                <Text>{rScore.toFixed(2)}</Text>
              </Box>
              <Box className={styles.leaderboardValue}>
                <Text>{aScore.toFixed(2)}</Text>
              </Box>
              <Box className={styles.leaderboardValue}>
                <Text>{iScore.toFixed(2)}</Text>
              </Box>
              <Box className={styles.leaderboardValue}>
                <Text>{greenScore.toFixed(2)}</Text>
              </Box>

              <Box className={styles.leaderboardValue}>
                <Text>{region}</Text>
              </Box>
              <Box className={styles.leaderboardValue}>
                <Link href={link} isExternal>
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
