import styled from "styled-components";

interface ModalProps {
    title: React.ReactNode;
    onClose: () => void;
  }

  const Modal = ({ title, onClose }: ModalProps): JSX.Element => {
    return (
      <ModalOverlay>
        <ModalContent>
          <ModalTitle>{title}</ModalTitle>
          <ModalButton onClick={onClose}>확인</ModalButton>
        </ModalContent>
      </ModalOverlay>
    );
  };

export default Modal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
`;

const ModalTitle = styled.h2`
  font-size: 16px;
  margin-bottom: 15px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background-color: #F27474;
  color: white;
  width: 200px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;