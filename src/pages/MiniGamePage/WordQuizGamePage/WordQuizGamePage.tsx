import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import useWordQuizStore from './store/useWordQuizStore';

const sharedWords = [
  { word: '시장', explanation: '기업의 주식 발행 가격 총액을 뜻하는 단어', hint: '첫 글자는 "시"입니다.' },
  { word: '경제', explanation: '사람들의 재화와 서비스 교환에 대한 활동을 뜻하는 단어', hint: '첫 글자는 "경"입니다.' },
  { word: '투자', explanation: '미래의 이익을 기대하며 자산을 구매하는 활동', hint: '첫 글자는 "투"입니다.' },
];

const WordQuizGamePage = () => {
  const { level } = useParams<{ level: 'beginner' | 'medium' | 'advanced' }>(); // 난이도 동적 경로
  const { incrementCorrectAnswers, decrementLives, resetQuiz, lives } = useWordQuizStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showCorrectPopup, setShowCorrectPopup] = useState(false);
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false);
  const [showFinishPopup, setShowFinishPopup] = useState(false);
  const navigate = useNavigate();

  const alphabet = '가나다라마바사아자차카타파하'; // 예시 글자들
  const correctWord = sharedWords[currentQuestionIndex]?.word;
  const keyboardLetters = useState(() => {
    const uniqueLetters = new Set(correctWord); // 정답 단어에 포함된 글자
    while (uniqueLetters.size < 10) {
      // 정답 단어 포함 글자를 제외한 랜덤한 글자를 추가
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      uniqueLetters.add(randomLetter);
    }
    return Array.from(uniqueLetters);
  })[0];

   // 난이도에 따라 타이머 초기값 설정
   useEffect(() => {
    let initialTime = 60; // 기본값
    if (level === 'medium') initialTime = 40;
    if (level === 'advanced') initialTime = 20;

    setTimeLeft(initialTime);
  }, [level]);
  
   // 타이머 설정
   useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate(`/word-quiz/result/${level}`); // 시간 종료 시 결과 페이지로 이동
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, level]);

  const handleSelectLetter = (letter: string) => {
    if (!correctWord || userAnswer.length >= correctWord.length) return;

    const updatedAnswer = [...userAnswer, letter];
    setUserAnswer(updatedAnswer);

    if (updatedAnswer.join('') === correctWord) {
      incrementCorrectAnswers(); // 전역 상태에서 맞춘 문제 증가
      setShowCorrectPopup(true);
    } else if (updatedAnswer.join('').length === correctWord.length) {
      decrementLives(); // 전역 상태에서 목숨 감소
      setShowIncorrectPopup(true);
    }
  };

   // 정답 시 다음 문제로 이동
   const handleNextQuestion = () => {
    setShowCorrectPopup(false);
    setShowIncorrectPopup(false);
    setUserAnswer([]);

    if (currentQuestionIndex + 1 < sharedWords.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate(`/word-quiz/result/${level}`); // 문제 다 풀면 결과 페이지로 이동
    }
  };

  // 목숨이 소진되었을 때
  useEffect(() => {
    if (lives === 0) {
      navigate(`/word-quiz/result/${level}`); // 목숨이 0일 때 결과 페이지로 이동
    }
  }, [lives, level, navigate]);

  const handleCloseIncorrectPopup = () => {
    setShowIncorrectPopup(false);
    setUserAnswer([]); // 정답 입력칸 초기화
  };

  const handleRestart = () => {
    resetQuiz(); // 전역 상태 초기화
    setCurrentQuestionIndex(0);
    setTimeLeft(60);
    setUserAnswer([]);
  };

  const currentWord = sharedWords[currentQuestionIndex];

  return (
    <PageContainer>
      <Header>
        <LivesContainer>
          {Array.from({ length: 3 }).map((_, index) => (
            <Heart key={index} filled={index < lives} />
          ))}
        </LivesContainer>
        <Timer>⏰ {timeLeft < 10 ? `0${timeLeft}` : timeLeft} </Timer>
      </Header>
      <QuestionContainer>
        <QuestionText>{currentWord?.explanation}</QuestionText>
      </QuestionContainer>
      <AnswerContainer>
        {Array.from({ length: currentWord?.word.length || 0 }).map((_, index) => (
          <AnswerBox key={index}>{userAnswer[index] || ''}</AnswerBox>
        ))}
      </AnswerContainer>
      <HintButton onClick={() => setShowHint(true)}>💡 힌트</HintButton>
      {showHint && (
        <Popup>
          <p>{currentWord?.hint}</p>
          <PopupButton onClick={() => setShowHint(false)}>알 것 같아요!</PopupButton>
        </Popup>
      )}
      <Keyboard>
  {keyboardLetters.map((letter, index) => (
    <LetterButton key={index} onClick={() => handleSelectLetter(letter)}>
      {letter}
    </LetterButton>
  ))}
</Keyboard>
      {showCorrectPopup && (
        <Popup>
          <p>😃 정답!</p>
          <PopupButton onClick={handleNextQuestion}>다음 문제</PopupButton>
        </Popup>
      )}
      {showIncorrectPopup && (
        <Popup>
          <p>😢 오답!</p>
          <PopupButton onClick={handleCloseIncorrectPopup}>다시 도전해보세요!</PopupButton>
        </Popup>
      )}
      {showFinishPopup && (
        <Popup>
          <p>{lives > 0 ? '🎉 축하합니다!' : '😢 아쉽습니다.'}</p>
          <PopupButton onClick={lives > 0 ? () => navigate('/minigame') : handleRestart}>
            {lives > 0 ? '미니게임 페이지로 돌아가기' : '다시 시작'}
          </PopupButton>
        </Popup>
      )}
    </PageContainer>
  );
};

export default WordQuizGamePage;


// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 390px;
`;

const LivesContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const Heart = styled.div<{ filled: boolean }>`
  width: 20px;
  height: 20px;
  background-color: ${(props) => (props.filled ? 'red' : 'lightgray')};
  clip-path: polygon(50% 0%, 100% 38%, 81% 100%, 50% 81%, 19% 100%, 0% 38%);
`;

const Timer = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const QuestionImage = styled.img`
  width: 200px;
  height: 200px;
`;

const QuestionText = styled.p`
  margin-top: 10px;
  font-size: 16px;
  text-align: center;
`;

const AnswerContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

const AnswerBox = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
`;

const HintButton = styled.button`
  background-color: #50b498;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
`;

const Keyboard = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
`;

const LetterButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  background-color: #ddd;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #bbb;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const PopupButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  background-color: #50b498;
  color: white;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
`;

