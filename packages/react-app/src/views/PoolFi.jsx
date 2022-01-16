import React, { useState } from "react";
import Logo from "../images/logo.png";
import Whitelisted from "../components/Whitelisted";
import OtherNFTs from "../components/OtherNFTs";
import Loans from "../components/Loans";
import ComingSoon from "../components/ComingSoon";
import Navigation from "../components/Navigation";

import "../helpers/pattern.min.css";

const PoolFi = () => {
  const [connected, setConnected] = useState(false);
  const [approved, setApproved] = useState(false);
  const [tab, setTab] = useState(null);

  const TABS = {
    whitelisted: <Whitelisted approved={approved} setApproved={setApproved} />,
    other: <OtherNFTs />,
    loans: <Loans approved={approved} />,
    liquidity: <ComingSoon />,
  };

  const handleConnect = () => {
    setTimeout(() => {
      setConnected(true);
    }, 500);

    setTimeout(() => {
      setTab("whitelisted");
    }, 750);
  };

  return (
    <div className="wrapper">
      <header>
        <img src={Logo} className="logo" alt="logo" />

        {connected && (
          <div className="wallet">
            <div className="wallet-address">keni.eth</div>
            <div className="wallet-balance">
              <span>{approved ? "642.02" : "0.02"}</span> USDC
            </div>
          </div>
        )}
      </header>
      <Navigation tab={tab} setTab={setTab} connected={connected} approved={approved} />
      <main className={`container ${connected ? "container--connected" : ""}`}>{TABS[tab]}</main>
      {!connected && (
        <div className="hero">
          <h2 className="hero-heading">WELCOME TO</h2>

          <div class="hero-text">
            <h1 class="hero-pool">
              POOL<span>FI</span>
            </h1>
          </div>

          <h4 className="hero-subHeading">Instant loans on (almost) any NFT collection</h4>
          <div className="connect">
            <button className="btn connect-btn" onClick={() => handleConnect()}>
              {connected ? "keni.eth" : "Connect Wallet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolFi;
