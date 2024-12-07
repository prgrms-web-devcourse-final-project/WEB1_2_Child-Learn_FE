import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface ExchangeCardProps {
  points: number; // 획득한 포인트 수
}

export const ExchangeCard = ({ points }: ExchangeCardProps) => {
  const navigate = useNavigate();

  const handleExchangeClick = () => {
    navigate('/exchange');
  };

  return (
    <CardContainer>
      <Content>
        <PointsInfo>
          <MainText>오늘 미니게임으로</MainText>
          <SubText>획득한 포인트</SubText>
          <Points>{points} Points</Points>
        </PointsInfo>
        <ExchangeButton onClick={handleExchangeClick}>환전하러 가기</ExchangeButton>
      </Content>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background-color: #4fae94; // 메인 배경색
  border-radius: 16px; // 둥근 모서리
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); // 그림자
  position: relative;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PointsInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MainText = styled.div`
  font-size: 14px;
  color: white;
  font-weight: 500;
`;

const SubText = styled.div`
  font-size: 16px;
  color: white;
  font-weight: 700;
`;

const Points = styled.div`
  font-size: 28px;
  color: white;
  font-weight: bold;
`;

const ExchangeButton = styled.button`
  position: absolute;
  right: 16px; // 가로 기준 오른쪽 여백
  top: 50%; // 세로 기준 중앙
  transform: translateY(-50%); // 세로 기준 정확히 중앙 정렬
  background-color: white;
  color: #468585;
  border: none;
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:hover {
    opacity: 0.9;
  }
`;
