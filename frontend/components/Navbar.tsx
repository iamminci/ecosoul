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

const FaOpensea = () => (
  <Box
    width="48px"
    height="48px"
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <Image width="18px" height="18px" src="assets/opensea.png" />
  </Box>
);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className={styles.background}>
      <div className={styles.navbar}>
        <div className={styles.leftPartition}>
          <Link href="/" passHref>
            <Image alt="main logo" src="logo.png" className={styles.logo} />
          </Link>
        </div>
        <div className={styles.rightPartition}>
          <ConnectButton />
          <Link href="/about" passHref>
            <button className={styles.button}>About</button>
          </Link>
          <Link href="/claim" passHref>
            <button className={styles.button}>Claim NFT</button>
          </Link>
          <Link href="/leaderboard" passHref>
            <button className={styles.button}>Leaderboard</button>
          </Link>
        </div>
        {/* <div className={styles.mobilePartition}>
          <IconButton
            aria-label="hamburger menu icon"
            icon={<HamburgerIcon />}
            colorScheme="white"
            onClick={onOpen}
          />
        </div> */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent background="black">
            <DrawerCloseButton />
            <DrawerBody>
              <Stack marginTop="20" spacing="24px">
                <Link href="/" passHref>
                  <button className={styles.button} onClick={onClose}>
                    Home
                  </button>
                </Link>
                <Link href="/viewer" passHref>
                  <button className={styles.button} onClick={onClose}>
                    Explorer
                  </button>
                </Link>
                <ConnectButton />
              </Stack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Navbar;
