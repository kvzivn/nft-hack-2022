import React, { useRef, useEffect } from "react";
import NFT from "./NFT";
import pudgy1 from "../images/pudgy1.jpeg";
import pudgy2 from "../images/pudgy2.jpeg";

const nfts = [
  {
    image: pudgy1,
    collection: "Lil Pudgys",
    name: "Lil Pudgy #4267",
    price: "Borrow 642 USDC",
  },
  {
    image: pudgy2,
    collection: "Lil Pudgys",
    name: "Lil Pudgy #1810",
    price: "Borrow 642 USDC",
  },
];

const Whitelisted = ({ setApproved }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      containerRef.current.style.opacity = 1;
    }, 200);
  }, [containerRef]);

  return (
    <div className="nfts" ref={containerRef}>
      {nfts.map(nft => (
        <NFT nft={nft} key={nft.name} setApproved={setApproved} />
      ))}
    </div>
  );
};

export default Whitelisted;
