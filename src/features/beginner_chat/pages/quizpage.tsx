import React, { useState } from 'react';
import styled from 'styled-components';
import QuizCard from '../ui/quizcard';
import { FastGraph } from './fastgraph';
import { BeginQuiz } from '../types/quiz';
import { BeginStock } from '../types/stock';

const PageContainer = styled.div`
  padding: 16px;
  background-color: #f5f5f5;
  min-height: 100%;
  overflow-y: auto;
`;

const DateDisplay = styled.div`
  text-align: right;
  padding: 8px;
  color: #666;
  font-size: 14px;
`;

const QuizPage: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  
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
  };

  return (
    <PageContainer>
      <FastGraph data={formattedData} />
      <DateDisplay>2024.11.11</DateDisplay>
      <QuizCard 
        quiz={sampleQuiz}
        onAnswer={handleAnswer}
        selectedAnswer={selectedAnswer}
      />
    </PageContainer>
  );
};

export default QuizPage;