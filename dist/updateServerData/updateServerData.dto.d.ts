export interface Brc20Token {
    slug: string;
    tokenInscriptionId: string;
    protocolType: string;
    totalSupply: Number;
    mintAmount: Number;
    deployTime: Number;
    holder: Number;
    transactionCount: Number;
    circulatingSupply: Number;
    mintBitwork: string;
    limitPerMint: Number;
    runesSymbol: string;
    tokenContractAddress: string;
    lastPrice: Number;
    maxSupply: Number;
    volume24h: Number;
    marketCap: Number;
    high24h: Number;
    token: string;
    precision: Number;
    deployAddress: string;
    txId: string;
    deployHeight: Number;
    low25h: Number;
    state: string;
    tokenType: string;
    msg: string;
    BTCPrice: Number;
    priceAbnormal: [];
    inscriptionId: string;
    inscriptionNumber: Number;
    mintRate: Number;
    logoUrl: string;
    floorPrice: Number;
    inscriptionNumRange: string;
    isBrc20: Boolean;
    totalVolume: Number;
    oneDayRate: Number;
    sevenDaysRate: Number;
    thirtyDaysRate: Number;
}
export declare class ServerData {
    brc20Tokens: Brc20Token[];
}
