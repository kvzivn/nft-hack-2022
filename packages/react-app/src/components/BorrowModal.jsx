import { useEffect, useState } from "react";
// import abi from "../eth/abi.js";
import { poolfi, nft } from "../eth/mumbai.json" 
import { ethers } from "ethers"
import { useContractFunction } from "@usedapp/core";

const BorrowModal = ({ setShowModal, setBorrowed }) => {
  const [fadeIn, setFadeIn] = useState(false);
  const ABI = [{"inputs":[{"internalType":"uint256","name":"startDate","type":"uint256"},{"internalType":"uint256","name":"expirationDate","type":"uint256"},{"internalType":"uint256","name":"deathDate","type":"uint256"},{"internalType":"contract IERC20","name":"usdc","type":"address"},{"internalType":"uint256","name":"borrowSPR","type":"uint256"},{"internalType":"contract IERC721[]","name":"collections","type":"address[]"},{"internalType":"uint256[]","name":"_assetPrices","type":"uint256[]"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AuctionNotYetStarted","type":"error"},{"inputs":[],"name":"BorrowsAndRepaysAreClosed","type":"error"},{"inputs":[{"internalType":"contract IERC721","name":"collection","type":"address"}],"name":"CollectionNotWhitelisted","type":"error"},{"inputs":[],"name":"LiquidityNotYetUnlocked","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"SenderIsNotTheBorrower","type":"error"},{"inputs":[],"name":"SuppliesAreClosed","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"loanId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Borrowed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"loanId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"Bought","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"loanId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Repaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"supplier","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Supplied","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"supplier","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrew","type":"event"},{"inputs":[],"name":"BORROW_SPR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DEATH_DATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EXPIRATION_DATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"START_DATE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"","type":"address"}],"name":"assetPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC721","name":"collection","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"borrow","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"loanId","type":"uint256"}],"name":"buy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"loan","outputs":[{"internalType":"contract IERC721","name":"collection","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"loanDate","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"borrowedBy","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"loanId","type":"uint256"}],"name":"repay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"supply","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  const poolfiInterface = new ethers.utils.Interface(ABI)
  const poolfiContract = new ethers.Contract(poolfi, poolfiInterface)
  const borrow = useContractFunction(poolfiContract, 'borrow')
  const NFTABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"MAX_PUBLIC_MINT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PRICE_PER_TOKEN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PROVENANCE","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isAllowListActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"numberOfTokens","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint8","name":"numberOfTokens","type":"uint8"}],"name":"mintAllowList","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"numAvailableToMint","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"n","type":"uint256"}],"name":"reserve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleIsActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"addresses","type":"address[]"},{"internalType":"uint8","name":"numAllowedToMint","type":"uint8"}],"name":"setAllowList","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"baseURI_","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_isAllowListActive","type":"bool"}],"name":"setIsAllowListActive","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"provenance","type":"string"}],"name":"setProvenance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"newState","type":"bool"}],"name":"setSaleState","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  const nftInterface = new ethers.utils.Interface(NFTABI)
  const nftContract = new ethers.Contract(nft, nftInterface)
  const approve = useContractFunction(nftContract, 'approve')
  const [accepted, setAccepted] = useState(false)
  let disabled = false

  console.log(setBorrowed);
  console.log(setShowModal);

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 200);
  }, []);

  const getButtonText = () => {
    switch (approve.state.status) {
      case 'None':
        return 'Borrow 642 USDC'
      case 'PendingSignature':
        disabled = true
        return 'Waiting for signature ...'
      case 'Mining':
        disabled = true
        return 'Approving ...'
    }

    if (approve.state.status == "Success") {
      switch (borrow.state.status) {
        case 'None':
          return 'Collateralize & Borrow'
        case 'PendingSignature':
          disabled = true
          return 'Waiting for signature ...'
        case 'Mining':
          disabled = true
          return 'Approving ...'
      }
    }

    if (borrow.state.status == 'Success') {
      return 'View Transaction'
    }

    return 'Error'
  };

  return (
    <div className={`modal-backdrop ${fadeIn ? "fade-in" : ""}`}>
      <div className="modal">
        <div className="modal-container">
          {borrow.state.status == 'Success'? (
            <>
              <div className="modal-text">Lil Pudgy #4267</div>
              <div className="modal-countdown">Success!</div>
            </>
          ) : (
            <>{approve.state.status == 'None' && <>
                <div className="modal-text">Deadline until repayment:</div>
                <div className="modal-countdown">16 days, 9 hours, 12 minutes</div></>
              }
              {approve.state.status != 'None' &&
                <div className="modal-text">{getButtonText()}</div>
              }
            </>
          )}

          <hr className="modal-hr" />

          <div className="modal-info">
            <div className="modal-row">
              <span className="modal-text">You will receive:</span>
              <span className="modal-text modal-text--bold">642 USDC</span>
            </div>
            <div className="modal-row">
              <span className="modal-text">Interest rate:</span>
              <span className="modal-text modal-text--bold">8.62%</span>
            </div>
            <div className="modal-row">
              <span className="modal-text">Maximum repayment:</span>
              <span className="modal-text modal-text--bold">729.59 USDC</span>
            </div>
          </div>

          <button className="modal-close" onClick={() => {
            setBorrowed(true)
            setShowModal(false)}}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20.5 18.4375C21.0625 19.0625 21.0625 20 20.5 20.5625C19.875 21.1875 18.9375 21.1875 18.375 20.5625L11 13.125L3.5625 20.5625C2.9375 21.1875 2 21.1875 1.4375 20.5625C0.8125 20 0.8125 19.0625 1.4375 18.4375L8.875 11L1.4375 3.5625C0.8125 2.9375 0.8125 2 1.4375 1.4375C2 0.8125 2.9375 0.8125 3.5 1.4375L11 8.9375L18.4375 1.5C19 0.875 19.9375 0.875 20.5 1.5C21.125 2.0625 21.125 3 20.5 3.625L13.0625 11L20.5 18.4375Z"
                fill="#141414"
              />
            </svg>
          </button>

          <div className={`modal-tos ${approve.state.status != "None" ? "disabled" : ""}`}>
            <input type="checkbox" id="accept" onChange={e => setAccepted(e.target.checked)} />
            <label for="accept" className="modal-text">
              I have read and agreed on the <u>terms of service</u>
            </label>
          </div>

          <button onClick={() => {
            if(approve.state.status != 'Success'){
              approve.send(poolfi, 1)
            } else {
              borrow.send(nft, 2)
            }
          }} className="btn btn--approve" disabled={disabled}>
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowModal;
