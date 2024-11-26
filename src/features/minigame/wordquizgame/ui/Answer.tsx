import styled from 'styled-components';

interface AnswerProps {
  answerLength: number;
  userAnswer: string[];
}

export const Answer = ({ answerLength, userAnswer }: AnswerProps) => (
  <AnswerContainer>
    {Array.from({ length: answerLength }).map((_, index) => (
      <AnswerBox key={index}>{userAnswer[index] || ''}</AnswerBox>
    ))}
  </AnswerContainer>
);

// Styled Components
const AnswerContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0;
`;

const AnswerBox = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid #468585;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
`;
