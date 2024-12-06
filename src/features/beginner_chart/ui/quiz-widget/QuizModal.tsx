// QuizModal.tsx
import React from 'react';
import styled from 'styled-components';



interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCorrect: boolean;
  earnedPoints?: number;
}

const QuizModal: React.FC<QuizModalProps> = ({ 
  isOpen, 
  onClose, 
  isCorrect,
  earnedPoints = 0
}) => {
  if (!isOpen) return null;

  const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 80%;
  max-width: 320px;
  text-align: center;
`;

const ModalText = styled.p`
  font-size: 16px;
  margin-bottom: 16px;
  color: #333;
`;

const PointText = styled.p`
  font-size: 14px;
  color: #82C8BB;
  margin: 8px 0;
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

  &:hover {
    background-color: #6db5a7;
  }
`;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalText>
          {isCorrect ? '정답입니다!' : '내일 다시 도전해봐요!'}
        </ModalText>
        {earnedPoints > 0 && (
          <PointText>
            +{earnedPoints} 포인트를 획득했습니다!
          </PointText>
        )}
        <ConfirmButton onClick={onClose}>
          확인
        </ConfirmButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default QuizModal;