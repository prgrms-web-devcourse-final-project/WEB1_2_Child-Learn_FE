import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserInfo } from '@/entities/User/lib/queries';
import useOXQuizStore from './store/useOXQuizStore';

// 난이도 매핑 함수
const mapDifficulty = (paramDifficulty: 'begin' | 'mid' | 'adv'): 'easy' | 'medium' | 'hard' => {
  switch (paramDifficulty) {
    case 'begin':
      return 'easy';
    case 'mid':
      return 'medium';
    case 'adv':
      return 'hard';
    default:
      throw new Error(`Invalid difficulty parameter: ${paramDifficulty}`);
  }
};

const OXQuizGamePage = () => {
  const { difficulty } = useParams<{ difficulty: 'begin' | 'mid' | 'adv' }>();
  const { data: userInfo } = useUserInfo();
  const { oxQuizzes, currentIndex, fetchQuizzes, submitAnswer, result, loading } = useOXQuizStore();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<'O' | 'X' | null>(null); // 선택된 답
  const [isConfirmed, setIsConfirmed] = useState(false); // 선택 완료 상태


  useEffect(() => {
    if (difficulty) {
      const mappedDifficulty = mapDifficulty(difficulty); // 매핑된 난이도
      fetchQuizzes(userInfo.id, mappedDifficulty); // 난이도에 따라 퀴즈 가져오기
    }
  }, [difficulty, fetchQuizzes, userInfo]);

  const currentQuiz = oxQuizzes[currentIndex];

  const handleSelectAnswer = (answer: 'O' | 'X') => {
    setSelectedAnswer(answer);
    setIsConfirmed(false); // 선택 완료 상태 초기화
  };

  const handleConfirmAnswer = async () => {
    if (currentQuiz && selectedAnswer) {
      await submitAnswer(currentQuiz.oxQuizDataId, selectedAnswer);
      setIsConfirmed(true); // 선택 완료
    }
  };

  const handleNextQuestion = () => {
    console.log(`다음 문제로 이동: 현재 문제 번호 ${currentIndex + 1}`);

    if (currentIndex + 1 >= oxQuizzes.length) {
      console.log('결과 페이지로 이동');
      navigate(`/ox-quiz/result/${difficulty}`); // 결과 페이지로 이동
      return;
    } else {
      // 다음 문제로 이동 (currentIndex 증가)
      useOXQuizStore.setState((state) => ({
        currentIndex: state.currentIndex + 1,
        result: null, // 다음 문제로 넘어갈 때 결과 초기화
      }));
      setSelectedAnswer(null); // 선택 상태 초기화
    setIsConfirmed(false); // 선택 완료 초기화

    }
  };

  const handleButtonClick = () => {
    if (!isConfirmed) {
      handleConfirmAnswer(); // 선택 완료
    } else {
      handleNextQuestion(); // 다음 문제로 이동
    }
  };

  if (!currentQuiz) return <p>퀴즈가 없습니다.</p>;
  console.log(`현재 문제: ${currentQuiz.question}, 인덱스: ${currentIndex + 1}`);

  return (
    <PageContainer>
      <Background />
      <ProgressBar>
        {oxQuizzes.map((_, index) => (
          <ProgressStep key={index} active={index <= currentIndex} />
        ))}
      </ProgressBar>
      {!isConfirmed && ( // 선택 완료 전까지만 문제를 보여줌
        <QuestionContainer>
          <Question>{currentQuiz.question}</Question>
        </QuestionContainer>
      )}
      {!isConfirmed ? (
        <ButtonContainer>
          <AnswerButton
            onClick={() => handleSelectAnswer('O')}
            selected={selectedAnswer === 'O'}
          >
            O
          </AnswerButton>
          <AnswerButton
            onClick={() => handleSelectAnswer('X')}
            selected={selectedAnswer === 'X'}
          >
            X
          </AnswerButton>
        </ButtonContainer>
      ) : (
        <ResultContainer>
          <ResultEmoji>{result?.correct ? '😃' : '😢'}</ResultEmoji>
          <ResultText>{result?.correct ? '정답' : '오답'}</ResultText>
          <Explanation>{result?.explanation}</Explanation>
        </ResultContainer>
      )}
      {selectedAnswer && (
        <NextButton onClick={handleButtonClick}>
          {!isConfirmed ? '선택 완료' : '다음 문제 넘어가기'}
        </NextButton>
      )}
    </PageContainer>
  );
};

export default OXQuizGamePage;

// Styled Components
const PageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Background = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 750px;
  background-color: #def9c4;
  z-index: 0;
`;

const ProgressBar = styled.div`
  display: flex;
  width: 100%;
  max-width: 200px;
  margin: 10px 0;
`;

const ProgressStep = styled.div<{ active: boolean }>`
  flex: 1;
  height: 5px;
  margin: 0 5px;
  background-color: ${(props) => (props.active ? '#50b498' : '#ddd')};
  border-radius: 4px;
`;

const QuestionContainer = styled.div`
  flex: 1;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  text-align: center;
  top: 300px;
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
  width: 80%;
  position: absolute; /* 위치 조정을 위해 relative 추가 */
  top: 620px;
  z-index: 1; /* Background보다 위에 위치 */
`;

const AnswerButton = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: 20px;
  margin: 0 5px;
  width: 70px; /* 가로 길이를 제한 */
  height: 120px; /* 세로 길이를 늘림 */
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  background-color: ${(props) => (props.selected ? '#3d937b' : '#50b498')};
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #3d937b;
  }
`;

const ResultContainer = styled.div`
  position: absolute; /* QuestionContainer와 동일한 absolute 사용 */
  top: 300px; /* QuestionContainer와 동일한 top 값 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%; /* 중앙 정렬 보장을 위해 추가 */
  padding: 20px; /* 내용물 간 여유 공간 추가 */
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
  position: absolute; /* 위치를 고정하기 위해 absolute 사용 */
  top: 780px;
  padding: 10px 20px;
  width: 300px;
  font-size: 16px;
  color: #fff;
  background-color: #50b498;
  border: none;
  border-radius: 50px;
  cursor: pointer;

  &:hover {
    background-color: #3d937b;
  }
`;