import { useState } from "react";
import BorrowModal from "./BorrowModal";

const NFT = ({ nft }) => {
  const [showModal, setShowModal] = useState(false);
  const { image, collection, name, price } = nft;

  return (
    <>
      <div className="nft">
        <img src={image} alt="nft" />
        <div className="collection">{collection}</div>
        <div className="name">{name}</div>
        <button className="btn" onClick={() => setShowModal(true)}>
          {price}
        </button>
      </div>

      {showModal && <BorrowModal setShowModal={setShowModal} />}
    </>
  );
};

export default NFT;
