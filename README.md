# Learn DEFI - ERC721 Tokens

In this project I am playing around with ERC721 non fungible tokens - simulating a marketplace for ERC721 tokens(NFTs)

# Steps to create project - run the commands below

mkdir learn-marketplace-unfungeble
cd learn-marketplace-unfungeble
npm init --yes
npm install --save-dev hardhat

// only for Windows users
npm install --save-dev @nomicfoundation/hardhat-toolbox

npx hardhat

npm install @openzeppelin/contracts

npm install dotenv

npx hardhat compile

# Contract explanations

    MyMarketPlaceNFT Contract
        ✔ User IERC721 to make calls to any ERC721 contracts to be able to transfer NFTs
        ✔ listItem - Add an NFT to the marketplace
        ✔ purchase - Purchase NFT that is listed in the marketplace 
    
    MyERC721 Contract - dummy ERC721 contract - to be used for testing purpose only
        ✔ Extends ERC721
        ✔ ERC721 to mint tokens etc

# Tests - test/tests.js

    Test approve/transfer tokens
        ✔ Create CUTE and BOOBLES NFT tokens
        ✔ Store balance for each user
        ✔ Transfer CUTE NFTs to the marketplace
        ✔ Check if the transfered NFTs belong now to the marketplace
        ✔ Transfer BOOBLES NFTs to the marketplace
        ✔ Check if the transfered NFTs belong now to the marketplace
        ✔ Try to do different purchases with different conditions just to test the require in each function

# Test - run the command below
npx hardhat test test/tests.js
