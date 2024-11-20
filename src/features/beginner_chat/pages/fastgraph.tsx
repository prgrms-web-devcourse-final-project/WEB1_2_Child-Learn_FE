import React, { useState } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ... (이전 styled components 유지)

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
  
  // 선택된 날짜 상태 관리
  const [selectedDay, setSelectedDay] = useState<string>('Last 7 days');

  // 선택된 날짜의 인덱스 계산
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
    },
    colors: ['#FFE5D3', '#2f2e2e'],
    plotOptions: {
      bar: {
        columnWidth: (context: any) => {
          // 선택된 날짜의 막대는 더 넓게 표시
          if (selectedDay !== 'Last 7 days' && context.dataPointIndex === selectedDayIndex) {
            return '20px';
          }
          return '10px';
        },
        borderRadius: 5,
        borderRadiusApplication: 'end'
      }
    },
    // ... (다른 옵션들은 유지)
    fill: {
      opacity: 1,
      colors: [(context: { dataPointIndex: number }) => {
        // 선택된 날짜 또는 오늘 날짜의 막대 색상 변경
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

  const handleDaySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDay(event.target.value);
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