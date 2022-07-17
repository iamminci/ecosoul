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
} from "@chakra-ui/react";
import { useState } from "react";
import { abridgeAddress } from "@utils/abridgeAddress";

const Claim: NextPage = () => {
  const [hasMinted, setHasMinted] = useState(false);
  const [merkleProof, setMerkleProof] = useState([""]);
  const [baseURI, setBaseURI] = useState<string>("");
  const [scannedUserId, setScannedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
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
      {setBaseURIError && (
        <p style={{ color: "red" }}>
          Error: {setBaseURIError?.message || "Something went wrong"}
        </p>
      )}
    </>
  );
};
