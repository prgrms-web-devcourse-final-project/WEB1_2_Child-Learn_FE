// ui/fast-graph/fast-graph.tsx
import React from 'react';
import styled from 'styled-components';
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';


interface GraphData {
  value: number;
  date: string;
}

interface FastGraphProps {
  data: GraphData[];
}

export const FastGraph: React.FC<FastGraphProps> = ({ data }) => {
  const navigate = useNavigate();
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  const [selectedDay, setSelectedDay] = React.useState('Last 7 days');
  const selectedDayIndex = days.indexOf(selectedDay);

  const handleDaySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(event.target.value);
  };

  const series = [
    {
      name: '요일',
      type: 'bar',
      data: days.map((day) => {
        const dayData = data.find((item) => item.date === day);
        return dayData?.value || 0;
      }),
    },
    {
      name: '이동평균',
      type: 'line',
      data: days.map((day) => {
        const dayData = data.find((item) => item.date === day);
        return dayData?.value || 0;
      }),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
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
          return '#2e68a2'; // 선택된 요일
        }
        if (
          context.dataPointIndex === adjustedToday &&
          selectedDay === 'Last 7 days'
        ) {
          return '#8ec3f8'; // 오늘
        }
        return '#FFE5D3'; // 기본 색상
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

  const GraphContainer = styled.div`
  width: 355px;
  background: white;
  padding: 5;
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

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 100%;
`;

const ExitButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
  }
`;

const Points = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  padding: 10px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  img {
    width: 20px;
    height: 20px;
  }

  span {
    color: #666;
    font-size: 14px;
  }
`;

// 새로운 Header 컨테이너 추가
const HeaderWrapper = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 10px;
`;

const OutButton = styled.button`
 background: none;
 border: none;
 cursor: pointer;
 padding: 0;
 z-index: 10;
 
 img {
   width: 22px;
   height: 22px;
 }
`;

const StyledPointBadge = styled.div<{ points: number }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  font-size: 14px;
`;

  return (
    <GraphContainer>
      <HeaderWrapper>
        
   <OutButton onClick={() => navigate('/main')}>
     <img src="/img/out.png" alt="나가기" />
   </OutButton>
   <StyledPointBadge points={2000} />
 </HeaderWrapper>
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
        width={350}
      />
    </GraphContainer>
  );


  
};
