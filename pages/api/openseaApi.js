import * as Web3 from "web3";
import { OpenSeaPort, Network } from "opensea-js";

const provider = new Web3.providers.HttpProvider("https://mainnet.infura.io");
const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main,
});

const fetchAssets = async (tokenAddress, tokenId) => {
  const asset = await seaport.api.getAsset({
    tokenAddress: tokenAddress, // string
    tokenId: tokenId, // string | number | null
  });
  return asset;
};

export default {
  fetchAssets,
};
