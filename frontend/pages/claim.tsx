import type { NextPage } from "next";
import {
  VStack,
  Link,
  Text,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Spinner,
} from "@chakra-ui/react";
import styles from "@styles/Claim.module.css";
import { useState } from "react";
import { abridgeAddress } from "@utils/abridgeAddress";
import { useContractWrite } from "wagmi";
import withTransition from "@components/withTransition";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import contract from "@data/EcoSoul.json";
import minerTokenIDMap from "@data/minerTokenIDMap.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const BLOCK_EXPLORER = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL;

const Claim: NextPage = () => {
  const [hasMinted, setHasMinted] = useState(false);
  const [merkleProof, setMerkleProof] = useState([""]);
  const [baseURI, setBaseURI] = useState<string>("");
  const [scannedUserId, setScannedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [providerID, setProviderID] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isModalBtnLoading, setIsModalBtnLoading] = useState<boolean>(false);

  // @ts-ignore: map key typing is off, nbd
  const tokenId = providerID ? minerTokenIDMap[providerID] : -1;

  function handleClickCopyIcon() {
    setIsCopied(true);
    navigator.clipboard.writeText("booboobies");
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }

  // TODO: add signature verification
  function handleSPIdentityVerification() {
    setIsModalBtnLoading(true);
    setTimeout(() => {
      setIsVerified(true);
      setIsModalBtnLoading(false);
      onClose();
    }, 1000);
  }

  const {
    data: mintTxnResponse,
    error: mintError,
    isLoading: mintIsLoading,
    write: mintWrite,
  } = useContractWrite({
    addressOrName: CONTRACT_ADDRESS
      ? CONTRACT_ADDRESS
      : "0x6eFfa56FDB4AF1688Fa9Ff5E6C7Eb24813f00060",
    contractInterface: contract.abi,
    functionName: "mint",
    args: [tokenId],
    onError(error) {
      console.log(error);
    },
    onSuccess(data) {
      console.log("on mint success: ", data);
      setHasMinted(true);
    },
  });

  const setupNFT = async () => {
    try {
      if (!tokenId) {
        console.error("No token ID found for given Storage Provider ID");
        return;
      }
      await mintWrite();
      console.log("mintng EcoSoul NFT...");
    } catch (err) {
      console.log("Error minting NFT: ", err);
    }
  };

  const handleSetProviderID = (e: any) => {
    setProviderID(e.target.value);
  };

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
              <button className={styles.btn} onClick={setupNFT}>
                Claim Your NFT
              </button>
              {mintTxnResponse && (
                <VStack paddingTop="1rem">
                  <p style={{ color: "white" }}>
                    Your transaction was sent! Click here to view your
                    transaction:
                  </p>
                  <Link
                    href={`${
                      BLOCK_EXPLORER || "https://rinkeby.etherscan.io"
                    }/tx/${mintTxnResponse.hash}`}
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
            </VStack>
          ) : (
            <VStack className={styles.claimContainer}>
              <Text className={styles.claimDescription}>
                We have not been able to identify a storage provider ID under
                your account. Please verify your identity as a storage provider
                in order to claim your NFT.
              </Text>
              <Box pb="1rem">
                <Input
                  placeholder="Please provider your Storage Provider ID to verify."
                  className={styles.spidInput}
                  onChange={handleSetProviderID}
                  value={providerID}
                />
              </Box>
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
                <Text>{`Storage Provider ID: ${providerID}`}</Text>
                <Box h="2rem" />
                <Text>Worker Address: f3qc...ovpa</Text>
                <Box h="2rem" />
                <Text>
                  {`Message: Signing message for ${providerID} on EcoSoul at 2022-07-17
                  01:27:45`}
                  {/* {`Message: Signing message for ${providerID} on EcoSoul at ${new Date().toLocaleString()}`} */}
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
              <button
                className={styles.btn}
                onClick={handleSPIdentityVerification}
              >
                {isModalBtnLoading ? (
                  <Box width="100%" display="flex" justifyContent="center">
                    <Spinner color="white" />
                  </Box>
                ) : (
                  "Verify SP Identity"
                )}
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
