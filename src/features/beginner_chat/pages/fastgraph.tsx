import React from 'react';
import styled from 'styled-components';

const GraphContainer = styled.div`
  width: 100%;
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

const GraphTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const Select = styled.select`
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  outline: none;
  font-size: 14px;
`;

const Graph = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 160px;
  padding-top: 20px;
`;

const Bar = styled.div<{ height: number; isToday?: boolean }>`
  width: 32px;
  height: ${props => props.height}%;
  background: ${props => props.isToday ? '#FF9B50' : 'rgba(255, 155, 80, 0.3)'};
  border-radius: 8px;
  position: relative;
  transition: height 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background: ${props => props.isToday ? '#FF9B50' : 'rgba(255, 155, 80, 0.8)'};
    border-radius: 50%;
  }
`;

const BarLabel = styled.div`
  text-align: center;
  margin-top: 8px;
  color: #666;
  font-size: 12px;
`;

export const FastGraph: React.FC = () => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const values = [75, 85, 65, 55, 75, 85, 70];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  return (
    <GraphContainer>
      <GraphHeader>
        <GraphTitle>F.A.S.T Test</GraphTitle>
        <Select>
          <option>Last 7 days</option>
        </Select>
      </GraphHeader>
      <Graph>
        {days.map((day, index) => (
          <div key={day} style={{ textAlign: 'center' }}>
            <Bar 
              height={values[index]} 
              isToday={index === adjustedToday}
            />
            <BarLabel>{day}</BarLabel>
          </div>
        ))}
      </Graph>
    </GraphContainer>
  );
};