'use client';
import { useEffect, useState } from 'react';
import Pusher, { Channel } from 'pusher-js';
import pusherClient from '../lib/pusher';
import {
  PartialStockApiResponse,
  PartialStockResultData,
  PartialStockResult,
  StockResultData,
  Symbols,
} from '../lib/types';
import { Chart } from './Charts';
import PriceForm from './PriceForm';

type PriceUpdateData = {
  symbol: string;
  priceData: PartialStockApiResponse;
  timestamp: string;
};

function createData(apiResponse: PartialStockApiResponse): StockResultData[] {
  return apiResponse.results.map((result) => ({
    ticker: apiResponse.ticker,
    volume: result.v,
    weightedAvgPrice: result.vw,
    openPrice: result.o,
    closePrice: result.c,
    highPrice: result.h,
    lowPrice: result.l,
    timestamp: result.t,
    trades: result.n,
  }));
}

export function RealTimeUpdates() {
  const [priceUpdates, setPriceUpdates] = useState<StockResultData[]>([]);
  const [priceUpdatesBSymbol, setPriceUpdatesBSymbol] = useState<
    PartialStockResultData[]
  >([]);
  const [symbols, setSymbols] = useState<Symbols>({
    aSymbol: '',
    bSymbol: '',
  });

  useEffect(() => {
    const channelASymbol: Channel = pusherClient.subscribe(
      'prices-channel-aSymbol'
    );
    const channelBSymbol: Channel = pusherClient.subscribe(
      'prices-channel-bSymbol'
    );

    const handleMessage = (data: PriceUpdateData) => {
      data.priceData.results.forEach((result: PartialStockResult) => {
        console.log(
          `Price: Open ${result.o ?? 'N/A'}, Close ${result.c ?? 'N/A'}`
        );
      });

      setSymbols((prevState) => {
        return {
          aSymbol: data.priceData.ticker,
          bSymbol: prevState.bSymbol,
        };
      });

      if (data.priceData.results.length > 0) {
        const tickerData = createData(data.priceData);

        setPriceUpdates(tickerData);
      }
    };

    const handleMessageBSymbol = (data: PriceUpdateData) => {
      console.log('BSymbole data:', data);
      data.priceData.results.forEach((result: PartialStockResult) => {
        console.log(
          `Price: Open ${result.o ?? 'N/A'}, Close ${result.c ?? 'N/A'}`
        );
      });
      setSymbols((prevState) => {
        return {
          aSymbol: prevState.aSymbol,
          bSymbol: data.priceData.ticker,
        };
      });
      if (data.priceData.results.length > 0) {
        const tickerData = createData(data.priceData);

        setPriceUpdatesBSymbol(tickerData);
      }
    };

    channelASymbol.bind('price-update', handleMessage);
    channelBSymbol.bind('price-update', handleMessageBSymbol);

    return () => {
      channelASymbol.bind('price-update', handleMessage);
      channelBSymbol.bind('price-update', handleMessageBSymbol);
      pusherClient.unsubscribe('prices-channel-aSymbol');
      pusherClient.unsubscribe('prices-channel-bSymbol');
    };
  }, []);

  return (
    <div className='flex flex-col gap-4 items-center justify-betweem text-center space-y-4'>
      <div>
        <h1>Real-time updates Mock</h1>
        <PriceForm />
        <Chart
          symbols={symbols}
          priceData={[...priceUpdates, ...priceUpdatesBSymbol]}
        />
      </div>
    </div>
  );
}
