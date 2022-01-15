pragma solidity 0.8.11;
//SPDX-License-Identifier: MIT

// import "@openzeppelin/contracts/access/Ownable.sol";
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

  struct LoanPosition {
    IERC721 collection;
    uint tokenId;
    uint loanDate;
  }

  uint totalSupplied;
  uint currentlyLendedAmount;
  uint totalRepaid;
  uint nbOfLoans;
  mapping(address => uint) suppliedBy;
  mapping(uint => address) borrowedBy;
  mapping(uint => LoanPosition) loanPosition;

  constructor(
    uint startDate,
    uint _expirationDate,
    uint deathDate,
    IERC20 usdc,
    uint borrowSPR,
    IERC721[] memory collections,
    uint[] memory _assetPrices
  ) {
    START_DATE = startDate;
    EXPIRATION_DATE = _expirationDate;
    DEATH_DATE = deathDate;
    USDC = usdc;
    BORROW_SPR = borrowSPR;
    for(uint i; i < collections.length; i++){
      assetPrice[collections[i]] = _assetPrices[i];
    }
  }

  /// @notice supplies USDC to the pool before its start date
  /// @dev contract must have `amount` allowed for spending 
  function supply(uint amount) public {
    require(block.timestamp < START_DATE);

    USDC.transferFrom(msg.sender, address(this), amount);
    suppliedBy[msg.sender] += amount;
  }

  /// @notice borrows USDC by providing a NFT as collateral
  /// @dev contract must be allowed to spend the asset
  function borrow(IERC721 collection, uint tokenId) public {
    // collection must be whitelisted
    require(assetPrice[collection] > 0);

    IERC721(collection).transferFrom(msg.sender, address(this), tokenId);
    loanPosition[nbOfLoans] = LoanPosition({
      collection: collection,
      tokenId: tokenId,
      loanDate: block.timestamp
    });
    borrowedBy[nbOfLoans] = msg.sender;
    nbOfLoans++;
    // USDC.transfer(msg.sender, assetPrice[collection] * (EXPIRATION_DATE - block.timestamp) * );
  }

}
