// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTRental is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _listingIds;

    struct Listing {
        address owner;
        uint256 pricePerDay;
        uint256 maxDuration;
        bool isActive;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
    mapping(address => mapping(uint256 => address)) public currentRenter;
    mapping(address => mapping(uint256 => uint256)) public rentalEndTime;

    event NFTListed(address indexed nftContract, uint256 indexed tokenId, uint256 pricePerDay, uint256 maxDuration);
    event NFTRented(address indexed nftContract, uint256 indexed tokenId, address indexed renter, uint256 duration);
    event NFTUnlisted(address indexed nftContract, uint256 indexed tokenId);
    event RentalEnded(address indexed nftContract, uint256 indexed tokenId);

    // Track listed NFT contracts and their token IDs
    address[] public listedContracts;
    mapping(address => uint256[]) public listedTokenIds;

    modifier listingExists(address nftContract, uint256 tokenId) {
        require(listings[nftContract][tokenId].isActive, "Listing does not exist");
        _;
    }

    function listNFT(address nftContract, uint256 tokenId, uint256 pricePerDay, uint256 maxDuration) external {
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not the owner");
        require(pricePerDay > 0, "Price must be greater than 0");
        require(maxDuration > 0, "Duration must be greater than 0");
        require(currentRenter[nftContract][tokenId] == address(0), "NFT is currently rented");

        listings[nftContract][tokenId] = Listing(msg.sender, pricePerDay, maxDuration, true);
        
        // Track the new listing
        if (listedTokenIds[nftContract].length == 0) {
            listedContracts.push(nftContract);
        }
        listedTokenIds[nftContract].push(tokenId);

        emit NFTListed(nftContract, tokenId, pricePerDay, maxDuration);
    }

    function rentNFT(address nftContract, uint256 tokenId, uint256 duration) 
        external 
        payable 
        nonReentrant 
    {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.isActive, "NFT not listed for rent");
        require(duration <= listing.maxDuration, "Duration exceeds maximum");
        require(msg.value >= listing.pricePerDay * duration, "Insufficient payment");
        require(currentRenter[nftContract][tokenId] == address(0), "NFT is already rented");

        currentRenter[nftContract][tokenId] = msg.sender;
        rentalEndTime[nftContract][tokenId] = block.timestamp + (duration * 1 days);

        // Transfer payment to owner
        payable(listing.owner).transfer(msg.value);

        emit NFTRented(nftContract, tokenId, msg.sender, duration);
    }

    function unlistNFT(address nftContract, uint256 tokenId) external {
        require(listings[nftContract][tokenId].owner == msg.sender, "Not the owner");
        require(currentRenter[nftContract][tokenId] == address(0), "NFT is currently rented");

        delete listings[nftContract][tokenId];
        emit NFTUnlisted(nftContract, tokenId);
    }

    function endRental(address nftContract, uint256 tokenId) external {
        require(block.timestamp >= rentalEndTime[nftContract][tokenId], "Rental period not ended");
        require(currentRenter[nftContract][tokenId] != address(0), "NFT is not rented");
        
        delete currentRenter[nftContract][tokenId];
        delete rentalEndTime[nftContract][tokenId];

        emit RentalEnded(nftContract, tokenId);
    }

    function getActiveListings() external view returns (address[] memory contracts, uint256[][] memory tokenIds) {
        contracts = new address[](listedContracts.length);
        tokenIds = new uint256[][](listedContracts.length);
        
        for (uint i = 0; i < listedContracts.length; i++) {
            address nftContract = listedContracts[i];
            uint256[] memory contractTokenIds = listedTokenIds[nftContract];
            uint256[] memory activeTokenIds = new uint256[](contractTokenIds.length);
            uint256 activeCount = 0;
            
            for (uint j = 0; j < contractTokenIds.length; j++) {
                uint256 tokenId = contractTokenIds[j];
                if (listings[nftContract][tokenId].isActive && 
                    currentRenter[nftContract][tokenId] == address(0)) {
                    activeTokenIds[activeCount] = tokenId;
                    activeCount++;
                }
            }
            
            // Resize array to actual count
            uint256[] memory finalTokenIds = new uint256[](activeCount);
            for (uint j = 0; j < activeCount; j++) {
                finalTokenIds[j] = activeTokenIds[j];
            }
            
            contracts[i] = nftContract;
            tokenIds[i] = finalTokenIds;
        }
        
        return (contracts, tokenIds);
    }

    function getUserListings(address userAddress) external view returns (address[] memory contracts, uint256[][] memory tokenIds) {
        // Count how many contracts have listings by this user
        uint256 userContractCount = 0;
        for (uint i = 0; i < listedContracts.length; i++) {
            address nftContract = listedContracts[i];
            uint256[] memory contractTokenIds = listedTokenIds[nftContract];
            bool hasUserListings = false;
            
            for (uint j = 0; j < contractTokenIds.length; j++) {
                uint256 tokenId = contractTokenIds[j];
                if (listings[nftContract][tokenId].owner == userAddress && 
                    listings[nftContract][tokenId].isActive) {
                    hasUserListings = true;
                    break;
                }
            }
            
            if (hasUserListings) {
                userContractCount++;
            }
        }
        
        // Initialize arrays with the correct size
        contracts = new address[](userContractCount);
        tokenIds = new uint256[][](userContractCount);
        
        // Fill arrays with user's listings
        uint256 contractIndex = 0;
        for (uint i = 0; i < listedContracts.length; i++) {
            address nftContract = listedContracts[i];
            uint256[] memory contractTokenIds = listedTokenIds[nftContract];
            uint256[] memory userTokenIds = new uint256[](contractTokenIds.length);
            uint256 userTokenCount = 0;
            
            for (uint j = 0; j < contractTokenIds.length; j++) {
                uint256 tokenId = contractTokenIds[j];
                if (listings[nftContract][tokenId].owner == userAddress && 
                    listings[nftContract][tokenId].isActive) {
                    userTokenIds[userTokenCount] = tokenId;
                    userTokenCount++;
                }
            }
            
            if (userTokenCount > 0) {
                // Resize array to actual count
                uint256[] memory finalTokenIds = new uint256[](userTokenCount);
                for (uint j = 0; j < userTokenCount; j++) {
                    finalTokenIds[j] = userTokenIds[j];
                }
                
                contracts[contractIndex] = nftContract;
                tokenIds[contractIndex] = finalTokenIds;
                contractIndex++;
            }
        }
        
        return (contracts, tokenIds);
    }

    function getRentalInfo(address nftContract, uint256 tokenId) 
        external 
        view 
        returns (
            address owner,
            uint256 pricePerDay,
            uint256 maxDuration,
            bool isActive,
            address renter,
            uint256 endTime
        ) 
    {
        Listing memory listing = listings[nftContract][tokenId];
        return (
            listing.owner,
            listing.pricePerDay,
            listing.maxDuration,
            listing.isActive,
            currentRenter[nftContract][tokenId],
            rentalEndTime[nftContract][tokenId]
        );
    }

    function isAvailableForRent(address nftContract, uint256 tokenId) public view returns (bool) {
        return listings[nftContract][tokenId].isActive && 
               currentRenter[nftContract][tokenId] == address(0);
    }
}