// shared/ui/StockChart/index.tsx
import React, { useState, useEffect } from 'react';
import { StockPrice } from '@/features/Intermediate_chat/types/stock';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const ChartWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
`;

interface StockChartProps {
  stockId: number;
  title: string;
  data?: StockPrice[];
}

export const StockChart: React.FC<StockChartProps> = ({ stockId: _stockId, title, data = [] }) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        data: data.map((item) => ({
          x: new Date(item.priceDate).getTime(),
          y: [item.avgPrice, item.highPrice, item.lowPrice, item.avgPrice],
        })),
      },
    ],
    options: {
      chart: {
        type: 'candlestick',
        height: 350,
        background: 'white',
        toolbar: {
          show: false,
        },
      },
      title: {
        text: title,
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: '500',
          color: '#333',
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#1B63AB',
            downward: '#D75442',
          },
          wick: {
            show: true, // 심지를 명확히 표시
          },
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'MM/dd',
          style: {
            colors: '#999',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => `${value.toLocaleString()}원`,
          style: {
            colors: '#999',
            fontSize: '12px',
          },
        },
      },
      grid: {
        show: true,
        borderColor: '#e0e0e0',
        strokeDashArray: 4,
      },
    } as ApexOptions,
  });
  
  useEffect(() => {
    if (data.length > 0) {
      setChartData((prev) => ({
        ...prev,
        series: [
          {
            data: data.map((item) => ({
              x: new Date(item.priceDate).getTime(),
              y: [item.avgPrice, item.highPrice, item.lowPrice, item.avgPrice],
            })),
          },
        ],
      }));
    }
  }, [data]);

  return (
    <ChartWrapper>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="candlestick"
        height={350}
      />
    </ChartWrapper>
  );
};

export default StockChart;