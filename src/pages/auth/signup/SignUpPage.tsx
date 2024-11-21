import styled from 'styled-components';
import { SignUpForm } from '@/features/auth/signup/ui/SignUpForm';

export const SignUpPage = () => {
  return (
    <PageContainer>
      <ContentContainer>
        <BackButton>
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
