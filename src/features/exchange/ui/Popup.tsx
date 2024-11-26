import styled from 'styled-components';

interface PopupProps {
  message: string;
  pointsUsed?: number;
  coinsGained?: number;
  buttonText: string;
  onClose: () => void;
}

const Popup = ({ message, pointsUsed, coinsGained, buttonText, onClose }: PopupProps) => (
  <PopupContainer>
    <Message>{message}</Message>
    <DetailsContainer>
      <DetailBox>
        <DetailTitle>소모된 포인트</DetailTitle>
        <DetailValue>{pointsUsed?.toLocaleString()}</DetailValue>
      </DetailBox>
      <DetailBox>
        <DetailTitle>획득한 코인</DetailTitle>
        <DetailValue>{coinsGained}</DetailValue>
      </DetailBox>
    </DetailsContainer>
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
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  text-align: center;
  z-index: 1000;
  width: 320px;
`;

const Message = styled.p`
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const DetailsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 80px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
`;

const DetailTitle = styled.span`
  font-size: 14px;
  color: #666666;
  margin-bottom: 5px;
`;

const DetailValue = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #000000;
`;

const PopupButton = styled.button`
  padding: 12px 20px;
  width: 175px;
  background-color: #50b498;
  color: white;
  border: none;
  border-radius: 4.39px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #3d937b;
  }
`;
