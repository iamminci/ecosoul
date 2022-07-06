import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import db from "../firebase/clientApp";
import { collection } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractWrite } from "wagmi";
import contract from "@abi/MyNFT.json";
import { Button, VStack, Link } from "@chakra-ui/react";
import { abridgeAddress } from "@utils/abridgeAddress";

const md5 = require("md5");

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL;
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

type User = {
  address: string;
  score: number;
};

const Home: NextPage = () => {
  const [currentUser, setCurrentUser] = useState<User>();
  const { address, isConnecting } = useAccount();
  const [hasMinted, setHasMinted] = useState(false);

  const userId = address ? md5(address).substring(0, 20) : undefined;

  useEffect(() => {
    // fetch user from DB, if it exists
    async function getUser() {
      if (userId) {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const foundUser = docSnap.data() as User;
          setCurrentUser(foundUser);
          console.log("found user: ", foundUser);
        } else {
          console.log("user not found");
        }
      }
    }
    getUser();
  }, [userId]);

  const {
    data: mintData,
    error: mintError,
    isLoading: mintIsLoading,
    write: mintWrite,
  } = useContractWrite({
    addressOrName: CONTRACT_ADDRESS
      ? CONTRACT_ADDRESS
      : "0xae6Bbc3C94D1A6C086AF6a9774B4434A58C793bf",
    contractInterface: contract.abi,
    functionName: "mint",
    // overrides: {
    //   value: payable,
    // },
    onError(error) {
      console.log(error);
    },
    onSuccess(data) {
      console.log("on mint success: ", data);
      setHasMinted(true);
    },
  });

  const handleMintNFT = async () => {
    try {
      await mintWrite();
    } catch (err) {
      console.log("Error minting NFT: ", err);
    }
  };

  // add user to DB if it doesn't exist
  const addUser = async () => {
    const collRef = collection(db, "users");
    await setDoc(doc(collRef, userId), {
      address: address,
      score: 0,
    });
  };

  // increment user's score
  const updateUserScore = async () => {
    if (!currentUser || !userId) {
      console.log("no user to update");
      return;
    }
    const newUser = { ...currentUser, score: currentUser.score + 1 };
    const collRef = collection(db, "users");
    await setDoc(doc(collRef, userId), newUser);
    setCurrentUser(newUser);
  };

  return (
    <div className={styles.container}>
      <ConnectButton />
      {isConnecting ? (
        <div>Connecting…</div>
      ) : (
        <>
          <Button onClick={addUser}>Add User</Button>
          <Button onClick={updateUserScore}>Approve</Button>
          <Button onClick={handleMintNFT}>Setup NFT</Button>
          {hasMinted && mintData && (
            <VStack>
              <p style={{ color: "white" }}>
                Your transaction was sent! Click here to view your transaction:
              </p>
              <Link
                href={`${BLOCK_EXPLORER || "https://goerli.etherscan.io"}/tx/${
                  mintData.hash
                }`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "white",
                  borderRadius: "0",
                }}
              >
                Etherscan: {abridgeAddress(mintData.hash)}
              </Link>
            </VStack>
          )}
        </>
      )}
      {mintError && (
        <p style={{ color: "red" }}>
          Error: {mintError?.message || "Something went wrong"}
        </p>
      )}
    </div>
  );
};

export default Home;
