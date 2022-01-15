const hre = require("hardhat")
const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("Poolpi", async function () {
  let usdc
  let nft
  let plp
  let accounts
  let acc2
  let accAddress
  let accAddress2
  let startTimestamp = Math.floor(Date.now() / 1000) + 1000
  const RAY = BigNumber.from(10).pow(27)

  before(async function () {
    accounts = await ethers.getSigners()
    accAddress = await accounts[0].getAddress()
    accAddress2 = await accounts[1].getAddress()
    acc2 = accounts[1]
  })

  beforeEach(async function () {
    startTimestamp += 604800 * 10

    const NFT = await ethers.getContractFactory("MockNFT");
    nft = await NFT.deploy();
    await nft.deployed();
    
    const USDC = await ethers.getContractFactory("MockUSDC");
    usdc = await USDC.deploy(BigNumber.from(10).pow(6).mul(1000));
    await usdc.deployed();
    
    const PLP = await ethers.getContractFactory("Poolpi");
    plp = await PLP.deploy(
      startTimestamp,
      startTimestamp + 100_000,
      startTimestamp + 200_000,
      usdc.address,
      RAY.div(100_000).div(10), // 10% interest to pay
      [nft.address],
      [BigNumber.from(10).pow(6).mul(10)]); // 10 usdc price
    await plp.deployed();
  });

  it("Should supply 100 usdc & withdraw with no interest", async function () {
    const amount = BigNumber.from(10).pow(6).mul(100)
    const balanceBefore = await usdc.balanceOf(accAddress)
    await usdc.approve(plp.address, amount)
    await plp.supply(amount)
    const balanceAfter = await usdc.balanceOf(accAddress)
    expect(balanceAfter).to.equal(balanceBefore.sub(amount))
    const balanceContract = await usdc.balanceOf(plp.address)
    expect(balanceContract).to.equal(amount)
    await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp + 300_000]);
    await plp.withdraw()
    const balanceEnd = await usdc.balanceOf(accAddress)
    expect(balanceEnd).to.equal(balanceBefore)
  });

  it("Should borrow 9 usdc with 1 nft", async function () {
    const amount = BigNumber.from(10).pow(6).mul(100)
    const price = BigNumber.from(10).pow(6).mul(10)
    await usdc.approve(plp.address, amount)
    await plp.supply(amount)
    await nft.connect(acc2).mint()
    await nft.connect(acc2).approve(plp.address, 1)
    await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp]);
    await plp.connect(acc2).borrow(nft.address, 1)
    const borrowerBalance = await usdc.balanceOf(accAddress2)
    expect(borrowerBalance).to.equal(price.div(10).mul(9))
    const nftBorrowerBalance = await nft.balanceOf(accAddress2)
    expect(nftBorrowerBalance).to.equal(BigNumber.from(0))
    const nftContractBalance = await nft.balanceOf(plp.address)
    expect(nftContractBalance).to.equal(BigNumber.from(1))
  });

  it("Should repay 9.45 usdc & get nft back", async function () {
    const amount = BigNumber.from(10).pow(6).mul(100)
    const price = BigNumber.from(10).pow(6).mul(10)
    await usdc.approve(plp.address, amount)
    await usdc.transfer(accAddress2, price.mul(2)) // borrower has 20 usdc
    await plp.supply(amount.div(2))
    await nft.connect(acc2).mint()
    await nft.connect(acc2).approve(plp.address, 1)
    await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp]);
    await plp.connect(acc2).borrow(nft.address, 1) // borrower has 29 usdc
    await usdc.connect(acc2).approve(plp.address, price.div(100).mul(95))
    await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp + 50_000]);
    await plp.connect(acc2).repay(0) // borrower has 19.55 usdc
    const borrowerBalance = await usdc.balanceOf(accAddress2)
    expect(borrowerBalance).to.equal(price.div(1000).mul(1955))
    const nftBorrowerBalance = await nft.balanceOf(accAddress2)
    expect(nftBorrowerBalance).to.equal(BigNumber.from(1))
    const nftContractBalance = await nft.balanceOf(plp.address)
    expect(nftContractBalance).to.equal(BigNumber.from(0))
  });

  it("Should withdraw investment + 0.45 usdc", async function () {
    const amount = BigNumber.from(10).pow(6).mul(100)
    const price = BigNumber.from(10).pow(6).mul(10)
    await usdc.transfer(usdc.address, amount.mul(9)) // supplier has 100 usdc
    await usdc.approve(plp.address, amount)
    await usdc.transfer(accAddress2, price.mul(2)) // supplier has 80 usdc
    await plp.supply(amount.div(2)) // supplier has 30 usdc
    await nft.connect(acc2).mint()
    await nft.connect(acc2).approve(plp.address, 1)
    await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp]);
    await plp.connect(acc2).borrow(nft.address, 1)
    await usdc.connect(acc2).approve(plp.address, price.div(100).mul(95))
    await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp + 50_000]);
    await plp.connect(acc2).repay(0)
    await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp + 200_000]);
    await plp.withdraw() // supplier has 80.45 usdc
    const contractBalance = await usdc.balanceOf(plp.address)
    expect(contractBalance).to.equal(BigNumber.from(0))
    const balanceAfter = await usdc.balanceOf(accAddress)
    expect(balanceAfter).to.equal(BigNumber.from(10).pow(4).mul(8045))
  });

  it("Should buy nft for 150% of its price", async function () {
    const amount = BigNumber.from(10).pow(6).mul(100)
    const price = BigNumber.from(10).pow(6).mul(10)
    await usdc.transfer(usdc.address, amount.mul(9)) // supplier has 100 usdc
    await usdc.approve(plp.address, amount)
    await usdc.transfer(accAddress2, price.mul(2)) // supplier has 80 usdc
    await plp.supply(amount.div(2)) // supplier has 30 usdc
    await nft.connect(acc2).mint()
    await nft.connect(acc2).approve(plp.address, 1)
    await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp]);
    await plp.connect(acc2).borrow(nft.address, 1)
    await usdc.connect(acc2).approve(plp.address, price.div(100).mul(95))
    await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp + 150_000]); // middle of sell period
    await plp.connect(acc2).buy(0)
    await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp + 201_000]); // after death date
    await plp.withdraw() // supplier has 80.45 usdc
    const contractBalance = await usdc.balanceOf(plp.address)
    expect(contractBalance).to.equal(BigNumber.from(0))
    const balanceAfter = await usdc.balanceOf(accAddress)
    expect(balanceAfter).to.equal(BigNumber.from(10).pow(6).mul(80).sub(price.div(10).mul(9)).add(price.mul(3).div(4)))
  });

  // it("Should share gains according to proportion supplied", async function () {
  //   const amount = BigNumber.from(10).pow(6).mul(100)
  //   const price = BigNumber.from(10).pow(6).mul(10)
  //   await usdc.transfer(usdc.address, amount.mul(9)) // supplier has 100 usdc
  //   await usdc.approve(plp.address, amount)
  //   await usdc.transfer(accAddress2, price.mul(2)) // supplier has 80 usdc
  //   await plp.supply(amount.div(2)) // supplier has 30 usdc
  //   await nft.connect(acc2).mint()
  //   await nft.connect(acc2).approve(plp.address, 1)
  //   await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp]);
  //   await plp.connect(acc2).borrow(nft.address, 1)
  //   await usdc.connect(acc2).approve(plp.address, price.div(100).mul(95))
  //   await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp + 150_000]); // middle of sell period
  //   await plp.connect(acc2).buy(0)
  //   await hre.network.provider.send('evm_setNextBlockTimestamp', [startTimestamp + 201_000]); // after death date
  //   await plp.withdraw() // supplier has 80.45 usdc
  //   const contractBalance = await usdc.balanceOf(plp.address)
  //   expect(contractBalance).to.equal(BigNumber.from(0))
  //   const balanceAfter = await usdc.balanceOf(accAddress)
  //   expect(balanceAfter).to.equal(BigNumber.from(10).pow(6).mul(80).sub(price.div(10).mul(9)).add(price.mul(3).div(4)))
  // });
});
