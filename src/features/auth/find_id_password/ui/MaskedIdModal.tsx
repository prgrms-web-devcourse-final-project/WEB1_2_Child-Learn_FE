import styled from 'styled-components';
import { AuthButton } from '@/shared/ui/AuthButton/AuthButton';

interface MaskedIdModalProps {
  maskedId: string;
  onClose: () => void;
}

export const MaskedIdModal = ({ maskedId, onClose }: MaskedIdModalProps) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>아이디 찾기 결과</ModalHeader>
        <ModalBody>
          <IdText>
            <IdValue>{maskedId}</IdValue>
          </IdText>
        </ModalBody>
        <ModalFooter>
          <AuthButton type="button" onClick={onClose}>
            닫기
          </AuthButton>
        </ModalFooter>
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
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
  margin: 20px;
  text-align: center;
  box-sizing: border-box;
`;

const ModalHeader = styled.h2`
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 700;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e5e5;
`;

const ModalBody = styled.div`
  margin-bottom: 18px;
  font-size: 16px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
`;

const IdText = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;

const IdValue = styled.span`
  font-weight: 700;
`;
