import { useState } from "react";
import BorrowModal from "./BorrowModal";

const NFT = ({ nft, setApproved }) => {
  const [showModal, setShowModal] = useState(false);
  const { image, collection, name, price } = nft;

  return (
    <>
      <div className="nft">
        <img src={image} alt="nft" />
        <div className="collection">{collection}</div>
        <div className="name">{name}</div>
        <button className="btn" onClick={() => (price === "Request Whitelist" ? false : setShowModal(true))}>
          {price}
        </button>
      </div>

      {showModal && <BorrowModal setShowModal={setShowModal} setApproved={setApproved} />}
    </>
  );
};

export default NFT;
