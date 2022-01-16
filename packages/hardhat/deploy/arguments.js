const { BigNumber } = require("ethers");
const RAY = BigNumber.from(10).pow(27)

// ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS

module.exports = [
    1642323600,
    1642323600 + 100_000,
    1642323600 + 200_000,
  "0xe11a86849d99f524cac3e7a0ec1241828e332c62",
  RAY.div(100_000).div(10), // 10% interest to pay
  [nft.address],
  [BigNumber.from(10).pow(18).mul(10)]
]