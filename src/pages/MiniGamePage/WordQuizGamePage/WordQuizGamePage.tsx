import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useWordQuizStore } from '../../../features/minigame/wordquizgame/model/wordQuizStore';
import { Header } from '../../../features/minigame/wordquizgame/ui/Header';
import { Question } from '../../../features/minigame/wordquizgame/ui/Question';
import { Answer } from '../../../features/minigame/wordquizgame/ui/Answer';
import { Keyboard } from '../../../features/minigame/wordquizgame/ui/KeyBoard';
import { Popup } from '../../../features/minigame/wordquizgame/ui/Popup';
import { Word } from '../../../features/minigame/wordquizgame/types/wordTypes';

const WordQuizGamePage = () => {
  const { difficulty } = useParams<{ difficulty: 'begin' | 'mid' | 'adv' }>();
  const {
    incrementCorrectAnswers,
    decrementLives,
    resetQuiz,
    setDifficulty,
    setWords,
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

  // 전체 단어 리스트
  const wordList: Word[] = [
    { word_id: 1, word: '시장', explanation: '기업의 주식 발행 가격 총액을 뜻하는 단어', hint: '첫 글자는 "시"입니다.' },
    { word_id: 2, word: '경제', explanation: '사람들의 재화와 서비스 교환에 대한 활동을 뜻하는 단어', hint: '첫 글자는 "경"입니다.' },
    { word_id: 3, word: '투자', explanation: '미래의 이익을 기대하며 자산을 구매하는 활동', hint: '첫 글자는 "투"입니다.' },
    { word_id: 4, word: '관리자', explanation: '시스템을 운영하고 관리하는 역할을 맡은 사람', hint: '첫 글자는 "관"입니다.' },
    { word_id: 5, word: '소프트웨어', explanation: '컴퓨터 프로그램과 관련된 모든 것', hint: '첫 글자는 "소"입니다.' },
    { word_id: 6, word: '데이터베이스', explanation: '데이터를 체계적으로 저장하는 시스템', hint: '첫 글자는 "데"입니다.' },
    { word_id: 7, word: '알고리즘', explanation: '문제를 해결하는 절차나 방법', hint: '첫 글자는 "알"입니다.' },
    { word_id: 8, word: '컴퓨터', explanation: '정보를 처리하는 기계', hint: '첫 글자는 "컴"입니다.' },
  ];

  // 랜덤으로 3개의 단어 선택
  const selectRandomWords = (list: Word[], count: number): Word[] => {
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // 초기화: 난이도 설정 및 문제 리스트
  useEffect(() => {
    resetQuiz(); // 퀴즈 초기화
    setDifficulty(difficulty || 'begin'); // 난이도 설정
    const randomWords = selectRandomWords(wordList, 3); // 랜덤 단어 3개 선택
    setWords(randomWords); // 문제 리스트 설정
  }, [difficulty, resetQuiz, setDifficulty, setWords]);

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
  const handleSelectLetter = (letter: string) => {
    if (!correctWord || userAnswer.length >= correctWord.length) return;

    const updatedAnswer = [...userAnswer, letter];
    setUserAnswer(updatedAnswer);

    if (updatedAnswer.join('') === correctWord) {
      incrementCorrectAnswers(); // 맞춘 문제 증가
      setShowCorrectPopup(true);
    } else if (updatedAnswer.length === correctWord.length) {
      decrementLives(); // 목숨 감소
      setShowIncorrectPopup(true);
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
        lives={lives}
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