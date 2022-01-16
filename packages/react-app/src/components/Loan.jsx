import { useState, useEffect } from "react";

const Loan = ({ loan }) => {
  const { image, collection, name, time, seconds, price, color } = loan;
  const [secondsLeft, setSecondsLeft] = useState(seconds);

  useEffect(() => {
    setTimeout(() => {
      if (secondsLeft === 1) {
        setSecondsLeft(59);
      } else {
        setSecondsLeft(secondsLeft - 1);
      }
    }, 1000);
  }, [secondsLeft]);

  return (
    <div className="loan">
      <img className="loan-img" src={image} alt="loan" />
      <div className="loan-wrapper">
        <div className="loan-container">
          <div className="loan-description">
            <div className="loan-collection">{collection}</div>
            <div className="loan-name loan-text--bold">{name}</div>
          </div>
          <button className="btn">Pay Back</button>
        </div>

        <hr className="loan-hr" />

        <div className="loan-info">
          <div className="loan-info">
            <div className="loan-row">
              <span className="loan-text">Pay back:</span>
              <span className="loan-text loan-text--bold">{price}</span>
            </div>
            <div className="loan-row">
              <span className="loan-text">Time left:</span>
              <span className="loan-text loan-text--bold" style={{ color }}>
                {time}, {secondsLeft} sec
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loan;
