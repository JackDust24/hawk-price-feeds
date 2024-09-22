export type PriceDataRequest = {
  symbols: [string, string];
  multiplier: number;
  timespan: string;
  from: string;
  to: string;
};

export type PriceFeedRequest = {
  priceInfo: {
    event: string;
    priceData: PriceDataRequest;
  };
};

export type StockResult = {
  v: number; // Volume
  vw: number; // Volume weighted average price
  o: number; // Open price
  c: number; // Close price
  h: number; // High price
  l: number; // Low price
  t: number; // Timestamp
  n: number; // Number of trades
};

export type PartialStockResult = Partial<StockResult>;

export type StockApiResponse = {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: StockResult[];
  status: string;
  request_id: string;
  count: number;
};

export type PartialStockApiResponse = Partial<StockApiResponse>;

export type StockResultData = {
  ticker: string;
  volume: number;
  weightedAvgPrice: number;
  openPrice: number;
  closePrice: number;
  highPrice: number;
  lowPrice: number;
  timestamp: number;
  trades: number;
};

export type PartialStockResultData = Partial<StockResultData>;

export type Symbols = {
  aSymbol: string;
  bSymbol?: string;
};
