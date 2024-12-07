import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { OXQuiz } from './store/useOXQuizStore';
import useOXQuizStore from './store/useOXQuizStore';
import { useUserStore } from '../../../app/providers/state/zustand/userStore';

const OXQuizGamePage = () => {
  const { difficulty } = useParams<{ difficulty: 'begin' | 'mid' | 'adv' }>(); // level 파라미터
  const { oxQuizzes, submitAnswer, fetchInitialQuizzes } = useOXQuizStore();
  const { addPoints } = useUserStore();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);

  const currentQuiz = oxQuizzes[currentQuestionIndex];

  // 레벨별 퀴즈 3개를 초기화
  useEffect(() => {
    if (difficulty) {
      // level에 따라 퀴즈 데이터를 준비합니다.
      const quizzesForLevel: OXQuiz[] = [
        {
          id: 1,
          content: `이것은 ${difficulty} 레벨의 질문 1입니다.`,
          isCorrect: null,
          priority: 'HIGH',
          difficulty,
        },
        {
          id: 2,
          content: `이것은 ${difficulty} 레벨의 질문 2입니다.`,
          isCorrect: null,
          priority: 'LOW',
          difficulty,
        },
        {
          id: 3,
          content: `이것은 ${difficulty} 레벨의 질문 3입니다.`,
          isCorrect: null,
          priority: 'HIGH',
          difficulty,
        },
      ];

      // 초기화
      fetchInitialQuizzes(quizzesForLevel);
    }
  }, [difficulty, fetchInitialQuizzes]);

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentQuiz) return;

    submitAnswer(currentQuiz.id, isCorrect);
    setShowResult(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      addPoints(10); // 정답 시 포인트 추가
    }
  };

  const handleNextQuestion = () => {
    setShowResult(null);

    if (currentQuestionIndex + 1 < 3) {
      // 3개의 문제까지만 진행
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      navigate(`/ox-quiz/result/${difficulty}`); // 모든 문제를 다 풀었을 때 결과 페이지로 이동
    }
  };

  return (
    <PageContainer>
      <ProgressBar>
        {oxQuizzes.map((_, index) => (
          <ProgressStep key={index} active={index <= currentQuestionIndex} />
        ))}
      </ProgressBar>
      <QuestionContainer>
        <Question>{currentQuiz.content}</Question>
      </QuestionContainer>
      {showResult === null ? (
        <ButtonContainer>
          <AnswerButton onClick={() => handleAnswer(true)}>O</AnswerButton>
          <AnswerButton onClick={() => handleAnswer(false)}>X</AnswerButton>
        </ButtonContainer>
      ) : showResult === 'correct' ? (
        <ResultContainer>
          <ResultEmoji>😃</ResultEmoji>
          <ResultText>정답</ResultText>
          <Explanation>{currentQuiz.content}에 대한 설명입니다.</Explanation>
          <NextButton onClick={handleNextQuestion}>다음 문제 넘어가기</NextButton>
        </ResultContainer>
      ) : (
        <ResultContainer>
          <ResultEmoji>😢</ResultEmoji>
          <ResultText>오답</ResultText>
          <Explanation>{currentQuiz.content}에 대한 설명입니다.</Explanation>
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