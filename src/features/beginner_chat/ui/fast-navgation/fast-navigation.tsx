import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const Card = styled.div`
  background: #F5F5F5;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
`;

const ExitButton = styled.div`
  cursor: pointer;
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
  padding: 8px 12px;
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

const GraphCard = styled(Card)`
  background: #ffffff;
  padding: 16px;
`;

const GraphImage = styled.img`
  width: 100%;
  height: auto;
`;

const NewsCard = styled(Card)`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
`;

const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const NewsTitle = styled.h3<{ left?: string }>`
  font-size: 16px;
  color: #000000;
  margin: 0;
  ${props => props.left && `left: ${props.left};`}
`;

const NewsDate = styled.div`
  font-size: 12px;
  color: #000000;
`;

const NewsContent = styled.p`
  font-size: 14px;
  color: #000000;
  margin: 16px 0;
`;

const AnswerButton = styled.button<{ variant: 'O' | 'X' }>`
  width: 100%;
  padding: 12px 16px;
  margin: 8px 0;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.variant === 'O' ? '#ffffff' : '#ffffff'};
  color: #000000;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '${props => props.variant}';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #edecec;
    color: ${props => props.variant === 'O' ? '#4A90E2' : '#E25C5C'};
    font-weight: bold;
  }
`;

const StartButton = styled.button`
  width: 120px;
  padding: 12px;
  background-color: #82C8BB;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin: 20px auto;
  display: block;
  text-align: center;

  &:hover {
    background-color: #6db3a6;
  }
`;

const GraphExplanationPage = () => {
  const navigate = useNavigate();
  
  const handleStartClick = () => {
    navigate('/quiz');
  };

  return (
    <Container>
      <Overlay />
      
      {/* 포인트 표시 화살표 */}
      <ArrowWithText top="2px" left="20px" transform="rotate(0deg) scaleX(-1)">
        <img src="/img/arrow.png" alt="arrow" />
        <span style={{ transform: 'scaleX(-1)' }}>주기적으로 적립되는 포인트를 그래프로 표현했어요</span>
      </ArrowWithText>

       {/* 포인트 표시 화살표 */}
       <ArrowWithText top="70px" left="100px" transform="rotate(0deg) scaleX(-1)">
        <img src="/img/arrow.png" alt="arrow" />
        <span style={{ transform: 'scaleX(-1)' }}>요일을 선택할 수 있어요</span>
      </ArrowWithText>

      {/* 그래프 설명 화살표 */}
      <ArrowWithText top="200px" left="150px">
        <img src="/img/arrow.png" alt="arrow" />
        <span>주제별 달성도를 한눈에 확인하세요</span>
      </ArrowWithText>

      {/* Child-Learn News 화살표 */}
      <ArrowWithText top="430px" left="40px">
        <img src="/img/arrow.png" alt="arrow" />
        <span>오늘의 학습 문제를 풀어보세요</span>
      </ArrowWithText>

      {/* Chid-Learn Newls 화살표 */}
     <ArrowWithText top="330px" left="100px">
        <img src="/img/arrow.png" alt="arrow" />
        <span>요일을 알 수 있어요</span>
      </ArrowWithText> 

       {/* Chid-Learn Newls 화살표 */}
     <ArrowWithText top="247px" left="70px">
        <img src="/img/arrow.png" alt="arrow" />
        <span>크기를 확인할 수 있어요</span>
      </ArrowWithText> 

      

      <TopBar>
        <ExitButton onClick={() => navigate(-1)}>
          <img src="/img/out.png" alt="exit" />
        </ExitButton>
        <Points>
          <img src="/img/coins.png" alt="points" />
          <span>2,000 P</span>
        </Points>
      </TopBar>

      <GraphCard>
        <GraphImage src="/img/graph1.png" alt="초급 그래프" />
      </GraphCard>

      <NewsCard>
        <NewsHeader>
          <NewsTitle>Child-Learn News</NewsTitle>
          <NewsDate>2024.11.21</NewsDate>
        </NewsHeader>
        <NewsContent>
          If you want to save money, what's the best thing to do with your allowance?
        </NewsContent>
        <AnswerButton variant="O">
          Spend it all right away
        </AnswerButton>
        <AnswerButton variant="X">
          Save your of it and spend the rest
        </AnswerButton>
      </NewsCard>

      <StartButton onClick={handleStartClick}>
        시작하기
      </StartButton>
    </Container>
  );
};

export default GraphExplanationPage;