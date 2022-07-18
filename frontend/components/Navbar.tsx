import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  Spacer,
  Stack,
  useDisclosure,
  Image,
  Box,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import {
  connectWallet,
  contractCreationFunction,
  contractSigningFunction,
} from "../components/ConnectWallet";
import { useState } from "react";
import { abridgeAddress } from "@utils/abridgeAddress";
import { useEffect } from "react";

const ACCOUNT_ID = process.env.NEXT_PUBLIC_ACCOUNT_ID ?? "0.0.47565504";

const Navbar = () => {
  const [address, setAddress] = useState("");
  const [saved, setSaved] = useState<any>({});

  async function handleConnectHashPack() {
    const saveData = await connectWallet();
    setSaved(saveData);
    console.log("saveData: ", saveData);
    setTimeout(() => {
      const account: string | null = localStorage.getItem("pairedAccounts");
      if (account) setAddress(account);
      console.log("address set!");
    }, 5000);
  }

  return (
    <div className={styles.background}>
      <div className={styles.navbar}>
        <div className={styles.leftPartition}>
          <Link href="/" passHref>
            <Image
              alt="main logo"
              src="logo.png"
              className={styles.logo}
              cursor="pointer"
            />
          </Link>
        </div>
        <div className={styles.rightPartition}>
          <Box className={styles.connectBtn}>
            {address ? (
              <Text>Connected Address: {address}</Text>
            ) : (
              <button onClick={handleConnectHashPack}>
                Connect to HashPack
              </button>
            )}
          </Box>
          <Link href="/claim" passHref>
            <button className={styles.button}>Claim NFT</button>
          </Link>
          <Link href="/leaderboard" passHref>
            <button className={styles.button}>Leaderboard</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
