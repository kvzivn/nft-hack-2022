const { BigNumber } = require("ethers");
const RAY = BigNumber.from(10).pow(27)

// ipfs://QmPMc4tcBsMqLRuCQtPmPe84bpSjrC3Ky7t3JWuHXYB4aS

module.exports = [
    1642323600,
    1642323600 + 100_000, // 1642423600
    1642323600 + 200_000, // 1642523600
  "0xe11a86849d99f524cac3e7a0ec1241828e332c62",
  RAY.div(100_000).div(10), // 10% interest to pay
  [nft.address],
  [BigNumber.from(10).pow(18).mul(10)]
]

// 10 wad [10000000000000000000]
// [0xCD89EeBE6d5FD988Fe1c4CFE596c5bE7431F7d74] nft

// 0xd6fbac0c93f2845131f4b9BFd5537A5DF01ecfFb