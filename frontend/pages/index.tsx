import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { Spacer, AspectRatio } from "@chakra-ui/react";
import Link from "next/link";
import withTransition from "@components/withTransition";
import { motion } from "framer-motion";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL;
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1, ease: "easeInOut" }}
      >
        <AspectRatio className={styles.heroVideo}>
          <iframe
            title="naruto"
            src="https://player.vimeo.com/video/730360975?h=a54f36f84b?background=1&autoplay=1&quality=720p&controls=0&loop=10&muted=1"
            allowFullScreen
          />
        </AspectRatio>
      </motion.div>
      <div className={styles.contentContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>Welcome to EcoSoul,</div>
          <div className={styles.subtitle}>
            Community hub for eco-friendly Filecoin Network Storage Providers
          </div>
          <Spacer h="18px" />
          <Link href="/claim" passHref>
            <button className={styles.btn}>Claim Your NFT</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withTransition(Home);
