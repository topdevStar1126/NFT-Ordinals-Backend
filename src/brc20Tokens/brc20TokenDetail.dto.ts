export class Brc20TokenDetailDto {
  chainId: Number;
  symbol: string;
  price: Number;
  tokenAddress: string;
  circulatingSupply: Number;
  maxSupply: Number;
  totalSupply: Number;
  volume24h: Number;
  marketCap: Number;
  priceChangeRate24H: Number;
  priceChange24H: Number;
  decimals: Number;
  tokenStatusList: Array<any>;
}
