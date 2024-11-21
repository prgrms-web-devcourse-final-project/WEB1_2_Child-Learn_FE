import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
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

const NewsTitle = styled.h3`
  font-size: 16px;
  color: #333;
  margin: 0;
`;

const NewsDate = styled.div`
  font-size: 12px;
  color: #666;
`;

const NewsContent = styled.p`
  font-size: 14px;
  color: #333;
  margin: 16px 0;
`;

const AnswerButton = styled.button<{ variant: 'O' | 'X' }>`
  width: 100%;
  padding: 12px 16px;
  margin: 8px 0;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.variant === 'O' ? '#4A90E2' : '#E25C5C'};
  color: white;
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
    background: white;
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
          금용 퀴즈에 대한 예시 질문입니다.
        </NewsContent>
        <AnswerButton variant="O">
          정답
        </AnswerButton>
        <AnswerButton variant="X">
          오답
        </AnswerButton>
      </NewsCard>

      <StartButton onClick={handleStartClick}>
        시작하기
      </StartButton>
    </Container>
  );
};

export default GraphExplanationPage;