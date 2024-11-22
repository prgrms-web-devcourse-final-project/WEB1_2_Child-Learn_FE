import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { generateStockData } from '../model/stock';
import { ChartWrapper, ChartHeader, ChartTitle, ChartContent } from './index';
import { ChartData } from '../types/stock';

interface StockChartProps {
  stockId: number;
  title?: string;
}

export const StockChart = ({ stockId, title }: StockChartProps) => {
  const [chartData, setChartData] = useState<{
    series: { data: ChartData[] }[];
    options: any;
  }>({
    series: [{ data: [] }],
    options: {
      chart: {
        type: 'candlestick',
        height: 350,
        toolbar: {
          show: false,
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
          }
        }
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#1B63AB',
            downward: '#D75442'
          },
          wick: {
            show: false
          }
        }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MM/dd',
            day: 'MM/dd',
            hour: 'HH:mm'
          }
        }
      },
      yaxis: {
        tooltip: {
          enabled: false
        },
        labels: {
          formatter: (value: number) => `${value.toLocaleString()}원`
        }
      }
    }
  });

  useEffect(() => {
    const mockData = generateStockData(stockId);
    setChartData(prev => ({
      ...prev,
      series: [{
        name: 'Stock Price',
        data: mockData
      }]
    }));
  }, [stockId]);

  return (
    <ChartWrapper>
      <ChartHeader>
        <ChartTitle>{title || '중급 주식 차트'}</ChartTitle>
      </ChartHeader>
      <ChartContent>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="candlestick"
          height={350}
        />
      </ChartContent>
    </ChartWrapper>
  );
};
