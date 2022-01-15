pragma solidity 0.8.11;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title a NFT as collateral lending protocol
/// @author tobou.eth
/// @notice POC of a protocol unlocking medium-sized NFT collections to be used as collateral 
/// for loans in USDC, for NFTHack 2022
contract Poolpi {
  uint256 internal constant RAY = 1e27;

  // config
  uint immutable START_DATE; // date after which borrowing can start
  uint immutable EXPIRATION_DATE; // no repay possible after this date
  uint immutable DEATH_DATE; // suppliers can withdraw their funds after this date
  uint immutable BORROW_SPR; // interest rate per second for borrowers, in ray
  IERC20 immutable USDC;
  mapping(IERC721 => uint) assetPrice;

  struct Loan {
    IERC721 collection;
    uint tokenId;
    uint loanDate;
    address borrowedBy;
  }

  uint totalSupplied;
  uint totalRepaid;
  uint nbOfLoans;
  mapping(address => uint) suppliedBy;
  mapping(uint => Loan) loan;

  constructor(
    uint startDate,
    uint expirationDate,
    uint deathDate,
    IERC20 usdc,
    uint borrowSPR,
    IERC721[] memory collections,
    uint[] memory _assetPrices
  ) {
    require(startDate < expirationDate && expirationDate < deathDate);

    START_DATE = startDate;
    EXPIRATION_DATE = expirationDate;
    DEATH_DATE = deathDate;
    USDC = usdc;
    BORROW_SPR = borrowSPR;
    for(uint i; i < collections.length; i++){
      assetPrice[collections[i]] = _assetPrices[i];
    }
  }

  /// @notice supply USDC to the pool before its start date
  /// @dev contract must have `amount` allowed for spending 
  function supply(uint amount) public {
    require(block.timestamp < START_DATE);

    USDC.transferFrom(msg.sender, address(this), amount);
    suppliedBy[msg.sender] += amount;
    totalSupplied += amount;
  }

  /// @notice borrow USDC by providing a NFT as collateral
  /// @dev contract must be allowed to spend the asset
  function borrow(IERC721 collection, uint tokenId) public {
    // collection must be whitelisted
    require(assetPrice[collection] > 0);
    require(block.timestamp > START_DATE && block.timestamp < EXPIRATION_DATE);

    IERC721(collection).transferFrom(msg.sender, address(this), tokenId);
    loan[nbOfLoans] = Loan({
      collection: collection,
      tokenId: tokenId,
      loanDate: block.timestamp,
      borrowedBy: msg.sender
    });
    nbOfLoans++;
    USDC.transfer(msg.sender, 2 * assetPrice[collection] - calculateInterests(assetPrice[collection], EXPIRATION_DATE - block.timestamp));
  }

  /// @notice repay lended USDC + interests & get back the NFT collateral
  function repay(uint loanId) public {
    require(loan[loanId].borrowedBy == msg.sender);
    require(block.timestamp < EXPIRATION_DATE);

    uint repaid = assetPrice[loan[loanId].collection] + calculateInterests(assetPrice[loan[loanId].collection], block.timestamp - loan[loanId].loanDate);
    USDC.transferFrom(msg.sender, address(this), repaid);
    IERC721(loan[loanId].collection).transferFrom(address(this), msg.sender, loan[loanId].tokenId);
    totalRepaid += repaid;
  }

  /// @notice buy a NFT of a loan that weren't repaid, price determined by a dutch auction
  function buy(uint loanId) public {
    require(block.timestamp > EXPIRATION_DATE);

    uint elapsedTimeSinceAuctionStart = block.timestamp - EXPIRATION_DATE;
    uint auctionDuration = DEATH_DATE - EXPIRATION_DATE;
    // start price is 150% of the predetermined price
    uint startPrice = assetPrice[loan[loanId].collection] * 3 / 2;
    uint priceDiscount = (RAY * startPrice * elapsedTimeSinceAuctionStart / auctionDuration) / RAY;
    uint price = priceDiscount < startPrice ? startPrice - priceDiscount : 0;

    USDC.transferFrom(msg.sender, address(this), price);
    totalRepaid += price;
    IERC721(loan[loanId].collection).transferFrom(address(this), msg.sender, loan[loanId].tokenId);
  }

  /// @notice get all USDC gained during the pool lifetime as a supplier
  function withdraw() public {
    require(block.timestamp > DEATH_DATE);

    USDC.transfer(msg.sender, totalRepaid * (totalSupplied * RAY / suppliedBy[msg.sender]) / RAY);
    suppliedBy[msg.sender] = 0;
  }

  function calculateInterests(uint amount, uint elapsedTime) private view returns(uint) {
    return elapsedTime * BORROW_SPR * amount / RAY;
  }
}
