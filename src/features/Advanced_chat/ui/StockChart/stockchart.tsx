// src/features/Advanced_chat/ui/StockChart/stockchart.tsx

import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { ChartContainer } from './styled';

interface StockChartProps {
  stockId: number;
  title: string;
  data: any[];
  isSelected: boolean;
  onClick: () => void;
}

export const StockChart: React.FC<StockChartProps> = ({
  title,
  data,
  isSelected,
  onClick
}) => {
  console.log(`Chart data for ${title}:`, data);
  const chartOptions: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
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
        format: 'HH:mm'
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toLocaleString('ko-KR')
      },
      tooltip: {
        enabled: false
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#FF0000',
          downward: '#0000FF'
        }
      }
    }
  };

  const series = [{
    data: data.map(item => ({
      x: new Date(item.timestamp).getTime(),
      y: [
        Number(item.openPrice),
        Number(item.highPrice),
        Number(item.lowPrice),
        Number(item.closePrice)
      ]
    }))
  }];

  return (
    <ChartContainer $isSelected={isSelected} onClick={onClick}>
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="candlestick"
        height={350}
      />
    </ChartContainer>
  );
};