const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MiseOSBrigade', function () {
  it('mints only when open with exact payment', async function () {
    const [, collector] = await ethers.getSigners();
    const price = ethers.parseEther('0.001');
    const Factory = await ethers.getContractFactory('MiseOSBrigade');
    const contract = await Factory.deploy(112, price, 'ipfs://metadata/');
    await contract.setMintingOpen(true);

    await expect(contract.connect(collector).mint({ value: price }))
      .to.emit(contract, 'Transfer')
      .withArgs(ethers.ZeroAddress, collector.address, 1);

    expect(await contract.ownerOf(1)).to.equal(collector.address);
    expect(await contract.tokenURI(1)).to.equal('ipfs://metadata/1.json');
  });

  it('rejects an incorrect payment', async function () {
    const [, collector] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory('MiseOSBrigade');
    const contract = await Factory.deploy(112, 1n, 'ipfs://metadata/');
    await contract.setMintingOpen(true);
    await expect(contract.connect(collector).mint({ value: 0n }))
      .to.be.revertedWithCustomError(contract, 'IncorrectPayment');
  });
});
