import React, { useState } from 'react';
import styled from 'styled-components';
import QuizCard from '../ui/quizcard';
import { FastGraph } from './fastgraph';
import { BeginQuiz } from '../types/quiz';

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

  const sampleQuiz: BeginQuiz = {
    quiz_id: 1,
    content: "If you want to save money, what's the best thing to do with your allowance?",
    answer: "X",
    o_content: "Spend it all right away",
    x_content: "Save your of it and spend the rest",
    created_date: "2024-03-19",
    begin_id: 1
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  return (
    <PageContainer>
      <FastGraph />
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