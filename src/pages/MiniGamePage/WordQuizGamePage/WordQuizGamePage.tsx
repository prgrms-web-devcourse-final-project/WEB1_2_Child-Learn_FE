import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useWordQuizStore } from '@/features/minigame/wordquizgame/model/wordQuizStore';
import { WordQuizResponse } from '@/features/minigame/wordquizgame/types/wordTypes';
import { Header } from '@/features/minigame/wordquizgame/ui/Header';
import { Question } from '@/features/minigame/wordquizgame/ui/Question';
import { Answer } from '@/features/minigame/wordquizgame/ui/Answer';
import { Keyboard } from '@/features/minigame/wordquizgame/ui/KeyBoard';
import { Popup } from '@/features/minigame/wordquizgame/ui/Popup';
import { wordQuizApi } from '@/shared/api/minigames';

const WordQuizGamePage = () => {
  const { difficulty } = useParams<{ difficulty: 'begin' | 'mid' | 'adv' }>();
  const {
    incrementCorrectAnswers,
    decrementLives,
    setCurrentWord,
    setLives,
    setPhase,
    resetQuiz,
    lives,
    currentWord,
    currentPhase,
  } = useWordQuizStore();

  const [timeLeft, setTimeLeft] = useState(60);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showCorrectPopup, setShowCorrectPopup] = useState(false);
  const [showIncorrectPopup, setShowIncorrectPopup] = useState(false);

  const navigate = useNavigate();
  const correctWord = currentWord?.word || '';

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

  // 초기 데이터 로드
  useEffect(() => {
    const fetchQuizData = async () => {
      if (!difficulty) return;

      const difficultyMapping: Record<'begin' | 'mid' | 'adv', 'EASY' | 'NORMAL' | 'HARD'> = {
        begin: 'EASY',
        mid: 'NORMAL',
        adv: 'HARD',
      };

      try {
        const quiz = await wordQuizApi.getQuizByDifficulty(difficultyMapping[difficulty]);
        setCurrentWord({
          word: quiz.word,
          explanation: quiz.explanation,
          hint: quiz.hint,
        });
        setLives(quiz.remainLife || 3);
        setPhase(quiz.currentPhase || 1);
      } catch (error) {
        console.error('Failed to fetch quiz data:', error);
      }
    };

    fetchQuizData();
  }, [difficulty, setCurrentWord, setLives, setPhase]);

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

  // 키보드 입력 처리
  const handleSelectLetter = async (letter: string) => {
    if (!correctWord || userAnswer.length >= correctWord.length) return;

    const updatedAnswer = [...userAnswer, letter];
    setUserAnswer(updatedAnswer);

    if (updatedAnswer.join('') === correctWord) {
      incrementCorrectAnswers();
      setShowCorrectPopup(true);

        // 다음 문제 상태를 미리 갱신
    try {
      const response = await wordQuizApi.submitAnswer(true);
      if (!response) {
        console.error("Game may have ended unexpectedly.");
        navigate(`/word-quiz/result/${difficulty}`);
        return;
      }

      // 게임 종료 여부 확인
     if (response.currentPhase === 3 && currentPhase === 3) {
      navigate(`/word-quiz/result/${difficulty}`);
      return;
    }

      // 다음 문제 상태 업데이트
      setCurrentWord({
        word: response.word,
        explanation: response.explanation,
        hint: response.hint,
      });
      setLives(response.remainLife);
      setPhase(response.currentPhase);
    } catch (error) {
      console.error("Failed to fetch next question:", error);
    }
    } else if (updatedAnswer.length === correctWord.length) {
      decrementLives();
      setShowIncorrectPopup(true);

      try {
        const response = await wordQuizApi.submitAnswer(false);
  
        // 게임 종료 상태 처리
        if (!response) {
          navigate(`/word-quiz/result/${difficulty}`);
          return;
        }
  
        // 다음 문제 상태 갱신
        setCurrentWord({
          word: response.word,
          explanation: response.explanation,
          hint: response.hint,
        });
        setLives(response.remainLife || 3);
      } catch (error) {
        console.error('Failed to submit incorrect answer:', error);
      }
    }
  };

  // 다음 문제로 이동
  const handleNextQuestion = () => {
    setUserAnswer([]);
    setShowCorrectPopup(false);
  };

  // 팝업 닫기 핸들러
const handleCloseIncorrectPopup = () => {
  setUserAnswer([]); // 팝업 닫힐 때 답안 초기화
  setShowIncorrectPopup(false);
};

  // 목숨이 0이 되면 결과 페이지로 이동
  useEffect(() => {
    if (lives === 0) {
      navigate(`/word-quiz/result/${difficulty}`);
      resetQuiz();
    }
  }, [lives, difficulty, navigate, resetQuiz]);

  return (
    <PageContainer>
       <BackgroundContainer />
      <Header timeLeft={timeLeft} currentPhase={currentPhase} />
      <Question question={currentWord?.explanation || ''} />
      <Answer answerLength={correctWord.length} userAnswer={userAnswer} />
      <HintIcon onClick={() => setShowHint(true)}>💡</HintIcon>
      {showHint && <Popup message={currentWord?.hint || ''} buttonText="알 것 같아요!" onClose={() => setShowHint(false)} />}
      {showCorrectPopup && <Popup message="😃 정답!" buttonText="다음 문제" onClose={handleNextQuestion} />}
      {showIncorrectPopup && <Popup message="😢 오답!" buttonText="다시 도전해봐요!" onClose={handleCloseIncorrectPopup} />}
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