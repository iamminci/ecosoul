import type { NextPage } from "next";
import {
  Button,
  VStack,
  Link,
  Spacer,
  Text,
  Box,
  useDisclosure,
  AspectRatio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";
import styles from "@styles/Claim.module.css";
import { useState } from "react";
import { abridgeAddress } from "@utils/abridgeAddress";
import { useContractWrite } from "wagmi";
import withTransition from "@components/withTransition";
import { CheckCircleIcon, CheckIcon, CopyIcon } from "@chakra-ui/icons";

const Claim: NextPage = () => {
  const [hasMinted, setHasMinted] = useState(false);
  const [merkleProof, setMerkleProof] = useState([""]);
  const [baseURI, setBaseURI] = useState<string>("");
  const [scannedUserId, setScannedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isCopied, setIsCopied] = useState<boolean>(false);

  function handleClickCopyIcon() {
    setIsCopied(true);
    navigator.clipboard.writeText("booboobies");
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }
  //   const {
  //     data: lastTokenId,
  //     isError,
  //     isLoading: isLoadingLastTokenId,
  //   } = useContractRead({
  //     addressOrName: CONTRACT_ADDRESS
  //       ? CONTRACT_ADDRESS
  //       : "0x3d2a9340F3f14dEe00245B7De6e9695Db65DBFE0",
  //     contractInterface: contract.abi,
  //     functionName: "getLastTokenId",
  //   });

  //   const getUser = async (userId: string) => {
  //     if (userId) {
  //       const docRef = doc(db, "users", userId);
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         const foundUser = docSnap.data() as User;
  //         setCurrentUser(foundUser);
  //         return foundUser;
  //         console.log("found user: ", foundUser);
  //       } else {
  //         console.log("user not found");
  //       }
  //     }
  //   };

  //   useEffect(() => {
  //     // fetch user from DB, if it exists
  //     getUser(userId);
  //   }, [userId]);

  //   // generate and set merkle proof to state
  //   useEffect(() => {
  //     if (address) {
  //       const merkle = generateMerkleProof(adminList, address);
  //       console.log("merkle proof: ", merkle);
  //       if (merkle.valid) {
  //         setMerkleProof(merkle.proof);
  //       } else {
  //         setMerkleProof([]);
  //       }
  //     }
  //   }, [address]);

  //   const {
  //     data: mintTxnResponse,
  //     error: mintError,
  //     isLoading: mintIsLoading,
  //     write: mintWrite,
  //   } = useContractWrite({
  //     addressOrName: CONTRACT_ADDRESS
  //       ? CONTRACT_ADDRESS
  //       : "0x3d2a9340F3f14dEe00245B7De6e9695Db65DBFE0",
  //     contractInterface: contract.abi,
  //     functionName: "mint",
  //     onError(error) {
  //       console.log(error);
  //     },
  //     onSuccess(data) {
  //       console.log("on mint success: ", data);
  //       setHasMinted(true);
  //     },
  //   });

  //   const {
  //     data: setBaseURITxnResponse,
  //     error: setBaseURIError,
  //     isLoading: setBaseURIIsLoading,
  //     write: setBaseURIWrite,
  //   } = useContractWrite({
  //     addressOrName: CONTRACT_ADDRESS
  //       ? CONTRACT_ADDRESS
  //       : "0x3d2a9340F3f14dEe00245B7De6e9695Db65DBFE0",
  //     contractInterface: contract.abi,
  //     functionName: "setBaseURI",
  //     args: [baseURI, merkleProof],
  //     onError(error) {
  //       console.log(error);
  //     },
  //     onSuccess(data) {
  //       console.log("on set base URI success: ", data);
  //       setHasMinted(true);
  //     },
  //   });

  //   const setupNFT = async () => {
  //     try {
  //       //   if (!lastTokenId) {
  //       //     console.error("Latest token ID not found");
  //       //     return;
  //       //   }
  //       await mintWrite();
  //       console.log("successfully minted EcoSoul NFT");
  //       //   await addUser(lastTokenId.toNumber() + 1);
  //       //   console.log("successfully added user to db");
  //     } catch (err) {
  //       console.log("Error minting NFT: ", err);
  //     }
  //   };

  //   // add user to DB if it doesn't exist
  //   //   const addUser = async (tokenId: number) => {
  //   //     const collRef = collection(db, "users");
  //   //     await setDoc(doc(collRef, userId), {
  //   //       address: address,
  //   //       score1: 0,
  //   //       score2: 0,
  //   //       score3: 0,
  //   //       score4: 0,
  //   //       score5: 0,
  //   //       ens: "ecosoul.eth",
  //   //       tokenId: tokenId,
  //   //     });
  //   //   };

  //   const updateUserScore = async (userId: string, scoreType: ScoreType) => {
  //     if (isLoading) return;
  //     setIsLoading(true);
  //     try {
  //       const fetchedUser = await getUser(userId);
  //       if (!fetchedUser) {
  //         console.error("No user found of that userId");
  //         return;
  //       }

  //       //   if (!address || !adminList.includes(address)) {
  //       //     console.error("Not an admin, cannot increment score");
  //       //     return;
  //       //   }

  //       // first update increment user's score in the DB
  //       const newUser = await updateUserData(fetchedUser, scoreType);

  //       // then recreate the user metadata and fetch new baseURI
  //       const response = await fetch("/api/metadata", {
  //         method: "POST",
  //         body: JSON.stringify(newUser),
  //         headers: {
  //           "content-type": "application/json",
  //         },
  //       });
  //       const newBaseURI = await response.json();
  //       console.log("successfully fetched new base URI: ", newBaseURI);
  //       setBaseURI(newBaseURI);

  //       // finally set new base URI on the contract to reflect on NFT
  //       await handleSetBaseURI(newBaseURI);
  //     } catch (err) {
  //       console.log("Error request: ", err);
  //     }
  //   };

  //   // increment user's score
  //   const updateUserData = async (userToUpdate: User, scoreType: ScoreType) => {
  //     if (!userToUpdate || !userId) {
  //       console.log("no user to update");
  //       return;
  //     }
  //     const newUser = { ...userToUpdate };
  //     newUser[scoreType] = userToUpdate[scoreType] + 1;
  //     const collRef = collection(db, "users");
  //     await setDoc(doc(collRef, userId), newUser);
  //     console.log("successfully updated user score: ", newUser);

  //     setCurrentUser(newUser);
  //     return newUser;
  //   };

  //   async function handleSetBaseURI(baseURI: string) {
  //     if (typeof window.ethereum === "undefined" || !CONTRACT_ADDRESS) return;
  //     const provider = new ethers.providers.Web3Provider(window.ethereum as any);
  //     const signer = provider.getSigner();
  //     const nft = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
  //     const transaction = await nft.setBaseURI(baseURI, merkleProof);
  //     await transaction.wait();
  //   }

  const isVerified = false;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.backdropImage} />
        <VStack className={styles.contentContainer}>
          <VStack className={styles.titleContainer}>
            <Text className={styles.title}>
              CLAIM YOUR ECOSOUL COMMUNITY NFT
            </Text>
            <Box className={styles.headerHr} />
          </VStack>
          {isVerified ? (
            <VStack className={styles.claimContainer}>
              <Text className={styles.claimDescription}>
                Join the community of eco-friendly FIL Storage Providers by
                minting the EcoSoul-bound token and sharing with the world.
              </Text>
              <button className={styles.btn} onClick={onOpen}>
                Claim Your NFT
              </button>
            </VStack>
          ) : (
            <VStack className={styles.claimContainer}>
              <Text className={styles.claimDescription}>
                We have not been able to identify a storage provider ID under
                your account. Please verify your identity as a storage provider
                in order to claim your NFT.
              </Text>
              <button className={styles.btn} onClick={onOpen}>
                Verify SP Identity
              </button>
            </VStack>
          )}
        </VStack>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay className={styles.modalOverlay} />
          <ModalContent className={styles.modalContent}>
            <VStack className={styles.modalContentContainer}>
              <ModalHeader color="white" fontSize="24px">
                Signature Verification
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody className={styles.modalBody}>
                <Text>Storage Provider ID: f01234</Text>
                <Box h="2rem" />
                <Text>Worker Address: f3qc...ovpa</Text>
                <Box h="2rem" />
                <Text>
                  Message: Signing message for f01234 on EcoSoul at 2022-07-17
                  01:27:45{" "}
                </Text>
                <Box h="2rem" />
                <Text>Sign code</Text>
                <Box h=".7rem" />
                <Box className={styles.signCodeBox}>
                  <Text>
                    lotus wallet sign
                    f3qcsrasb3biiwqv26l5wavmu7wutohuaf66wtmqf2ryvj7zyshjokjvn5uuzxr7fdgjydffrshznvwa3movpa
                    5369676e696e672
                  </Text>
                  {!isCopied ? (
                    <CopyIcon
                      className={styles.copyIcon}
                      onClick={handleClickCopyIcon}
                    />
                  ) : (
                    <CheckIcon className={styles.checkIcon} />
                  )}
                </Box>
                <Box h="2rem" />
                <Text>Signature: </Text>
                <Box h=".7rem" />
                <Input
                  placeholder="Please copy the sign code , sign it with your Filecoin Wallet, and enter the signature."
                  className={styles.input}
                />
              </ModalBody>
              <Box h="2rem" />
              <button className={styles.btn} onClick={onOpen}>
                Verify SP Identity
              </button>
            </VStack>
          </ModalContent>
        </Modal>

        {/* <Button onClick={setupNFT}>Setup NFT</Button> */}
        {/* {hasMinted && mintTxnResponse && (
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
        )} */}
        {/* {mintError && (
          <p style={{ color: "red" }}>
            Error: {mintError?.message || "Something went wrong"}
          </p>
        )} */}
        {/* {setBaseURIError && (
        <p style={{ color: "red" }}>
          Error: {setBaseURIError?.message || "Something went wrong"}
        </p>
      )} */}
      </div>
    </>
  );
};

export default withTransition(Claim);
