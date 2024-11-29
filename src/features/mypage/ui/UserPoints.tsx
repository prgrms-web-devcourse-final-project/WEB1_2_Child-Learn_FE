import styled from 'styled-components';

interface UserPointsProps {
  coins: number;
  points: number;
}

const UserPoints = ({ coins, points }: UserPointsProps) => {
  return (
    <PointsContainer>
      <PointCard>
        <CardContent>
          <IconWrapper>
            <PointIcon src="/icons/coins 1.png" alt="포인트" />
          </IconWrapper>
          <TextContainer>
            <PointValue>{points.toLocaleString()}</PointValue>
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
            <PointValue>{coins.toLocaleString()}</PointValue>
            <PointLabel>Coin</PointLabel>
          </TextContainer>
        </CardContent>
      </PointCard>
    </PointsContainer>
  );
};

const PointsContainer = styled.div`
  display: flex;
  justify-content: flex-start;  // 시작점 기준 정렬
  gap: 16px;
  margin-top: 32px;
  width: fit-content;  // 컨텐츠 크기만큼
  margin: 0 auto;  // 가운데 정렬을 위한 마진
`;

const PointCard = styled.div`
  width: 150px;  // 동일한 너비
  height: 70px;  // 동일한 높이
  background: white;
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  flex: none;
`;

const PointIcon = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
`;

const PointValue = styled.span`
  font-size: 17px;
  font-weight: 600;
  color: #333;
  text-align: center;  // 텍스트 가운데 정렬
`;

const PointLabel = styled.span`
  font-size: 14px;
  color: #666;
  text-align: center;  // 텍스트 가운데 정렬
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;  // 세로 중앙 정렬
  gap: 12px;
  width: 100%;
  height: 100%;  // 높이 100%로 설정
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;  // 이미지 세로 중앙 정렬
  justify-content: center;  // 이미지 가로 중앙 정렬
  flex-shrink: 0;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;  // 텍스트 가운데 정렬
  gap: 4px;
  flex: 1;  // 남은 공간 차지
`;


export default UserPoints;