import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useWordQuizStore } from '@/features/minigame/wordquizgame/model/wordQuizStore';
import { Header } from '@/features/minigame/wordquizgame/ui/Header';
import { Question } from '@/features/minigame/wordquizgame/ui/Question';
import { Answer } from '@/features/minigame/wordquizgame/ui/Answer';
import { Keyboard } from '@/features/minigame/wordquizgame/ui/KeyBoard';
import { Popup } from '@/features/minigame/wordquizgame/ui/Popup';
import { wordQuizApi, WordQuizQuestion } from '@/shared/api/minigames';

const WordQuizGamePage = () => {
  const { difficulty } = useParams<{ difficulty: 'begin' | 'mid' | 'adv' }>();
  const {
    incrementCorrectAnswers,
    decrementLives,
    setWords,
    setLives,
    setCurrentQuestionIndex,
    lives,
    words,
    currentQuestionIndex,
    nextQuestion,
  } = useWordQuizStore();

  const [timeLeft, setTimeLeft] = useState(60); // 남은 시간
  const [userAnswer, setUserAnswer] = useState<string[]>([]); // 현재 유저 답변
  const [showHint, setShowHint] = useState(false); // 힌트 표시 여부
  const [showCorrectPopup, setShowCorrectPopup] = useState(false); // 정답 팝업 표시 여부
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false); // 오답 팝업 표시 여부

  const navigate = useNavigate();

  const currentWord = words[currentQuestionIndex]; // 현재 단어
  const correctWord = currentWord?.word || ''; // 정답 단어

  // 키보드 글자 생성
  const alphabet = '가나다라마바사아자차카타파하';
  const keyboardLetters = useMemo(() => {
    if (!correctWord) return [];
    const uniqueLetters = new Set<string>(correctWord.split('')); // 정답 단어의 모든 글자를 추가
    while (uniqueLetters.size < 12) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      uniqueLetters.add(randomLetter);
    }
    return Array.from(uniqueLetters).sort(() => Math.random() - 0.5); // 랜덤 섞음
  }, [correctWord]);

    // API 연동: 난이도별 퀴즈 데이터 가져오기
    useEffect(() => {
      const fetchQuizData = async () => {
        if (!difficulty) return;
    
        // "begin" | "mid" | "adv" → "EASY" | "NORMAL" | "HARD"로 변환
        const difficultyMapping: Record<'begin' | 'mid' | 'adv', 'EASY' | 'NORMAL' | 'HARD'> = {
          begin: 'EASY',
          mid: 'NORMAL',
          adv: 'HARD',
        };
    
        const mappedDifficulty = difficultyMapping[difficulty];
    
        try {
          const quiz: WordQuizQuestion = await wordQuizApi.getQuizByDifficulty(mappedDifficulty);
          setWords([{
            word: quiz.word,
            explanation: quiz.explanation,
            hint: quiz.hint,
          }]);
          setLives(quiz.remainLife || 3); // 백엔드에서 남은 목숨을 반환하지 않으면 기본값 3 설정
          setCurrentQuestionIndex(quiz.currentPhase - 1 || 0); // 첫 번째 문제로 초기화
        } catch (error) {
          console.error('Failed to fetch quiz data:', error);
        }
      };
    
      fetchQuizData();
    }, [difficulty, setWords, setLives, setCurrentQuestionIndex]);
    
  // 타이머 초기화
  useEffect(() => {
    let initialTime = 60;
    if (difficulty === 'mid') initialTime = 40;
    if (difficulty === 'adv') initialTime = 20;
    setTimeLeft(initialTime);
  }, [difficulty]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate(`/word-quiz/result/${difficulty}`); // 타이머 종료 시 결과 페이지로 이동
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, difficulty]);

  // 키보드 클릭 핸들러
  const handleSelectLetter = async (letter: string) => {
    if (!correctWord || userAnswer.length >= correctWord.length) return;

    const updatedAnswer = [...userAnswer, letter];
    setUserAnswer(updatedAnswer);

    if (updatedAnswer.join('') === correctWord) {
      incrementCorrectAnswers(); // 맞춘 문제 증가
      setShowCorrectPopup(true);

      try {
        const response = await wordQuizApi.submitAnswer(true);
        if ('message' in response) {
          // 게임 종료 시
          navigate(`/word-quiz/result/${difficulty}`, { state: { message: response.message } });
        } else {
          setWords([response]); // 다음 문제 업데이트
          setLives(response.remainLife);
          setCurrentQuestionIndex(response.currentPhase - 1);
        }
      } catch (error) {
        console.error('Failed to submit correct answer:', error);
      }
    } else if (updatedAnswer.length === correctWord.length) {
      decrementLives();
      setShowIncorrectPopup(true);

      try {
        const response = await wordQuizApi.submitAnswer(false);
        if ('message' in response) {
          // 게임 종료 시
          navigate(`/word-quiz/result/${difficulty}`, { state: { message: response.message } });
        } else {
          setWords([response]);
          setLives(response.remainLife);
        }
      } catch (error) {
        console.error('Failed to submit incorrect answer:', error);
      }
    }
  };
  
  // 다음 문제로 이동
  const handleNextQuestion = () => {
    setShowCorrectPopup(false);
    setShowIncorrectPopup(false);
    setUserAnswer([]);

    if (currentQuestionIndex + 1 < words.length) {
      nextQuestion(); // 다음 문제로 이동
    } else {
      navigate(`/word-quiz/result/${difficulty}`); // 모든 문제를 다 풀었을 때 결과 페이지로 이동
    }
  };

  // 목숨이 0이 되면 결과 페이지로 이동
  useEffect(() => {
    if (lives === 0) {
      navigate(`/word-quiz/result/${difficulty}`);
    }
  }, [lives, difficulty, navigate]);

  const handleCloseIncorrectPopup = () => {
    setShowIncorrectPopup(false);
    setUserAnswer([]);
  };

  return (
    <PageContainer>
      <BackgroundContainer />
      <Header
        timeLeft={timeLeft}
        progress={words.map((_, i) => i <= currentQuestionIndex)}
      />
      <Question question={currentWord?.explanation || ''} />
      <Answer answerLength={correctWord.length} userAnswer={userAnswer} />
      <HintIcon onClick={() => setShowHint(true)}>💡</HintIcon>
      {showHint && <Popup message={currentWord?.hint || ''} buttonText="알 것 같아요!" onClose={() => setShowHint(false)} />}
      {showCorrectPopup && (
  <Popup
    message="😃 정답!"
    buttonText="다음 문제"
    onClose={handleNextQuestion}
  />
)}

{showIncorrectPopup && (
  <Popup
    message="😢 오답!"
    buttonText="다시 도전해봐요!"
    onClose={handleCloseIncorrectPopup}
  />
)}

      <Keyboard letters={keyboardLetters} onSelect={handleSelectLetter} />
    </PageContainer>
  );
};

export default WordQuizGamePage;

// Styled Components
const PageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  padding: 20px;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 630px;
  background-color: #DEf9C4;
  z-index: 0;
`;

const HintIcon = styled.button`
  position: absolute;
  top: 20px;
  right: 35px;
  transform: translateX(50%);
  cursor: pointer;
  background: none; /* 배경 제거 */
  border: none; /* 테두리 제거 */
  padding: 0; /* 기본 여백 제거 */
  img {
    width: 32px;
    height: 32px;
  }
  &:focus {
    outline: none; /* 버튼 클릭 시 나타나는 테두리 제거 */
  }
`;