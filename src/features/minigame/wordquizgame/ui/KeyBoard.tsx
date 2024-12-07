// components/Keyboard.tsx
import styled from 'styled-components';

interface KeyboardProps {
  letters: string[];
  onSelect: (letter: string) => void;
}

export const Keyboard = ({ letters, onSelect }: KeyboardProps) => (
  <KeyboardContainer>
    {letters.map((letter, index) => (
      <LetterButton key={index} onClick={() => onSelect(letter)}>
        {letter}
      </LetterButton>
    ))}
  </KeyboardContainer>
);

// Styled Components
const KeyboardContainer = styled.div`
  position: absolute;
  top: 680px;
  bottom: 50px; /* 하단에서 50px 간격 */
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6열 */
  gap: 10px;
  justify-content: center;
  padding: 0 20px; /* 키보드 양쪽에 패딩 추가 */
  z-index: 1;
  max-height: 10vh; 
`;

const LetterButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  background-color: #468585;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #bbb;
  }
`;