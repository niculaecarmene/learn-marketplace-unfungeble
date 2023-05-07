//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MyMarketPlaceNFT{

    // TODO: Constants
    uint256 maxPrice = 100 ether;

    // TODO: Item Struct
    struct Item {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool isSold;
    }

    // TODO: State Variables and Mappings
    uint256 itemsCounter;
    mapping (uint256=>Item) public listedItems;
    
    constructor() {
        itemsCounter = 0;
    }

    // TODO: List item function
    // 1. Make sure params are correct
    // 2. Increment itemsCounter
    // 3. Transfer token from sender to the contract
    // 4. Add item to listedItems mapping
    function listItem(address nftContract, uint256 _tokenId, uint256 _price) external {
        require(_price <= maxPrice, 'The maximum price was reached!');
        require(_price > 0, "Price must be greater than zero");
        IERC721 nft = IERC721(nftContract);
        /*
        require(nft.ownerOf(_tokenId) == msg.sender, "You do not own this NFT");
        require(nft.getApproved(_tokenId) == address(this), "You must approve the marketplace to transfer the NFT");
        */
        nft.transferFrom(msg.sender, address(this), _tokenId);
        itemsCounter++;
        listedItems[itemsCounter] = Item(itemsCounter, nftContract, _tokenId, _price, payable(msg.sender), false);
    }

    // TODO: Purchase item function 
    // 1. Check that item exists and not sold
    // 2. Check that enough ETH was paid
    // 3. Change item status to "sold"
    // 4. Transfer NFT to buyer
    // 5. Transfer ETH to seller
    function purchase(uint _itemId) external payable {
        require(listedItems[_itemId].itemId != 0, 'The NFT you want to purchase do not exists in our marketplace!');
        require(!listedItems[_itemId].isSold, 'The NFT you want to purchase is already sold!');
        require(msg.value == listedItems[_itemId].price, 'The NFT price is not the same as the amount sent!');
        IERC721 nft = IERC721(listedItems[_itemId].nftContract);
        require(nft.getApproved(listedItems[_itemId].tokenId) != msg.sender, "This marketplace is not allowed to sell this NFT!");

        //nft.transferFrom(listedItems[_itemId].seller, msg.sender, listedItems[_itemId].tokenId);
        nft.transferFrom(address(this), msg.sender, listedItems[_itemId].tokenId);

        bool transferSuccess = payable(listedItems[_itemId].seller).send(msg.value);
        require(transferSuccess, "Transfer failed");

        listedItems[_itemId].isSold = true;
        
    }
    
}