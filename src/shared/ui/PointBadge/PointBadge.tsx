import styled from 'styled-components';

interface PointBadgeProps {
  points: number;
}

export const PointBadge = ({ points }: PointBadgeProps) => {
  return (
    <Container>
      <PointIcon src="/img/coin.png" alt="포인트" />
      {points.toLocaleString()} P
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #50b498;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`;

const PointIcon = styled.img`
  width: 20px;
  height: 20px;
`;
