import styled from 'styled-components';
import { AuthInput } from '@/shared/ui/AuthInput/AuthInput';
import { AuthButton } from '@/shared/ui/AuthButton/AuthButton';

export const LoginForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직
  };

  return (
    <Form onSubmit={handleSubmit}>
      <AuthInput
        width="80%"
        placeholder="ex) lhj2778"
        autoComplete="username"
      />
      <AuthInput
        width="80%"
        type="password"
        placeholder="비밀번호"
        autoComplete="current-password"
      />
      <AuthButton type="submit">로그인</AuthButton>

      <SocialLoginContainer>
        <SocialButton type="button">
          <img src="/img/google-btn.png" alt="Google 로그인" />
        </SocialButton>
        <SocialButton type="button">
          <img src="/img/kakao-btn.png" alt="Kakao 로그인" />
        </SocialButton>
        <SocialButton type="button">
          <img src="/img/naver-btn.png" alt="Naver 로그인" />
        </SocialButton>
      </SocialLoginContainer>

      <RegisterLink href="/auth/register">계정이 기억나지 않아요</RegisterLink>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
`;

const SocialButton = styled.button`
  /* 소셜 로그인 버튼 스타일링 */
  padding: 4px;
  cursor: pointer;
  background: none;
  border: none;

  img {
    width: 30px;
    height: 30px;
  }
`;

const RegisterLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #6b7280;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
