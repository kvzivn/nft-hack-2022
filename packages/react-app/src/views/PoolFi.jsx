import React, { useState } from "react";
import Logo from "../images/logo.png";
import Whitelisted from "../components/Whitelisted";
import OtherNFTs from "../components/OtherNFTs";
import Loans from "../components/Loans";
import ComingSoon from "../components/ComingSoon";
import Navigation from "../components/Navigation";
import { useEthers, useLookupAddress } from '@usedapp/core'

const PoolFi = () => {
	const { activateBrowserWallet, account } = useEthers()
  const [tab, setTab] = useState("whitelisted");
  const [borrowed, setBorrowed] = useState(false)
  const ens = useLookupAddress()

  const TABS = {
    whitelisted: <Whitelisted borrowed={borrowed} setBorrowed={setBorrowed} />,
    other: <OtherNFTs />,
    loans: <Loans borrowed={borrowed}/>,
    liquidity: <ComingSoon />,
  };

  console.log(account);

  return (
    <div className="wrapper">
      <header>
        <img src={Logo} className="logo" alt="logo" />
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        {account && (<>
          <div className="wallet">
            <div className="wallet-address">{ens ?? account.substring(0, 6) + '...' + account.substring(account.length - 4, account.length)}</div>
            <div className="wallet-balance">
              {/* todo : fetch usdc balance */}
              <span>{borrowed ? '642.02' : '0.02'}</span> USDC
            </div>
          </div>
          <Navigation tab={tab} setTab={setTab} connected={account != null}/>
          </>
        )}
      </header>
      {account && <main className={`container ${account ? "container--connected" : ""}`}>{TABS[tab]}</main>}
      {!account && (
        <div className="hero">
          <h2 className="hero-heading">WELCOME TO</h2>

          <div class="hero-text">
            <h1 class="hero-pool">
              POOL<span>FI</span>
            </h1>
          </div>

          <h4 className="hero-subHeading">Instant loans on (almost) any NFT collection</h4>
          <div className="connect">
            <button className="btn connect-btn" onClick={() => activateBrowserWallet()}>
              {account ? "keni.eth" : "Connect Wallet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolFi;
