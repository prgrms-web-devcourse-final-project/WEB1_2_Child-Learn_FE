import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import QuizCard from '@/features/beginner_chart/ui/quiz-widget/quizcard';
import { FastGraph } from '@/features/beginner_chart/ui/fast-graph/fast-graph';
import { useGraphStore } from '@/features/beginner_chart/model/store/graph.store';
import { useQuizStore } from '@/features/beginner_chart/model/store/quiz.store';


const PageContainer = styled.div`
  padding: 16px;
  background-color: #ffffff;
  min-height: 100vh;
`;

const DateDisplay = styled.div`
  text-align: right;
  padding: 8px;
  color: #666;
  font-size: 14px;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 80%;
  max-width: 320px;
  z-index: 1000;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ConfirmButton = styled.button`
  background: #82C8BB;
  color: white;
  border: none;
  padding: 10px 40px;
  border-radius: 20px;
  margin-top: 20px;
  cursor: pointer;
  font-size: 16px;
`;

const ModalText = styled.p`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 16px;
  color: #666;
`;

const QuizPage: React.FC = () => {
  const { stockData, isLoading: isStockLoading, error: stockError, fetchStockData } = useGraphStore();
  const { currentQuiz, error: quizError } = useQuizStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  const handleAnswer = async (answer: string) => {
    try {
      setSelectedAnswer(answer);
      await useQuizStore.getState().submitAnswer(answer);
      setShowModal(true);
    } catch (error) {
      console.error('답변 제출 오류:', error);
    }
  };

  if (isStockLoading) {
    return <LoadingSpinner>로딩중...</LoadingSpinner>;
  }

  if (stockError || quizError) {
    return <div>에러가 발생했습니다: {stockError || quizError}</div>;
  }

  return (
    <PageContainer>
      <FastGraph data={stockData} />
      <DateDisplay>{new Date().toLocaleDateString()}</DateDisplay>
      {currentQuiz && (
        <QuizCard 
          quiz={currentQuiz}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
        />
      )}

      {showModal && (
        <>
          <ModalOverlay onClick={() => setShowModal(false)} />
          <Modal>
            <ModalText>
              {selectedAnswer === currentQuiz?.answer ? '정답입니다!' : '틀렸습니다.'}
            </ModalText>
            <ConfirmButton onClick={() => setShowModal(false)}>
              확인
            </ConfirmButton>
          </Modal>
        </>
      )}
    </PageContainer>
  );
};

export default React.memo(QuizPage);