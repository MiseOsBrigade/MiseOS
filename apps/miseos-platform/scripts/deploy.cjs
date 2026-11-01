const { ethers } = require('hardhat');

async function main() {
  const maxSupply = BigInt(process.env.MAX_SUPPLY || '112');
  const mintPrice = ethers.parseEther(process.env.MINT_PRICE_ETH || '0');
  const baseMetadataURI = process.env.BASE_METADATA_URI;

  if (!baseMetadataURI) {
    throw new Error('BASE_METADATA_URI is required and should end with a slash.');
  }

  const Factory = await ethers.getContractFactory('MiseOSBrigade');
  const contract = await Factory.deploy(maxSupply, mintPrice, baseMetadataURI);
  await contract.waitForDeployment();

  console.log(JSON.stringify({
    network: (await ethers.provider.getNetwork()).name,
    address: await contract.getAddress(),
    maxSupply: maxSupply.toString(),
    mintPriceWei: mintPrice.toString(),
    baseMetadataURI
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
