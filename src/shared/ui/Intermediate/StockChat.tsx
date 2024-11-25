import React, { useState, useEffect } from 'react';
import { StockPrice } from '@/features/Intermediate_chat/types/stock';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';



interface StockChartProps {
  stockId: number;
  title: string;
  data?: StockPrice[];
}

export const StockChart: React.FC<StockChartProps> = ({ stockId, title, data = [] }) => {
  const [chartData, setChartData] = useState({
    series: [{
      data: data.map(item => ({
        x: new Date(item.priceDate).getTime(),
        y: [
          item.avgPrice,  // 시가 (open)
          item.highPrice, // 고가 (high)
          item.lowPrice,  // 저가 (low)
          item.avgPrice   // 종가 (close)
        ]
      })).reverse()
    }],
    options: {
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
            return new Date(val).toLocaleDateString('ko-KR', {
              month: 'numeric',
              day: 'numeric'
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
        opposite: false,  // Y축을 오른쪽으로
        tooltip: {
          enabled: false
        },
        labels: {
          formatter: (value) => `${value.toLocaleString()}원`,
          style: {
            colors: '#999',
            fontSize: '12px'
          }
        }
      },
      grid: {
        show: false,
        borderColor: '#f0f0f0',
        strokeDashArray: 1,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        }
      },
      tooltip: {
        enabled: false
      }
    } as ApexOptions
  });


  useEffect(() => {
    if (data.length > 0) {
      const formattedData = data.map((item, index) => {
        // 이전 종가와 현재 종가를 비교하여 상승/하락 결정
        const prevClose = index > 0 ? data[index - 1].avgPrice : item.avgPrice;
        const currentClose = item.avgPrice;
        
        return {
          x: new Date(item.priceDate).getTime(),
          y: [
            prevClose,        // 시가 (이전 종가)
            item.highPrice,   // 고가
            item.lowPrice,    // 저가
            currentClose      // 종가 (현재 평균가)
          ]
        };
      }).reverse();

      console.log('Formatted chart data:', formattedData);

      setChartData(prev => ({
        ...prev,
        series: [{
          data: formattedData
        }]
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

const ChartWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
`;

export default StockChart;