import React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const GraphContainer = styled.div`
  width: 390px;
  background: white;
  padding: 20px;
  margin-bottom: 16px;
`;

const GraphHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const GraphTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StaminaIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background-color: #f4a261;
    border-radius: 50%;
  }
`;

const Select = styled.select`
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  outline: none;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    border-color: #ccc;
  }
`;

interface GraphData {
  value: number;
  date: string;
}

interface FastGraphProps {
  data: GraphData[];
}

export const FastGraph: React.FC<FastGraphProps> = ({ data }) => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  const [selectedDay, setSelectedDay] = React.useState('Last 7 days');

  const handleDaySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(event.target.value);
  };

  const selectedDayIndex = days.indexOf(selectedDay);

  const series = [
    {
      name: '요일',
      type: 'column',
      data: days.map(day => {
        const dayData = data.find(item => item.date === day);
        return dayData?.value || 0;
      })
    },
    {
      name: '이동평균',
      type: 'line',
      data: days.map(day => {
        const dayData = data.find(item => item.date === day);
        return dayData?.value || 0;
      })
    }
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      width: 350,
      toolbar: {
        show: false
      },
      background: '#ffffff',
      zoom: {
        enabled: false
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          if (selectedDay === 'Last 7 days') {
            const selectedIndex = config.dataPointIndex;
            const selectedDayValue = days[selectedIndex];
            setSelectedDay(selectedDayValue);
          }
        }
      }
    },
    colors: ['#FFE5D3', '#2f2e2e'],
    plotOptions: {
      bar: {
        columnWidth: '30%',
        borderRadius: 5,
        borderRadiusApplication: 'end'
      }
    },
    stroke: {
      width: [0, 1.5],
      curve: 'straight',
      colors: ['transparent', '#f4a261']
    },
    markers: {
      size: [0, 6],
      colors: ['transparent', '#ffffff'],
      strokeColors: ['transparent', '#f4a261'],
      strokeWidth: 2,
    },
    xaxis: {
      categories: days,
      labels: {
        style: {
          colors: '#666',
          fontSize: '14px',
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      tooltip: {
        enabled: false
      },
      crosshairs: {
        show: false
      }
    },
    yaxis: {
      opposite: true,
      min: 0,
      max: 600,
      tickAmount: 6,
      labels: {
        style: {
          colors: '#666',
          fontSize: '12px'
        },
        formatter: (value) => value.toFixed(0),
        offsetX: -10,
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    grid: {
      borderColor: '#f1f1f1',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        right: 20
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    tooltip: {
      enabled: true
    },
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
        }
      },
    },
    fill: {
      opacity: 1,
      colors: [(context: { dataPointIndex: number }) => {
        if (selectedDay !== 'Last 7 days' && context.dataPointIndex === selectedDayIndex) {
          return '#8ec3f8';
        }
        if (context.dataPointIndex === adjustedToday && selectedDay === 'Last 7 days') {
          return '#8ec3f8';
        }
        return '#FFE5D3';
      }, 'transparent']
    }
  };

  return (
    <GraphContainer>
      <GraphHeader>
        <GraphTitle>
          <StaminaIndicator>요일</StaminaIndicator>
        </GraphTitle>
        <Select value={selectedDay} onChange={handleDaySelect}>
          <option value="Last 7 days">Last 7 days</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}요일
            </option>
          ))}
        </Select>
      </GraphHeader>
      <Chart
        options={options}
        series={series}
        type="line"
        height={350}
        width={350}
      />
    </GraphContainer>
  );
};