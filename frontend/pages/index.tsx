import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import db from "../firebase/clientApp";
import { collection } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useEnsName,
  useProvider,
  useSigner,
} from "wagmi";
import { Button, VStack, Link, Spacer, Text } from "@chakra-ui/react";
import { abridgeAddress } from "@utils/abridgeAddress";
import { generateMerkleProof } from "@utils/generateMerkleProof";
import contract from "@data/MyNFT.json";
import adminList from "@data/adminWallets.json";
import { ethers } from "ethers";

const md5 = require("md5");

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL;
const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

interface User {
  address: string;
  score1: number;
  score2: number;
  score3: number;
  score4: number;
  score5: number;
  ens?: string;
  tokenId?: number;
}

type ScoreType = "score1" | "score2" | "score3" | "score4" | "score5";

const Home: NextPage = () => {
  const [currentUser, setCurrentUser] = useState<User>();
  const { address, isConnecting } = useAccount();
  const [hasMinted, setHasMinted] = useState(false);
  const [merkleProof, setMerkleProof] = useState([""]);
  const [baseURI, setBaseURI] = useState<string>("");

  // TODO: use ENS name properly
  // const { data, isError, isLoading } = useEnsName({
  //   address: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
  // });

  const {
    data: lastTokenId,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: CONTRACT_ADDRESS
      ? CONTRACT_ADDRESS
      : "0x3d2a9340F3f14dEe00245B7De6e9695Db65DBFE0",
    contractInterface: contract.abi,
    functionName: "getLastTokenId",
  });

  const userId = address ? md5(address).substring(0, 20) : undefined;

  const getUser = async (userId: string) => {
    if (userId) {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const foundUser = docSnap.data() as User;
        setCurrentUser(foundUser);
        return foundUser;
        console.log("found user: ", foundUser);
      } else {
        console.log("user not found");
      }
    }
  };

  useEffect(() => {
    // fetch user from DB, if it exists
    getUser(userId);
  }, [userId]);

  // generate and set merkle proof to state
  useEffect(() => {
    if (address) {
      const merkle = generateMerkleProof(adminList, address);
      console.log("merkle proof: ", merkle);
      if (merkle.valid) {
        setMerkleProof(merkle.proof);
      } else {
        setMerkleProof([]);
      }
    }
  }, [address]);

  const {
    data: mintTxnResponse,
    error: mintError,
    isLoading: mintIsLoading,
    write: mintWrite,
  } = useContractWrite({
    addressOrName: CONTRACT_ADDRESS
      ? CONTRACT_ADDRESS
      : "0x3d2a9340F3f14dEe00245B7De6e9695Db65DBFE0",
    contractInterface: contract.abi,
    functionName: "mint",
    onError(error) {
      console.log(error);
    },
    onSuccess(data) {
      console.log("on mint success: ", data);
      setHasMinted(true);
    },
  });

  const {
    data: setBaseURITxnResponse,
    error: setBaseURIError,
    isLoading: setBaseURIIsLoading,
    write: setBaseURIWrite,
  } = useContractWrite({
    addressOrName: CONTRACT_ADDRESS
      ? CONTRACT_ADDRESS
      : "0x3d2a9340F3f14dEe00245B7De6e9695Db65DBFE0",
    contractInterface: contract.abi,
    functionName: "setBaseURI",
    args: [baseURI, merkleProof],
    onError(error) {
      console.log(error);
    },
    onSuccess(data) {
      console.log("on set base URI success: ", data);
      setHasMinted(true);
    },
  });

  const setupNFT = async () => {
    try {
      if (!lastTokenId) {
        console.error("Latest token ID not found");
        return;
      }
      await mintWrite();
      console.log("successfully minted EcoSoul NFT");
      await addUser(lastTokenId.toNumber() + 1);
      console.log("successfully added user to db");
    } catch (err) {
      console.log("Error minting NFT: ", err);
    }
  };

  // add user to DB if it doesn't exist
  const addUser = async (tokenId: number) => {
    const collRef = collection(db, "users");
    await setDoc(doc(collRef, userId), {
      address: address,
      score1: 0,
      score2: 0,
      score3: 0,
      score4: 0,
      score5: 0,
      ens: "ecosoul.eth",
      tokenId: tokenId,
    });
  };

  const tempUserId = md5(
    "0x4A59253d792fC51d2D37B3616966A3Ba1EA91c76"
  ).substring(0, 20);

  const updateUserScore = async (userId: string, scoreType: ScoreType) => {
    try {
      const fetchedUser = await getUser(userId);
      if (!fetchedUser) {
        console.error("No user found of that userId");
        return;
      }

      if (!address || !adminList.includes(address)) {
        console.error("Not an admin, cannot increment score");
        return;
      }

      // first update increment user's score in the DB
      const newUser = await updateUserData(fetchedUser, scoreType);

      // then recreate the user metadata and fetch new baseURI
      const response = await fetch("/api/metadata", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "content-type": "application/json",
        },
      });
      const newBaseURI = await response.json();
      console.log("successfully fetched new base URI: ", newBaseURI);
      setBaseURI(newBaseURI);

      // finally set new base URI on the contract to reflect on NFT
      await handleSetBaseURI(newBaseURI);
    } catch (err) {
      console.log("Error request: ", err);
    }
  };

  // increment user's score
  const updateUserData = async (userToUpdate: User, scoreType: ScoreType) => {
    if (!userToUpdate || !userId) {
      console.log("no user to update");
      return;
    }
    const newUser = { ...userToUpdate };
    newUser[scoreType] = userToUpdate[scoreType] + 1;
    const collRef = collection(db, "users");
    await setDoc(doc(collRef, userId), newUser);
    console.log("successfully updated user score: ", newUser);

    setCurrentUser(newUser);
    return newUser;
  };

  async function handleSetBaseURI(baseURI: string) {
    if (typeof window.ethereum === "undefined" || !CONTRACT_ADDRESS) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const nft = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    const transaction = await nft.setBaseURI(baseURI, merkleProof);
    await transaction.wait();
  }

  return (
    <div className={styles.container}>
      <div>
        <ConnectButton />
        {isConnecting && <>Connecting…</>}
      </div>
      <Spacer h="3rem" />
      <div>
        <Text fontSize="2xl">User Panel</Text>
        <Button onClick={setupNFT}>Setup NFT</Button>
        {hasMinted && mintTxnResponse && (
          <VStack>
            <p style={{ color: "white" }}>
              Your transaction was sent! Click here to view your transaction:
            </p>
            <Link
              href={`${BLOCK_EXPLORER || "https://goerli.etherscan.io"}/tx/${
                mintTxnResponse.hash
              }`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "white",
                borderRadius: "0",
              }}
            >
              Etherscan: {abridgeAddress(mintTxnResponse.hash)}
            </Link>
          </VStack>
        )}
        {mintError && (
          <p style={{ color: "red" }}>
            Error: {mintError?.message || "Something went wrong"}
          </p>
        )}
      </div>
      <Spacer h="3rem" />
      <div>
        <Text fontSize="2xl">Admin Panel</Text>
        <Button onClick={() => updateUserScore(tempUserId, "score1")}>
          Increment User Score 1
        </Button>
      </div>
      {setBaseURIError && (
        <p style={{ color: "red" }}>
          Error: {setBaseURIError?.message || "Something went wrong"}
        </p>
      )}
    </div>
  );
};

export default Home;
