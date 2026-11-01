import { Contract, JsonRpcProvider, getAddress } from 'ethers';

const ERC721_ABI = ['function balanceOf(address owner) view returns (uint256)'];
const ERC1155_ABI = ['function balanceOf(address owner, uint256 id) view returns (uint256)'];

export async function hasRequiredNft({
  rpcUrl,
  contractAddress,
  ownerAddress,
  tokenStandard = 'ERC721',
  tokenId = ''
}) {
  if (!rpcUrl || !contractAddress) return false;

  const provider = new JsonRpcProvider(rpcUrl);
  const owner = getAddress(ownerAddress);

  if (tokenStandard === 'ERC1155') {
    if (tokenId === '') throw new Error('ERC1155 requires NFT_TOKEN_ID');
    const contract = new Contract(contractAddress, ERC1155_ABI, provider);
    return (await contract.balanceOf(owner, tokenId)) > 0n;
  }

  const contract = new Contract(contractAddress, ERC721_ABI, provider);
  return (await contract.balanceOf(owner)) > 0n;
}
