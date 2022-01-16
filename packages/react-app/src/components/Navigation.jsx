import React from "react";

const Navigation = ({ tab, setTab, connected, approved }) => (
  <nav role="navigation" className={`nav ${connected ? "nav--connected" : ""}`}>
    <button onClick={() => setTab("whitelisted")} className={`navBtn ${tab === "whitelisted" ? "active" : ""}`}>
      Whitelisted
    </button>
    <button onClick={() => setTab("other")} className={`navBtn ${tab === "other" ? "active" : ""}`}>
      Other NFTs
    </button>
    <button
      onClick={() => setTab("loans")}
      className={`navBtn ${tab === "loans" ? "active" : ""} ${approved ? "approved" : ""}`}
    >
      Loans
    </button>
    <button onClick={() => setTab("liquidity")} className={`navBtn ${tab === "liquidity" ? "active" : ""}`}>
      Provide Liquidity
    </button>
  </nav>
);

export default Navigation;
