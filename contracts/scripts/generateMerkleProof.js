const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
// const fs = require("fs");

export const generateMerkleProof = (addresses, address) => {
  const leafNodes = addresses.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

  const hashedAddress = keccak256(address);
  const proof = merkleTree.getHexProof(hashedAddress);
  const root = merkleTree.getHexRoot();

  const valid = merkleTree.verify(proof, hashedAddress, root);

  console.log("generated merkle proof:", proof, valid);
  return proof;
};
