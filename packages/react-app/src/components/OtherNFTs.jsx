import React, { useRef, useEffect } from "react";
import NFT from "./NFT";
import nft1 from "../images/nft1.jpeg";
import nft2 from "../images/nft2.jpeg";
import nft3 from "../images/nft4.jpeg";

const nfts = [
  {
    image: nft1,
    collection: "Alpha Girl Club",
    name: "Alpha Girl #67",
    price: "Request Whitelist",
  },
  {
    image: nft2,
    collection: "Gutter Cats",
    name: "Gutter Cat #7642",
    price: "Request Whitelist",
  },
  {
    image: nft3,
    collection: "Cool Dogs",
    name: "Cool Dog #395",
    price: "Request Whitelist",
  },
];

const OtherNFTs = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      containerRef.current.style.opacity = 1;
    }, 200);
  }, [containerRef]);

  return (
    <div className="nfts" ref={containerRef}>
      {nfts.map(nft => (
        <NFT nft={nft} key={nft.name} />
      ))}
    </div>
  );
};

export default OtherNFTs;
