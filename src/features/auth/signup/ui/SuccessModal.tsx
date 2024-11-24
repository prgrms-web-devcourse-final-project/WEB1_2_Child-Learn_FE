import styled from 'styled-components';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const SuccessModal = ({
  isOpen,
  onClose,
  message,
}: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContent>
        <Message>{message}</Message>
        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
      </ModalContent>
    </Overlay>
  );
};

const Overlay = styled.div`
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
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  width: 80%;
  max-width: 320px;

  img {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }
`;

const Message = styled.p`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #181818;
`;

const ConfirmButton = styled.button`
  background-color: #50b498;
  color: white;
  border: none;
  padding: 5px 80px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #429980;
  }
`;
