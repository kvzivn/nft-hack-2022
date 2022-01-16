// deploy/00_deploy_your_contract.js

const poolpiJson = require("../artifacts/contracts/Poolpi.sol/Poolpi.json")
const secret = require("./secret.json")
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

const { ethers } = require("hardhat");
rpcUrl = "https://matic-mumbai.chainstacklabs.com"
let wallet = new ethers.Wallet(secret.privateKey)
wallet = wallet.connect(new ethers.providers.JsonRpcProvider(rpcUrl))
let poolpiFactory = new ethers.ContractFactory(poolpiJson.abi, poolpiJson.bytecode, wallet)
let startTimestamp = 1642323600 // 16/01/22 10:00:00 CET
const RAY = BigNumber.from(10).pow(27)
const poolpi = await poolpiFactory.deploy(
  startTimestamp,
  startTimestamp + 100_000,
  startTimestamp + 200_000,
  usdc.address,
  RAY.div(100_000).div(10), // 10% interest to pay
  ["0xCD89EeBE6d5FD988Fe1c4CFE596c5bE7431F7d74"],
  [BigNumber.from(10).pow(6).mul(10)]); // 10 usdc price)
console.log(poolpi.address);

