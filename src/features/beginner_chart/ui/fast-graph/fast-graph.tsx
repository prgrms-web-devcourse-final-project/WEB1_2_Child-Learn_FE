// fast-graph.tsx
import React from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';

interface GraphData {
  value: number;
  date: string;
}

interface FastGraphProps {
  data: GraphData[];
  onChartClick: () => void;
}

const GraphContainer = styled.div`
  width: 100%;
  background: white;
  padding: 5px;
  margin-bottom: 20px;
`;

const GraphHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const GraphTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
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

export const FastGraph: React.FC<FastGraphProps> = ({ data, onChartClick }) => {
  const [selectedDay, setSelectedDay] = React.useState('Last 7 days');
  const days = data.map(item => item.date);
  const today = new Date().getDay();
  const adjustedToday = Math.floor(days.length / 2); // 중간 인덱스를 오늘로 설정
  const selectedDayIndex = days.indexOf(selectedDay);

  const handleDaySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(event.target.value);
  };

  const series = [
    {
      name: '요일',
      type: 'bar',
      data: data.map(item => item.value),
    },
    {
      name: '이동평균',
      type: 'line',
      data: data.map(item => item.value),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
      events: {
        click: function() {
          onChartClick();
        },
        dataPointSelection: function() {
          onChartClick();
        }
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        borderRadius: 8,
        borderRadiusApplication: 'end',
      },
    },
    stroke: {
      width: [0, 2],
      curve: 'straight',
      colors: ['transparent', '#f4a261'],
    },
    markers: {
      size: [0, 0],
      colors: ['transparent', '#f4a261'],
      strokeColors: ['transparent', '#f4a261'],
      strokeWidth: 2,
    },
    xaxis: {
      categories: days,
      labels: {
        style: {
          colors: '#666',
          fontSize: '14px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 600,
      tickAmount: 6,
      labels: {
        style: {
          colors: '#666',
          fontSize: '12px',
        },
      },
    },
    grid: {
      borderColor: '#f1f1f1',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    colors: [
      (context: { dataPointIndex: number }) => {
        if (
          selectedDay !== 'Last 7 days' &&
          context.dataPointIndex === selectedDayIndex
        ) {
          return '#2e68a2';
        }
        if (
          context.dataPointIndex === adjustedToday &&
          selectedDay === 'Last 7 days'
        ) {
          return '#8ec3f8';
        }
        return '#FFE5D3';
      },
      '#f4a261',
    ],
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
  };

  return (
    <GraphContainer>
      <GraphHeader>
        <GraphTitle>
          <StaminaIndicator>
            {selectedDay === 'Last 7 days' ? '요일' : `${selectedDay}요일`}
          </StaminaIndicator>
        </GraphTitle>
        <Select value={selectedDay} onChange={handleDaySelect}>
          <option value="Last 7 days">요일선택</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}요일
            </option>
          ))}
        </Select>
      </GraphHeader>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
        width="100%"
      />
    </GraphContainer>
  );
};