import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import styled from 'styled-components';

interface StockPrice {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface StockChartProps {
  stockId: number;
  title: string;
  data: StockPrice[];
  isSelected?: boolean;
  onClick?: () => void;
}

export const StockChart: React.FC<StockChartProps> = ({
  title,
  data,
  isSelected,
  onClick
}) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      animations: {
        enabled: false
      }
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: '500',
        color: '#333'
      }
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#D75442',    // 상승 빨간색
          downward: '#1B63AB'   // 하락 파란색
        },
        wick: {
          useFillColor: true
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function(val) {
          return new Date(val).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
          });
        },
        style: {
          colors: '#999',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      tooltip: {
        enabled: false
      },
      labels: {
        formatter: (value) => `${value.toLocaleString()}`,
        style: {
          colors: '#999',
          fontSize: '12px'
        }
      }
    },
    grid: {
      show: false
    }
  };

  const series = [{
    data: data.map(item => ({
      x: new Date(item.timestamp).getTime(),
      y: [item.open, item.high, item.low, item.close]
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

const ChartContainer = styled.div<{ $isSelected?: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: ${props => props.$isSelected 
    ? '0 0 0 2px #fdfdfd, 0 4px 12px rgba(0, 0, 0, 0.1)'
    : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  transition: all 0.1s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;