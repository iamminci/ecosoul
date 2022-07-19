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
} from "@chakra-ui/react";
import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <ConnectButton />
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
