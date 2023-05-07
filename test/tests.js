const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('MyMarketPlaceNFT Tests', function () {
    
    let deployer, user1, user2, user3;

    const CUTE_NFT_PRICE = ethers.utils.parseEther('5');
    const BOOBLES_NFT_PRICE = ethers.utils.parseEther('7');

    before(async function () {
        /** Deployment and minting tests */
        
        [deployer, user1, user2, user3] = await ethers.getSigners();

        // User1 creates his own NFT collection
        let NFTFactory = await ethers.getContractFactory(
            'contracts/MyERC721.sol:MyERC721',
            user1
        );
        this.cuteNFT = await NFTFactory.deploy("Crypto Cuties", "CUTE", 1000);
        await this.cuteNFT.mintBulk(30);
        expect(await this.cuteNFT.balanceOf(user1.address)).to.be.equal(30);
        
        // User3 creates his own NFT collection
        NFTFactory = await ethers.getContractFactory('MyERC721', user3);
        this.booblesNFT = await NFTFactory.deploy("Rare Boobles", "BOO", 10000);
        await this.booblesNFT.mintBulk(120);
        expect(await this.booblesNFT.balanceOf(user3.address)).to.be.equal(120);

        // Store users initial balance
        this.user1InitialBalance = await ethers.provider.getBalance(user1.address);
        this.user2InitialBalance = await ethers.provider.getBalance(user2.address);
        this.user3InitialBalance = await ethers.provider.getBalance(user3.address);
    });

    it('Deployment & Listing Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // TODO: Deploy Marketplace from deployer
        const myMarketPlaceContract = await ethers.getContractFactory("MyMarketPlaceNFT");
        myMarketPlace = await myMarketPlaceContract.deploy();

        console.log('cute nft price:', CUTE_NFT_PRICE);
        
        // TODO: User1 lists Cute NFT tokens 1-10 for 5 ETH each
        for (let i = 1; i <= 10; i++) {
            await this.cuteNFT.connect(user1).approve(myMarketPlace.address, i);
            //address nftContract, uint256 _tokenId, uint256 _price
            await myMarketPlace.connect(user1).listItem(this.cuteNFT.address, i, CUTE_NFT_PRICE);
        }

        // TODO: Check that Marketplace owns 10 Cute NFTs
        for (let i = 1; i <= 10; i++) {
            expect(await this.cuteNFT.connect(deployer).ownerOf(i)).to.equal(myMarketPlace.address);
        }

        // TODO: Checks that the marketplace mapping is correct (All data is correct), check the 10th item.
        const nftListing = await myMarketPlace.listedItems(10);
        expect(nftListing[0]).to.equal(10);
        expect(nftListing[1]).to.equal(this.cuteNFT.address);
        expect(nftListing[2]).to.equal(10);
        expect(nftListing[3]).to.equal(CUTE_NFT_PRICE);
        expect(nftListing[4]).to.equal(user1.address);
        expect(nftListing[5]).to.equal(false);
        

        // TODO: User3 lists Boobles NFT tokens 1-5 for 7 ETH each
        for (let i = 1; i <= 5; i++) {
            await this.booblesNFT.connect(user3).approve(myMarketPlace.address, i);
            //address nftContract, uint256 _tokenId, uint256 _price
            await myMarketPlace.connect(user3).listItem(this.booblesNFT.address, i, BOOBLES_NFT_PRICE);
        }

        // TODO: Check that Marketplace owns 5 Booble NFTs
        for (let i = 1; i <= 5; i++) {
            expect(await this.booblesNFT.connect(deployer).ownerOf(i)).to.equal(myMarketPlace.address);
        }

        // TODO: Checks that the marketplace mapping is correct (All data is correct), check the 15th item.
        const lastNftListing = await myMarketPlace.listedItems(15);
        expect(lastNftListing[0]).to.equal(15);
        expect(lastNftListing[1]).to.equal(this.booblesNFT.address);
        expect(lastNftListing[2]).to.equal(5);
        expect(lastNftListing[3]).to.equal(BOOBLES_NFT_PRICE);
        expect(lastNftListing[4]).to.equal(user3.address);
        expect(lastNftListing[5]).to.equal(false); 
    });

    it('Purchases Tests', async function () {
        /** CODE YOUR SOLUTION HERE */

        // All Purchases From User2 //
        
        // TODO: Try to purchase itemId 100, should revert
        await expect(myMarketPlace.connect(user2).purchase(100, {value: CUTE_NFT_PRICE})).to.revertedWith("The NFT you want to purchase do not exists in our marketplace!");
    
        // TODO: Try to purchase itemId 3, without ETH, should revert
        await expect(myMarketPlace.connect(user2).purchase(3, {value: 99})).to.revertedWith("The NFT price is not the same as the amount sent!");

        // TODO: Try to purchase itemId 3, with ETH, should work
        await myMarketPlace.connect(user2).purchase(3, {value: CUTE_NFT_PRICE});

        // TODO: Can't purchase sold item
        await expect(myMarketPlace.connect(user3).purchase(3, {value: CUTE_NFT_PRICE})).to.revertedWith("The NFT you want to purchase is already sold!");

        // TODO: User2 owns itemId 3 -> Cuties tokenId 3
        expect(await this.cuteNFT.connect(user2).ownerOf(3)).to.equal(user2.address);

        // TODO: User1 got the right amount of ETH for the sale
        console.log("user1 value:", this.user1InitialBalance);

        // TODO: Purchase itemId 11
        await myMarketPlace.connect(user1).purchase(11, {value: BOOBLES_NFT_PRICE});
        
        // TODO: User2 owns itemId 11 -> Boobles tokenId 1
        expect(await this.booblesNFT.connect(user2).ownerOf(1)).to.equal(user1.address);

        // TODO: User3 got the right amount of ETH for the sale
        console.log("user3 value:", this.user3InitialBalance);
    });
});
