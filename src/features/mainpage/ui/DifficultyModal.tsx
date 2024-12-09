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
  if (!isOpen) return null; // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음

  const navigate = useNavigate();

  const checkPlayable = (level: string) => {
    const hasPlayed = localStorage.getItem(`played_${level}`);
    return !hasPlayed; // 플레이 기록이 없으면 true, 있으면 false
  };

  const handleDifficultySelect = (level: string) => {
    if (!checkPlayable(level)) {
      alert('이미 플레이한 난이도입니다!');
      return;
    }

    // 플레이 기록 저장
    localStorage.setItem(`played_${level}`, 'true');
    onSelect(level);
    
    switch (level) {
      case 'low':
        navigate('/begin-stocks');
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

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <img src="/img/close.png" alt="닫기" />
        </CloseButton>
        <ModalTitle>난이도를 선택하세요!</ModalTitle>
        <ButtonGroup>
          {['low', 'medium', 'high'].map((level) => (
            <DifficultyButton
              key={level}
              onClick={() => handleDifficultySelect(level)}
              $level={level as 'low' | 'medium' | 'high'}
              disabled={!checkPlayable(level)}
            >
              {level === 'low' ? '초급' : level === 'medium' ? '중급' : '고급'}
            </DifficultyButton>
          ))}
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

const DifficultyButton = styled.button<{ 
  $level: 'low' | 'medium' | 'high'
}>`
  padding: 9px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  text-align: center;
  background-color: ${({ $level, disabled }) =>
    disabled 
      ? '#cccccc'
      : $level === 'low' 
      ? '#9CDBA6' 
      : $level === 'medium' 
      ? '#50B498' 
      : '#468585'};
  color: ${props => (props.disabled ? '#666666' : 'white')};
  opacity: ${props => (props.disabled ? 0.8 : 1)};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => (props.disabled ? 'none' : 'translateY(-2px)')};
    box-shadow: ${props => (props.disabled ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
    opacity: ${props => (props.disabled ? 0.8 : 0.9)};
  }

  &:active {
    transform: ${props => (props.disabled ? 'none' : 'translateY(0)')};
    box-shadow: ${props => (props.disabled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)')};
  }
`;
