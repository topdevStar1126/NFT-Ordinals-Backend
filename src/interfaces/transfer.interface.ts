export interface Transfer {
  chainId: string;
  addressHash: string;
  token: string;
  tokenTransfers: Array<TransferItem>;
}

export interface TransferItem {
  block_hash: string;
  from: any;
  log_index: string;
  method: string;
  timestamp: string;
  to: any;
  token: any;
  total: any;
  tx_hash: string;
  type: string;
}
