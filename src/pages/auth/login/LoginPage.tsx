import styled from 'styled-components';
import { LoginForm } from '@/features/auth/login/ui/LoginForm';

const PageContainer = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #def9c4; // 연한 초록색 배경
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 20px;

  img {
    height: 120px;
    margin: 0 auto;
  }
`;

export const LoginPage = () => {
  return (
    <PageContainer>
      <ContentContainer>
        <LogoContainer>
          <img src="/img/logo.png" alt="아이주주" />
        </LogoContainer>
        <LoginForm />
      </ContentContainer>
    </PageContainer>
  );
};
