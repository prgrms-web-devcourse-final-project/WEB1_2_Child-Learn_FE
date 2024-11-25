import styled from 'styled-components';

interface PopupProps {
  message: string;
  buttonText: string;
  onClose: () => void;
}

export const Popup = ({ message, buttonText, onClose }: PopupProps) => (
  <PopupContainer>
    <p>{message}</p>
    <PopupButton onClick={onClose}>{buttonText}</PopupButton>
  </PopupContainer>
);

// Styled Components
const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const PopupButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  background-color: #50b498;
  color: white;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
`;
