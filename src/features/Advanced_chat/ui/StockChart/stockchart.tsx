// src/features/Advanced_chat/ui/StockChart/stockchart.tsx

import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { ChartContainer } from './styled';

interface StockPrice {
  timestamp: string;
  price: string;
  open: string;
  high: string;
  low: string;
  close: string;
  change: number;
  volume: number;
}

interface StockChartProps {
  stockId: number;
  title: string;
  data: StockPrice[];
  isSelected: boolean;
  onClick: () => void;
  isPlaying: boolean;
}

export const StockChart: React.FC<StockChartProps> = ({
  title,
  data,
  isSelected,
  onClick,
  isPlaying
}) => {
  console.log(`Chart data for ${title}:`, {
    rawData: data,
    processedData: data.map(item => ({
      x: new Date(item.timestamp).getTime(),
      y: [
        parseFloat(item.open),
        parseFloat(item.high),
        parseFloat(item.low),
        parseFloat(item.close)
      ]
    }))
  });

  const options: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
      animations: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    title: {
      text: title,
      align: 'center'
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        format: 'HH:mm:ss'
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        formatter: (value) => `${Math.round(value).toLocaleString()}원`
      },
      forceNiceScale: true
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#FF0000',
          downward: '#0000FF'
        }
      }
    },
    tooltip: {
      enabled: true,
      x: {
        format: 'HH:mm:ss'
      }
    }
  };

  const series = [{
    name: title,
    data: data.map(item => ({
      x: new Date(item.timestamp).getTime(),
      y: [
        parseFloat(item.open),
        parseFloat(item.high),
        parseFloat(item.low),
        parseFloat(item.close)
      ]
    }))
  }];

  return (
    <ChartContainer $isSelected={isSelected} onClick={onClick}>
      {data.length > 0 ? (
        <ReactApexChart
          options={options}
          series={series}
          type="candlestick"
          height={350}
        />
      ) : (
        <div style={{ 
          height: 350, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          데이터 로딩 중...
        </div>
      )}
    </ChartContainer>
  );
};