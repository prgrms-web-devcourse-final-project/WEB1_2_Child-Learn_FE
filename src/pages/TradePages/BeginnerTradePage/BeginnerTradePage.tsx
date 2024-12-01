import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { PointBadge } from '@/shared/ui/PointBadge/PointBadge';

const BeginnerTradePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Overlay />
      
      {/* 설명 화살표들 */}
      <ArrowWithText top="20px" left="20px" transform="rotate(0deg) scaleX(-1)">
        <img src="/img/arrow.png" alt="arrow" />
        <span style={{ transform: 'scaleX(-1)' }}>포인트를 확인할 수 있어요</span>
      </ArrowWithText>

      <ArrowWithText top="120px" left="150px">
        <img src="/img/arrow.png" alt="arrow" />
        <span>하루 동안의 가격 변화를 확인할 수 있어요</span>
      </ArrowWithText>

      <ArrowWithText top="250px" left="70px">
        <img src="/img/arrow.png" alt="arrow" />
        <span>매수/매도 버튼을 통해 거래할 수 있어요</span>
      </ArrowWithText>

      <TopBar>
        <ExitButton onClick={() => navigate('/main')}>
          <img src="/img/out.png" alt="exit" />
        </ExitButton>
        <StyledPointBadge points={2000} />
      </TopBar>

      <ContentCard>
        <CardTitle>초급 트레이딩</CardTitle>
        <CardDescription>
          여기서는 기초적인 주식 거래를 연습할 수 있습니다.
          매수와 매도를 통해 포인트를 늘려보세요!
        </CardDescription>
        <TradeImage src="/img/trade_example.png" alt="거래 예시" />
        <TradeExplanation>
          <ExplanationItem>
            <Circle color="#1B63AB">매수</Circle>
            <span>낮은 가격에 구매하세요</span>
          </ExplanationItem>
          <ExplanationItem>
            <Circle color="#D75442">매도</Circle>
            <span>높은 가격에 판매하세요</span>
          </ExplanationItem>
        </TradeExplanation>
      </ContentCard>

      <StartButton onClick={() => navigate('/begin-stocks')}>
        거래 시작하기
      </StartButton>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
  pointer-events: none;
`;

const ArrowWithText = styled.div<{ top: string; left: string; transform?: string }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  z-index: 101;
  display: flex;
  align-items: center;
  gap: 8px;
  transform: ${props => props.transform || 'rotate(0deg)'};
  
  img {
    width: 24px;
    height: 24px;
  }
  
  span {
    color: white;
    font-size: 14px;
    text-align: center;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  margin-bottom: 20px;
`;

const ExitButton = styled.button`
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

const StyledPointBadge = styled(PointBadge)`
  z-index: 10;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const TradeImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const TradeExplanation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ExplanationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #333;
`;

const Circle = styled.div<{ color: string }>`
  width: 48px;
  height: 24px;
  background-color: ${props => props.color};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 500;
`;

const StartButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #82C8BB;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #6db3a6;
  }
`;

export default BeginnerTradePage;