import styled from 'styled-components';

interface UserPointsProps {
  coins: number;
  points: number;
}

const UserPoints = ({ coins = 0, points = 0 }: UserPointsProps) => {
  return (
    <PointsContainer>
      <PointCard>
        <CardContent>
          <IconWrapper>
            <PointIcon src="/icons/coins 1.png" alt="포인트" />
          </IconWrapper>
          <TextContainer>
            <PointValue>{(points || 0).toLocaleString()}</PointValue>
            <PointLabel>Point</PointLabel>
          </TextContainer>
        </CardContent>
      </PointCard>
      <PointCard>
        <CardContent>
          <IconWrapper>
            <PointIcon src="/img/coins.png" alt="코인" />
          </IconWrapper>
          <TextContainer>
            <PointValue>{(coins || 0).toLocaleString()}</PointValue>
            <PointLabel>Coin</PointLabel>
          </TextContainer>
        </CardContent>
      </PointCard>
    </PointsContainer>
  );
};

const PointsContainer = styled.div`
  display: flex;
  justify-content: center; // 가운데 정렬
  gap: 16px;
  margin-top: 32px;
  width: 100%; // 전체 너비 사용
`;

const PointCard = styled.div`
  width: 150px; // 고정된 너비
  height: 70px; // 고정된 높이
  background: white;
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const IconWrapper = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PointIcon = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // 텍스트 가운데 정렬
  gap: 1px;
  flex: 1; // 남은 공간 모두 차지
  text-align: center; // 텍스트 가운데 정렬
`;

const PointValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #181818;
  text-align: center; // 텍스트 가운데 정렬
  width: 100%; // 전체 너비 사용
`;

const PointLabel = styled.span`
  font-size: 14px;
  color: #666;
  text-align: center; // 텍스트 가운데 정렬
  width: 100%; // 전체 너비 사용
`;

export default UserPoints;
