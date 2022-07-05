// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyNFT is ERC721, IERC2981, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private tokenCounter;

    string private baseURI;

    string private collectionURI;

    uint256 public numReservedTokens;

    enum MintState {
        Inactive,
        Active
    }

    MintState public mintState = MintState.Inactive;

    uint256 public constant MAX_TOTAL_SUPPLY = 5000;
    uint256 public constant MAX_PUBLIC_SALE_MINTS = 100;
    uint256 public constant PUBLIC_SALE_PRICE = 0 ether;

    constructor() ERC721("Plastic Bags NFT", "PBNFT") {}

    // ============ ACCESS CONTROL MODIFIERS ============
    modifier mintActive() {
        require(mintState == MintState.Active, "Public sale is not open");
        _;
    }

    modifier oneTokenPerWallet() {
        require(
            balanceOf(msg.sender) + numberOfTokens <= MAX_TOKENS_PER_WALLET,
            "Exceeds max tokens per wallet"
        );
        _;
    }

    modifier canMint() {
        require(
            tokenCounter.current() <= MAX_TOTAL_SUPPLY,
            "Insufficient tokens remaining"
        );
        _;
    }

    // ============ PUBLIC FUNCTIONS FOR MINTING ============
    function mint()
        external
        payable
        nonReentrant
        mintActive
        canMint
        oneTokenPerWallet
    {
        _safeMint(msg.sender, nextTokenId());
    }

    // ============ PUBLIC READ-ONLY FUNCTIONS ============
    function getBaseURI() external view returns (string memory) {
        return baseURI;
    }

    function getContractURI() external view returns (string memory) {
        return collectionURI;
    }

    function getLastTokenId() external view returns (uint256) {
        return tokenCounter.current();
    }

    // ============ SUPPORTING FUNCTIONS ============
    function nextTokenId() private returns (uint256) {
        tokenCounter.increment();
        return tokenCounter.current();
    }

    // ============ FUNCTION OVERRIDES ============
    function contractURI() public view returns (string memory) {
        return collectionURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Non-existent token");

        return
            string(abi.encodePacked(baseURI, "/", tokenId.toString(), ".json"));
    }

    // ============ OWNER-ONLY ADMIN FUNCTIONS ============
    function setMintActive() external onlyOwner {
        mintState = MintState.Active;
    }

    function setMintInactive() external onlyOwner {
        mintState = MintState.Inactive;
    }

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function setCollectionURI(string memory _collectionURI) external onlyOwner {
        collectionURI = _collectionURI;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function withdrawTokens(IERC20 token) public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(msg.sender, balance);
    }

    receive() external payable {}
}
