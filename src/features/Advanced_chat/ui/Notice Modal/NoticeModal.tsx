// src/features/Advanced_game/ui/NoticeModal/NoticeModal.tsx

import React, { useEffect } from 'react';
import styled from 'styled-components';


interface NoticeModalProps {
  message: string;
  isOpen: boolean;
  onClose?: () => void;
  autoClose?: boolean;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  message,
  isOpen,
  onClose,
  autoClose = false
}) => {
  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

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
  border-radius: 10px;
  width: 300px;
  text-align: center;
`;

const ModalButton = styled.button`
  background-color: #7FBA7A;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: 15px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;

  &:hover {
    background-color: #6ca968;
  }
`;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        {!autoClose && <ModalButton onClick={onClose}>확인</ModalButton>}
      </ModalContent>
    </ModalOverlay>
  );
};