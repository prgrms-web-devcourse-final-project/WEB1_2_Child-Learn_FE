import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

interface PageProps {
  $isSlideOut?: boolean;
}

export const LandingPage = () => {
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(false);
  const [isSlideOut, setIsSlideOut] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowLogo(true), 500);

    setTimeout(() => {
      setIsSlideOut(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 500);
    }, 3000);
  }, [navigate]);

  return (
    <PageContainer $isSlideOut={isSlideOut}>
      {showLogo && (
        <FadeInContent>
          <LogoContainer>
            <img src="/img/logo.png" alt="아이주주" />
          </LogoContainer>
        </FadeInContent>
      )}
    </PageContainer>
  );
};

const fadeIn = keyframes`
 from { opacity: 0; transform: translateY(20px); }
 to { opacity: 1; transform: translateY(0); }
`;

const slideOut = keyframes`
 from { transform: translateX(0); }
 to { transform: translateX(-100%); }
`;

const PageContainer = styled.div<PageProps>`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #def9c4;
  overflow: hidden;
  position: relative;
  animation: ${(props) => (props.$isSlideOut ? slideOut : 'none')} 0.5s
    ease-in-out forwards;
`;

const FadeInContent = styled.div`
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.8s ease-out forwards;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;

  img {
    height: 120px;
    margin: 0 auto;
  }
`;

export default LandingPage;
