import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import db from "../firebase/clientApp";
import { collection } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractWrite, useProvider, useSigner } from "wagmi";
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

type User = {
  address: string;
  score: number;
};

const Home: NextPage = () => {
  const [currentUser, setCurrentUser] = useState<User>();
  const { address, isConnecting } = useAccount();
  const [hasMinted, setHasMinted] = useState(false);
  const [merkleProof, setMerkleProof] = useState([""]);
  const [baseURI, setBaseURI] = useState<string>("");

  const userId = address ? md5(address).substring(0, 20) : undefined;

  const didMount = useRef(false);

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

  const uploadMetadata = async () => {
    try {
      const response = await fetch("/api/metadata", {
        method: "POST",
        body: JSON.stringify("hi"),
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await response.json();
      console.log("data: ", data);
      setBaseURI(data);
      await handleSetBaseURI(data);
    } catch (err) {
      console.log("Error request: ", err);
    }
  };

  async function handleSetBaseURI(baseURI: string) {
    if (typeof window.ethereum === "undefined" || !CONTRACT_ADDRESS) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const nft = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
    const transaction = await nft.setBaseURI(baseURI, merkleProof);
    await transaction.wait();
  }

  // const handleSetBaseURI = async () => {
  //   try {
  //     await setBaseURIWrite();
  //   } catch (err) {
  //     console.log("Error set base URI: ", err);
  //   }
  // };

  return (
    <div className={styles.container}>
      <div>
        <ConnectButton />
        {isConnecting && <>Connecting…</>}
      </div>
      <Spacer h="3rem" />
      <div>
        <Text fontSize="2xl">User Panel</Text>
        <Button onClick={handleMintNFT}>Setup NFT</Button>
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
        <Button onClick={addUser}>Add User</Button>
        <Button onClick={updateUserScore}>Approve</Button>
        {/* <Button onClick={handleSetBaseURI}>Set Base URI</Button> */}
        <Button onClick={uploadMetadata}>Upload Metadata</Button>
        {/* <Button onClick={updateMetadataAndContract}>Update NFT Metadata</Button> */}
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
