import React from 'react';
import ReactApexChart from 'react-apexcharts';

interface StockChartProps {
  stockId: number;
  title: string;
  data: {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
  isSelected: boolean;
  onClick: () => void;
}

export const StockChart: React.FC<StockChartProps> = ({ title, data, isSelected, onClick }) => {
  const options = {
    chart: {
      type: 'candlestick' as const,
      height: 350,
      toolbar: { show: false }
    },
    title: {
      text: title,
      align: 'center' as const
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  };

  const series = [{
    data: data.map(item => ({
      x: new Date(item.timestamp),
      y: [item.open, item.high, item.low, item.close]
    }))
  }];

  return (
    <div onClick={onClick} style={{ border: isSelected ? '2px solid #007bff' : 'none' }}>
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={350}
      />
    </div>
  );
};