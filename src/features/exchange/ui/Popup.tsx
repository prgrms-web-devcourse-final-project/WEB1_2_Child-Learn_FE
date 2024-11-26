import styled from 'styled-components';

interface PopupProps {
    message: string;
    buttonText: string;
    onClose: () => void;
  }
  
  const Popup = ({ message, buttonText, onClose }: PopupProps) => (
    <PopupContainer>
      <Message>{message}</Message>
      <PopupButton onClick={onClose}>{buttonText}</PopupButton>
    </PopupContainer>
  );
  
  export default Popup;

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
    z-index: 1000;
  `;
  
  const Message = styled.p`
    font-size: 16px;
    margin-bottom: 20px;
  `;
  
  const PopupButton = styled.button`
    padding: 10px 20px;
    background-color: #50b498;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
  
    &:hover {
      background-color: #3d937b;
    }
  `;