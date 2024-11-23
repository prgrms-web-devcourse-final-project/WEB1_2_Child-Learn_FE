import React from 'react';
import styled from 'styled-components';
import { BeginQuiz } from '../../model/types/quiz';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 4px 0 0 0;
  font-size: 14px;
`;

const QuestionContainer = styled.div`
  padding: 24px 20px;
`;

const Question = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

interface OptionButtonProps {
  $isSelected?: boolean;  // $ prefix 추가
}

const OptionButton = styled.button<OptionButtonProps>`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  border: none;
  color: #000000;
  background-color: ${props => props.$isSelected ? '#e9f7ef' : '#fff'};
  border: 1px solid ${props => props.$isSelected ? '#4caf50' : '#e0e0e0'};
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${props => props.$isSelected ? '#e9f7ef' : '#f5f5f5'};
  }
`;

const Circle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #2196f3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const X = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f44336;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

interface QuizCardProps {
  quiz: BeginQuiz;
  onAnswer: (answer: string) => void;
  selectedAnswer?: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onAnswer, selectedAnswer }) => {
  return (
    <Container>
      <Header>
        <Title>Child-Learn News</Title>
        <Subtitle>Lorem ipsum dolor</Subtitle>
      </Header>

      <QuestionContainer>
        <Question>{quiz.content}</Question>
        
        <OptionsContainer>
          <OptionButton 
            $isSelected={selectedAnswer === 'O'}
            onClick={() => onAnswer('O')}
            disabled={!!selectedAnswer}
          >
            <Circle>O</Circle>
            {quiz.o_content}
          </OptionButton>
          
          <OptionButton 
            $isSelected={selectedAnswer === 'X'}
            onClick={() => onAnswer('X')}
            disabled={!!selectedAnswer}
          >
            <X>X</X>
            {quiz.x_content}
          </OptionButton>
        </OptionsContainer>
      </QuestionContainer>
    </Container>
  );
};

export default QuizCard;