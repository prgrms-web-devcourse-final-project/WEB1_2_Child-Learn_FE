import styled from 'styled-components';
import { SignUpForm } from '@/features/auth/signup/ui/SignUpForm';
import { useNavigate } from 'react-router-dom'; // 추가

export const SignUpPage = () => {
  const navigate = useNavigate(); // 추가

  const handleBack = () => {
    navigate(-1); // 브라우저의 히스토리에서 한 단계 뒤로 이동
  };

  return (
    <PageContainer>
      <ContentContainer>
        <BackButton onClick={handleBack}>
          {' '}
          {/* onClick 추가 */}
          <img src="/img/out.png" alt="뒤로가기" />
        </BackButton>
        <LogoContainer>
          <img src="/img/logo.png" alt="아이주주" />
        </LogoContainer>
        <SignUpForm />
      </ContentContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #def9c4;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 400px;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;

  img {
    width: 24px;
    height: 24px;
  }
`;

const LogoContainer = styled.div`
  text-align: center;
  margin: 20px 0;

  img {
    height: 80px;
    margin: 0 auto;
  }
`;
