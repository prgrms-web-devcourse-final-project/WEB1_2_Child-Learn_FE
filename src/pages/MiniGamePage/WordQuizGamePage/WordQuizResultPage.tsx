import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useWordQuizStore } from '../../../features/minigame/wordquizgame/model/wordQuizStore';

const WordQuizResultPage = () => {
  const navigate = useNavigate();
  const { correctAnswers, resetQuiz } = useWordQuizStore();

  // 별의 개수 계산 (최대 별 3개)
  const stars = Math.min(correctAnswers, 3); // 최대 별 3개

  const handleNavigate = () => {
    resetQuiz(); // 퀴즈 상태 초기화
    navigate('/minigame'); // 미니게임 페이지로 이동
  };

  return (
    <Container>
      <CheckImage/>
      <StarsContainer>
        {Array.from({ length: stars }).map((_, index) => (
          <Star key={index} src="/public/img/star.png" alt="Star" />
        ))}
      </StarsContainer>
      <PointsText>총 {correctAnswers * 100} Points를 획득하셨습니다!</PointsText>
      <NavigateButton onClick={handleNavigate}>
        미니게임 페이지로 이동하기
      </NavigateButton>
    </Container>
  );
};

export default WordQuizResultPage;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background-color: #f5f5f5;
  padding-top: 200px; /* 상단 여백 추가 */
`;

const CheckImage = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
`;

const StarsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Star = styled.img`
  width: 52px;
  height: 52px;
  margin: 0 5px;
`;

const PointsText = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #666;
  margin-bottom: 20px;
`;

const NavigateButton = styled.button`
  padding: 10px 20px;
  background-color: #50b498;
  color: white;
  border: none;
  border-radius: 100px;
  width: 302px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #3d937b;
  }
`;
