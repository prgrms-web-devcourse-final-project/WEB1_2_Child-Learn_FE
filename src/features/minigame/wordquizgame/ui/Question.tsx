import styled from 'styled-components';

interface QuestionProps {
  question: string;
}

export const Question = ({ question }: QuestionProps) => (
  <QuestionContainer>
    <QuestionText>{question}</QuestionText>
  </QuestionContainer>
);

// Styled Components
const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 350px;
  width: 310px;
  height: 107px;
  background-color: #50b498;
  opacity: 0.8;
  border-radius: 15px;
  text-align: center;
`;

const QuestionText = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  margin: 0;
  line-height: 1.5;
`;
