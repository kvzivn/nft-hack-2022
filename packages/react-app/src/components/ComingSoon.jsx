import React, { useEffect, useRef } from "react";

const ComingSoon = () => {
  const headingRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      headingRef.current.style.opacity = 1;
    }, 200);
  }, [headingRef]);

  return (
    <h1 className="coming-soon" ref={headingRef}>
      Coming soon!
    </h1>
  );
};

export default ComingSoon;
