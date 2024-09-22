import {
  Area,
  XAxis,
  YAxis,
  AreaChart,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import Card from './Card';
import { PartialStockResultData, Symbols } from '../lib/types';
import {
  convertDateToTimestamp,
  convertTimestampToDate,
} from '../lib/formatHelper';
import { useEffect, useMemo, useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type ChartProps = {
  priceData: PartialStockResultData[];
  symbols: Symbols;
};

type ChartData = {
  aSymbol?: string;
  bSymbol?: string;
  aClosePrice?: number;
  bClosePrice?: number;
  date: string;
};

function groupData(data: PartialStockResultData[]) {
  const groupData = data.reduce(
    (
      acc: Record<number, PartialStockResultData[]>,
      item: PartialStockResultData
    ) => {
      const { timestamp } = item;

      if (!acc[item.timestamp]) {
        acc[timestamp] = [];
      }
      acc[timestamp].push(item);
      return acc;
    },
    {} as Record<number, PartialStockResultData[]>
  );

  return groupData;
}

export function Chart({ priceData, symbols }: ChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  console.log('priceData', priceData, symbols);
  //TODO: Import symbol choice
  const [toggleSymbol, setToggleSymbol] = useState<string | null>(null);

  const dataLength = useMemo(() => priceData.length, [priceData]);

  const formatData = (data: PartialStockResultData[]) => {
    const groupedData = groupData(data);

    const combinedData = Object.values(groupedData).reduce((acc, group) => {
      const aSymbolEntry = group.find(
        (item) => item.ticker === symbols.aSymbol
      );
      const bSymbolEntry = group.find(
        (item) => item.ticker === symbols.bSymbol
      );

      // Allow nulls in case an API problem for one of the symbols
      if (aSymbolEntry || bSymbolEntry) {
        acc.push({
          aSymbol: aSymbolEntry?.ticker ?? 'Unknown',
          bSymbol: bSymbolEntry?.ticker ?? 'Unknown',
          aClosePrice: aSymbolEntry?.closePrice ?? null,
          bClosePrice: bSymbolEntry?.closePrice ?? null,
          date: convertTimestampToDate(
            aSymbolEntry?.timestamp ?? bSymbolEntry?.timestamp
          ),
        });
      }
      return acc;
    }, [] as ChartData[]);

    return combinedData;
  };

  useEffect(() => {
    //TODO: To implement later
    // const getDateRange = () => {
    //   const mockStartDate = new Date('2024-05-10');
    //   const mockeEndDate = new Date('2024-05-20');
    //   const startTimestamp = convertDateToTimestamp(mockStartDate);
    //   const endTimestamp = convertDateToTimestamp(mockeEndDate);
    //   return { startTimestamp, endTimestamp };
    // };

    const updateChartData = async () => {
      try {
        // const { startTimestamp, endTimestamp } = getDateRange();
        setData(formatData(priceData));
      } catch (error) {
        setData([]);
        console.log(error);
      }
    };

    updateChartData();
  }, [priceData]);

  return (
    <Card>
      <ToggleGroup
        type='single'
        value={toggleSymbol}
        onValueChange={(value) => {
          setToggleSymbol(value);
        }}
      >
        <ToggleGroupItem value={symbols.aSymbol}>
          {symbols.aSymbol}
        </ToggleGroupItem>
        <ToggleGroupItem value={symbols.bSymbol}>
          {symbols.bSymbol}
        </ToggleGroupItem>
      </ToggleGroup>
      <AreaChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
            <stop
              offset='95%'
              stopColor='#8884d8'
              stopOpacity={toggleSymbol === symbols.aSymbol ? 0.6 : 0.1}
            />
          </linearGradient>
          <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#82ca9d' stopOpacity={0.8} />
            <stop
              offset='95%'
              stopColor='#82ca9d'
              stopOpacity={toggleSymbol === symbols.bSymbol ? 0.6 : 0.1}
            />
          </linearGradient>
        </defs>
        <XAxis dataKey='date' />
        <YAxis />
        <CartesianGrid strokeDasharray='3 3' />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type='monotone'
          dataKey='aClosePrice'
          stroke='#8884d8'
          fillOpacity={1}
          fill='url(#colorUv)'
        />
        <Area
          type='monotone'
          dataKey='bClosePrice'
          stroke='#82ca9d'
          fillOpacity={1}
          fill='url(#colorPv)'
        />
        <XAxis dataKey='date' />
        <YAxis domain={['dataMin', 'dataMax']} />
      </AreaChart>
    </Card>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { aClosePrice, bClosePrice, aSymbol, bSymbol, date } =
      payload[0].payload;
    return (
      <div
        className='custom-tooltip'
        style={{
          background: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
        }}
      >
        <p>{`Date: ${date}`}</p>
        <p className='text-[#8884d8]'>{`${aSymbol} Close Price: ${aClosePrice}`}</p>
        <p className='text-[#82ca9d]'>{`${bSymbol} Close Price: ${bClosePrice}`}</p>
      </div>
    );
  }

  return null;
};
