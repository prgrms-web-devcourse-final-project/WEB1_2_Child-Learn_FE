import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWordQuizStore } from '../../../app/providers/state/zustand/useWordQuizStore';
import { useNavigate, useParams } from 'react-router-dom';

const WordQuizGamePage = () => {
  const { level } = useParams<{ level: 'beginner' | 'medium' | 'advanced' }>(); // 난이도 동적 경로
  const { words, setWords, setLastPlayed } = useWordQuizStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showCorrectPopup, setShowCorrectPopup] = useState(false);
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false);
  const [showFinishPopup, setShowFinishPopup] = useState(false);
  const navigate = useNavigate();

  // 초기 데이터를 로드
  useEffect(() => {
    // quizWords 객체에 명시적인 타입을 추가
    const quizWords: {
      beginner: Array<{ word: string; explanation: string; hint: string; difficulty: 'beginner' }>;
      medium: Array<{ word: string; explanation: string; hint: string; difficulty: 'medium' }>;
      advanced: Array<{ word: string; explanation: string; hint: string; difficulty: 'advanced' }>;
    } = {
      beginner: [
        { word: '시장', explanation: '기업의 주식 발행 가격 총액을 뜻하는 단어', hint: '첫 글자는 "시"입니다.', difficulty: 'beginner' },
        { word: '경제', explanation: '사람들의 재화와 서비스 교환에 대한 활동을 뜻하는 단어', hint: '첫 글자는 "경"입니다.', difficulty: 'beginner' },
        { word: '투자', explanation: '미래의 이익을 기대하며 자산을 구매하는 활동', hint: '첫 글자는 "투"입니다.', difficulty: 'beginner' },
      ],
      medium: [
        { word: '주식', explanation: '기업의 소유권을 나타내는 증서', hint: '첫 글자는 "주"입니다.', difficulty: 'medium' },
        { word: '배당', explanation: '기업이 이익의 일부를 주주들에게 나누어주는 것', hint: '첫 글자는 "배"입니다.', difficulty: 'medium' },
        { word: '자산', explanation: '기업이 소유하고 있는 경제적 가치', hint: '첫 글자는 "자"입니다.', difficulty: 'medium' },
      ],
      advanced: [
        { word: '합병', explanation: '두 기업이 하나로 합쳐지는 과정', hint: '첫 글자는 "합"입니다.', difficulty: 'advanced' },
        { word: '채권', explanation: '기업이나 정부가 자금을 조달하기 위해 발행하는 증서', hint: '첫 글자는 "채"입니다.', difficulty: 'advanced' },
        { word: '분석', explanation: '투자 가치를 평가하기 위해 데이터를 해석하는 것', hint: '첫 글자는 "분"입니다.', difficulty: 'advanced' },
      ],
    };
  
    // setWords 호출
    if (level && quizWords[level]) {
      setWords(level, quizWords[level]); 
      setLastPlayed(level, new Date());
    }
  }, [level, setWords, setLastPlayed]);
  
  // 전체 타이머 설정
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(timer);
          setShowFinishPopup(true); // 시간 종료 시 게임 종료
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectLetter = (letter: string) => {
    const currentLevelWords = words[level!]; // 현재 레벨의 단어 목록
    const correctWord = currentLevelWords[currentQuestionIndex]?.word;

    if (!correctWord || userAnswer.length >= correctWord.length) return;

    const updatedAnswer = [...userAnswer, letter];
    setUserAnswer(updatedAnswer);

    // 정답 체크
    if (updatedAnswer.join('') === correctWord) {
        setShowCorrectPopup(true);
      } else if (updatedAnswer.join('').length === correctWord.length) {
        // 정답이 아닌 경우
        handleLoseLife();
        setShowIncorrectPopup(true);
      }
  };

  const handleNextQuestion = () => {
    setShowCorrectPopup(false);
    setShowIncorrectPopup(false);
    setUserAnswer([]);
    const currentLevelWords = words[level!];

    if (currentQuestionIndex + 1 < currentLevelWords.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowFinishPopup(true);
    }
  };

  const handleCloseIncorrectPopup = () => {
    setShowIncorrectPopup(false);
    setUserAnswer([]); // 정답 입력칸 초기화
  };

  const handleLoseLife = () => {
    setLives((prev) => {
      if (prev === 1) {
        setShowFinishPopup(true);
        return 0;
      }
      return prev - 1;
    });
    setUserAnswer([]);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setLives(3);
    setTimeLeft(60);
    setUserAnswer([]);
    setShowFinishPopup(false);
  };

  const currentLevelWords = words[level!]; // 현재 레벨의 단어 목록
  const currentWord = currentLevelWords?.[currentQuestionIndex];

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
        {currentWord?.word.split('').map((letter) => (
          <LetterButton key={letter} onClick={() => handleSelectLetter(letter)}>
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

