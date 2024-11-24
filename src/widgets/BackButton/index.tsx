import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (window.history.state === null || window.history.length <= 2) {
      // 브라우저 히스토리가 없거나 너무 짧은 경우, 기본 경로로 이동
      navigate('/main');
    } else {
      // 브라우저 히스토리가 있는 경우 뒤로 가기
      navigate(-1);
    }
  };

  return (
    <BackButtonContainer onClick={handleBackClick}>
      <BackIcon src="/img/exit.png" alt="뒤로가기" />
    </BackButtonContainer>
  );
};

const BackButtonContainer = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000; 

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: none;
  }
`;

const BackIcon = styled.img`
  width: 20px;
  height: 20px;
`;
