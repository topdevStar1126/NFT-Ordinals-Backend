export interface Account {
    chainId: string;
    addressHash: string;
    tokenList: Array<Balance>;
}
export interface Balance {
    balance: string;
    contractAddress: string;
    decimals: string;
    name: string;
    symbol: string;
    type: string;
}
