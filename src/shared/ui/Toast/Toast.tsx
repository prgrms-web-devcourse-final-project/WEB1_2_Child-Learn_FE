// src/shared/ui/Toast/Toast.tsx
import styled, { keyframes } from 'styled-components';

// Props 타입 정의 추가
interface ToastProps {
  message: string;
  isVisible: boolean;
}

const slideIn = keyframes`
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
`;

const ToastMessage = styled.span`
  font-size: 14px !important;
  font-weight: 500 !important;
  line-height: 1.5 !important;
`;

const ToastContainer = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translate(-50%, ${(props) => (props.$isVisible ? '0' : '-100%')});
  background-color: #ef4444;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  visibility: ${(props) => (props.$isVisible ? 'visible' : 'hidden')};
  animation: ${(props) => (props.$isVisible ? slideIn : slideOut)} 0.5s
    cubic-bezier(0.16, 1, 0.3, 1);
  transition:
    visibility 0.5s,
    opacity 0.5s,
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  min-width: 240px;
  max-width: 350px;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const Toast = ({ message, isVisible }: ToastProps) => {
  if (!message) return null;

  return (
    <ToastContainer $isVisible={isVisible}>
      <ToastMessage>{message}</ToastMessage>
    </ToastContainer>
  );
};
