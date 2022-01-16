import React, { useRef, useEffect } from "react";
import Loan from "./Loan";
import loan2 from "../images/loan2.jpeg";
import loan3 from "../images/loan3.jpeg";

const previousLoan = {
  image: loan2,
  collection: "Cool Dogs",
  name: "Cool Dog #2192",
  time: "0 days, 2 hours, 18 min",
  seconds: 59,
  price: "0.5421 USDC",
  color: "#E22121",
};

const approvedLoan = {
  image: loan3,
  collection: "Lil Pudgys",
  name: "Lil Pudgy #4267",
  time: "16 days, 9 hours, 50 min",
  seconds: 56,
  price: "0.0012 USDC",
  color: "#00CA2C",
};

const Loans = ({ approved }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      containerRef.current.style.opacity = 1;
    }, 200);
  }, [containerRef]);

  return (
    <div className="loans" ref={containerRef}>
      <Loan loan={previousLoan} />
      {approved && <Loan loan={approvedLoan} />}
    </div>
  );
};

export default Loans;
