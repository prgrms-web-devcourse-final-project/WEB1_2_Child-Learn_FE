import styled from 'styled-components';

interface ModalProps {
  title: string;
  message: string;
  emoji: string;
  buttonText: string;
  isSuccess?: boolean;
  points?: number;
  onButtonClick: () => void;
}

export function Modal({ title, message, emoji, buttonText, isSuccess, points,onButtonClick }: ModalProps) {
  return (
    <StyledModal>
      <p>
        <span style={{ fontSize: '20px', marginRight: '2px' }}>{emoji}</span> {title}
      </p>
      {isSuccess && (
        <PointMessage>
          <span className="points">{points || 0} Points</span> 
          <span className="description">{message}</span>
        </PointMessage>
      )}
      {!isSuccess && <p>{message}</p>} {/* 실패 시 일반 메시지 표시 */}
      <div className="divider"></div>
      <button onClick={onButtonClick}>{buttonText}</button>
    </StyledModal>
  );
}

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 303px; /* 모달 너비 고정 */
  background-color: white;
  padding: 15px 20px; /* 하단 패딩을 줄임 */
  border: 1px solid #ddd;
  border-radius: 5.86px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 텍스트와 버튼 사이 공간 조정 */

  p {
    margin: 5px 0; /* 텍스트 간 간격 줄임 */
    font-weight: bold;
  }

  .divider {
    margin: 10px 0; /* 선과 텍스트 간격 */
    border-top: 1px solid #ddd; /* 선 스타일 */
  }

  button {
    margin-top: auto; /* 버튼을 항상 하단으로 배치 */
    padding: 5px 20px; /* 버튼 크기 조정 */
    background-color: #73C3AD;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
`;

const PointMessage = styled.div`
  margin: 10px 0;

  .points {
    font-size: 30px; /* 포인트 글자 크기 */
    font-weight: bold;
    color: #000;
    display: block;
    margin-bottom: 5px; /* 포인트와 설명 간 간격 */
  }

  .description {
    font-size: 18px; /* 설명 글자 크기 */
    color: #000;
  }
`;