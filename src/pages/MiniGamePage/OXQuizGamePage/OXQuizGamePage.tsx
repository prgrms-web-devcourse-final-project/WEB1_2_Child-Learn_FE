import { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import useOXQuizStore from './store/useOXQuizStore';

// 난이도 매핑 함수
const mapDifficulty = (paramDifficulty: 'begin' | 'mid' | 'adv'): 'EASY' | 'MEDIUM' | 'HARD' => {
  switch (paramDifficulty) {
    case 'begin':
      return 'EASY';
    case 'mid':
      return 'MEDIUM';
    case 'adv':
      return 'HARD';
    default:
      throw new Error(`Invalid difficulty parameter: ${paramDifficulty}`);
  }
};

const OXQuizGamePage = () => {
  const { difficulty } = useParams<{ difficulty: 'begin' | 'mid' | 'adv' }>();
  const { oxQuizzes, currentIndex, fetchQuizzes, submitAnswer, result, loading } = useOXQuizStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (difficulty) {
      const mappedDifficulty = mapDifficulty(difficulty); // 매핑된 난이도
      fetchQuizzes(mappedDifficulty); // 난이도에 따라 퀴즈 가져오기
    }
  }, [difficulty, fetchQuizzes]);

  const currentQuiz = oxQuizzes[currentIndex];

  const handleAnswer = async (userAnswer: 'O' | 'X') => {
    if (currentQuiz) {
      await submitAnswer(currentQuiz.oxQuizDataId, userAnswer);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= oxQuizzes.length) {
      navigate(`/ox-quiz/result/${difficulty}`); // 결과 페이지로 이동
    }
  };

  if (!currentQuiz) return <p>퀴즈가 없습니다.</p>;

  return (
    <PageContainer>
      <ProgressBar>
        {oxQuizzes.map((_, index) => (
          <ProgressStep key={index} active={index <= currentIndex} />
        ))}
      </ProgressBar>
      <QuestionContainer>
        <Question>{currentQuiz.question}</Question>
      </QuestionContainer>
      {result === null ? (
        <ButtonContainer>
          <AnswerButton onClick={() => handleAnswer('O')}>O</AnswerButton>
          <AnswerButton onClick={() => handleAnswer('X')}>X</AnswerButton>
        </ButtonContainer>
      ) : (
        <ResultContainer>
          <ResultEmoji>{result.isCorrect ? '😃' : '😢'}</ResultEmoji>
          <ResultText>{result.isCorrect ? '정답' : '오답'}</ResultText>
          <Explanation>{result.explanation}</Explanation>
          <NextButton onClick={handleNextQuestion}>다음 문제 넘어가기</NextButton>
        </ResultContainer>
      )}
    </PageContainer>
  );
};

export default OXQuizGamePage;

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  height: 100vh;
  background-color: #f5f5f5;
`;

const ProgressBar = styled.div`
  display: flex;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
`;

const ProgressStep = styled.div<{ active: boolean }>`
  flex: 1;
  height: 8px;
  margin: 0 5px;
  background-color: ${(props) => (props.active ? '#50b498' : '#ddd')};
  border-radius: 4px;
`;

const QuestionContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 20px 0;
`;

const Question = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 400px;
`;

const AnswerButton = styled.button`
  flex: 1;
  padding: 20px;
  margin: 0 10px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  background-color: #50b498;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #3d937b;
  }
`;

const ResultContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ResultEmoji = styled.div`
  font-size: 64px;
  margin-bottom: 10px;
`;

const ResultText = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const Explanation = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
`;

const NextButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #50b498;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #3d937b;
  }
`;