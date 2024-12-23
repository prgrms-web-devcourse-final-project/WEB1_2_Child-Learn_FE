import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FastGraph } from '@/features/beginner_chart/ui/fast-graph/fast-graph';
import { useGraphStore } from '@/features/beginner_chart/model/store/graph.store';
import { useQuizStore } from '@/features/beginner_chart/model/store/quiz.store';
import { PointBadge } from '@/shared/ui/PointBadge/PointBadge';
import QuizModal from '@/features/beginner_chart/ui/quiz-widget/QuizModal';



const QuizGraphPage: React.FC = () => {
  const navigate = useNavigate();
  const [showArticle, setShowArticle] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [userId, setUserId] = useState<number>(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPageVisible = useRef(true);

  const { stockData, fetchStockData, isLoading } = useGraphStore();
  const { currentQuiz, submitAnswer, fetchQuizzes } = useQuizStore();

  // BFCache 최적화를 위한 페이지 이벤트 핸들러
  const handlePageShow = useCallback((event: PageTransitionEvent) => {
    isPageVisible.current = true;
    if (event.persisted) {
      // bfcache에서 복원된 경우 데이터 새로고침
      fetchStockData();
      fetchQuizzes();
    }
  }, [fetchStockData, fetchQuizzes]);

  const handlePageHide = useCallback(() => {
    isPageVisible.current = false;
    // 진행 중인 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // 초기 데이터 로드 및 이벤트 리스너 설정
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        // 이전 요청 취소
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // 새로운 AbortController 생성
        abortControllerRef.current = new AbortController();

        // 병렬로 데이터 로드
        await Promise.all([
          fetchStockData(),
          fetchQuizzes()
        ]);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Request was cancelled');
          return;
        }
        console.error('Failed to load initial data:', error);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('visibilitychange', () => {
      isPageVisible.current = document.visibilityState === 'visible';
    });

    // UserId 초기화
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId && isMounted) {
      setUserId(Number(storedUserId));
    }

    if (isMounted) {
      loadInitialData();
    }

    // 클린업 함수
    return () => {
      isMounted = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [handlePageShow, handlePageHide]);

  const handleChartClick = () => {
    setShowArticle(true);
  };

  const handleAnswer = async (answer: string) => {
    try {
      setSelectedAnswer(answer);
      const result = await submitAnswer(answer);
      
      if (result.isCorrect) {
        setEarnedPoints(result.points || 0);
      } else {
        setEarnedPoints(0);
      }
      
      setShowModal(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setEarnedPoints(0);
      setShowModal(true);
    }
  };

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setShowArticle(false);
    setSelectedAnswer(undefined);
    setEarnedPoints(0);
  }, []);
  const PageContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  min-height: 100vh;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const OutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  
  img {
    width: 22px;
    height: 22px;
  }
`;

const CardWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ArticleContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
`;

const ArticleHeader = styled.div`
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #eee;
`;

const ArticleTitle = styled.h1`
  font-size: 18px;
  color: #000000;
  font-weight: bold;
  margin: 0;
`;

const ArticleDate = styled.div`
  font-size: 12px;
  color: #666;
  text-align: right;
  padding: 8px 16px;
`;

const QuizContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const QuizQuestion = styled.h2`
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 20px;
  line-height: 1.5;
  word-break: keep-all;
  white-space: pre-wrap;
`;

const AnswerButton = styled.button<{ $type: 'O' | 'X'; $isSelected?: boolean }>`
  width: 100%;
  min-height: 60px;
  height: auto;
  padding: 16px;
  border: 1px solid ${props => props.$isSelected ? '#82C8BB' : '#e0e0e0'};
  border-radius: 8px;
  background: ${props => props.$isSelected ? '#f5fffd' : 'white'};
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  text-align: left;
  word-break: keep-all;
  white-space: pre-wrap;

  &:hover {
    background: ${props => props.$isSelected ? '#f5fffd' : '#f5f5f5'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const AnswerCircle = styled.div<{ $type: 'O' | 'X' }>`
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 50%;
  background-color: ${props => props.$type === 'O' ? '#4A90E2' : '#E25C5C'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-top: 2px;
`;

const AnswerText = styled.span`
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  flex: 1;
  padding-top: 2px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

  if (isLoading) {
    return (
      <PageContainer>
        <TopBar>
          <OutButton onClick={() => navigate('/')}>
            <img src="/img/out.png" alt="나가기" />
          </OutButton>
        </TopBar>
        <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TopBar>
        <OutButton onClick={() => navigate('/')}>
          <img src="/img/out.png" alt="나가기" />
        </OutButton>
        <PointBadge/>
      </TopBar>

      <CardWrapper>
        <FastGraph 
          data={stockData} 
          onChartClick={handleChartClick}
        />
      </CardWrapper>

      {showArticle && currentQuiz && (
        <ArticleContainer>
          <ArticleHeader>
            <ArticleTitle>Child-Learn News</ArticleTitle>
          </ArticleHeader>
          <ArticleDate>{new Date().toLocaleDateString()}</ArticleDate>
          <QuizContent>
            <QuizQuestion>
              {currentQuiz.content}
            </QuizQuestion>
            
            <AnswerButton 
              $type="O" 
              $isSelected={selectedAnswer === "O"}
              onClick={() => handleAnswer("O")}
              disabled={!!selectedAnswer}
            >
              <AnswerCircle $type="O">O</AnswerCircle>
              <AnswerText>{currentQuiz.oContent}</AnswerText>
            </AnswerButton>
            
            <AnswerButton 
              $type="X" 
              $isSelected={selectedAnswer === "X"}
              onClick={() => handleAnswer("X")}
              disabled={!!selectedAnswer}
            >
              <AnswerCircle $type="X">X</AnswerCircle>
              <AnswerText>{currentQuiz.xContent}</AnswerText>
            </AnswerButton>
          </QuizContent>
        </ArticleContainer>
      )}

      <QuizModal
        isOpen={showModal}
        onClose={handleModalClose}
        earnedPoints={earnedPoints}
        isCorrect={earnedPoints > 0}
        userId={userId}
      />
    </PageContainer>
  );
};

export default QuizGraphPage;