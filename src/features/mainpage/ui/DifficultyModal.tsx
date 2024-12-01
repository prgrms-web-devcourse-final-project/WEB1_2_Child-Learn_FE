import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface DifficultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (level: string) => void;
}

export const DifficultyModal = ({
  isOpen,
  onClose,
  onSelect,
}: DifficultyModalProps) => {
  const navigate = useNavigate();

  const handleDifficultySelect = (level: string) => {
    onSelect(level);
    // 난이도에 따라 다른 페이지로 이동
    switch (level) {
      case 'low':
        navigate('/fast-navigation');
        break;
      case 'medium':
        navigate('/intermediate');
        break;
      case 'high':
        navigate('/advanced');
        break;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <img src="/img/close.png" alt="닫기" />
        </CloseButton>
        <ModalTitle>난이도를 선택하세요!</ModalTitle>
        <ButtonGroup>
          <DifficultyButton
            onClick={() => handleDifficultySelect('low')}
            $level="low"
          >
            초급
          </DifficultyButton>
          <DifficultyButton
            onClick={() => handleDifficultySelect('medium')}
            $level="medium"
          >
            중급
          </DifficultyButton>
          <DifficultyButton
            onClick={() => handleDifficultySelect('high')}
            $level="high"
          >
            고급
          </DifficultyButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 90%;
  max-width: 320px;
  position: relative;
  padding-top: 38px; // 상단 패딩 추가
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;

  img {
    width: 20px;
    height: 20px;
  }
`;

const ModalTitle = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  margin-top: 5px; // 상단 마진 추가
  font-size: 16px;
  font-weight: 700;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const DifficultyButton = styled.button<{ $level: 'low' | 'medium' | 'high' }>`
  padding: 9px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  background-color: ${({ $level }) =>
    $level === 'low' ? '#9CDBA6' : $level === 'medium' ? '#50B498' : '#468585'};
  color: white;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    opacity: 0.9;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;
