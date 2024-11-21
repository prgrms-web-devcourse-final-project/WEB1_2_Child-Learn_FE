import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import QuizCard from './quizcard';
import { FastGraph } from '../ui/fast-graph/fast-graph';
import { BeginQuiz } from '../model/quiz';
import { BeginStock } from '../model/stock';

const PageContainer = styled.div`
  padding: 16px;
  background-color: #ffffff;
  min-height: 100%;
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

const QuizPage: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    try {
      // 데이터 로딩 시뮬레이션
      setIsLoading(true);
      // 실제 데이터 로딩 로직이 들어갈 자리
      setIsLoading(false);
    } catch (error) {
      console.error('데이터 로딩 중 오류:', error);
      setIsLoading(false);
    }
  }, []);

  const tempStockData: BeginStock[] = [
    { begin_id: 1, price: 205, trade_day: '월' },
    { begin_id: 2, price: 305, trade_day: '화' },
    { begin_id: 3, price: 405, trade_day: '수' },
    { begin_id: 4, price: 105, trade_day: '목' },
    { begin_id: 5, price: 75, trade_day: '금' },
    { begin_id: 6, price: 150, trade_day: '토' },
    { begin_id: 7, price: 270, trade_day: '일' }
  ];

  const formattedData = tempStockData.map(stock => ({
    value: stock.price,
    date: stock.trade_day
  }));

  const sampleQuiz: BeginQuiz = {
    quiz_id: 1,
    content: "금융 퀴즈에 대한 예시 질문입니다.",
    answer: "X",
    o_content: "정답",
    x_content: "오답",
    created_date: "2024-03-19",
    begin_id: 1
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowModal(true);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <PageContainer>
      <FastGraph data={formattedData} />
      <DateDisplay>{new Date().toLocaleDateString()}</DateDisplay>
      <QuizCard 
        quiz={sampleQuiz}
        onAnswer={handleAnswer}
        selectedAnswer={selectedAnswer}
      />

      {showModal && (
        <>
          <ModalOverlay onClick={() => setShowModal(false)} />
          <Modal>
            <ModalText>정답입니다!</ModalText>
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