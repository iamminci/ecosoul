import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import {
  Button,
  VStack,
  Spacer,
  Text,
  Box,
  useDisclosure,
  AspectRatio,
} from "@chakra-ui/react";
import Link from "next/link";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL;
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <AspectRatio className={styles.heroVideo}>
        <iframe
          title="naruto"
          src="https://player.vimeo.com/video/730360975?h=a54f36f84b?background=1&autoplay=1&quality=720p&controls=0&loop=1&muted=1"
          allowFullScreen
        />
      </AspectRatio>
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
      {/* <>
          <Button onClick={onOpen}>Open Modal</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Update User Score</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text fontSize="xl" paddingBottom={"10px"}>
                  How many plastic bags did this user save?
                </Text>
                <Select placeholder="Select option">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button variant="solid" mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => updateUserScore(scannedUserId, "score1")}
                >
                  Approve
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </> */}
    </div>
  );
};

export default Home;
