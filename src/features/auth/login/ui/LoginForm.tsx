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
      <InputGroup>
        <Label>아이디</Label>
        <AuthInput
          width="80%"
          placeholder="아이디를 입력해주세요."
          autoComplete="username"
        />
      </InputGroup>

      <InputGroup>
        <Label>비밀번호</Label>
        <AuthInput
          width="80%"
          type="password"
          placeholder="비밀번호를 입력해주세요."
          autoComplete="current-password"
        />
      </InputGroup>

      <AuthButton type="submit">로그인</AuthButton>

      <OrText>또는 계정 연동</OrText>

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

      <SignupContainer>
        <span>아직 계정이 없으신가요?</span>
        <SignupLink href="/auth/signup">회원가입하기</SignupLink>
      </SignupContainer>

      <FindAccountLink href="/auth/register">
        계정이 기억나지 않아요
      </FindAccountLink>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 5px;
`;

const Label = styled.label`
  align-self: flex-start;
  margin-left: 10%; // AuthInput이 80% width를 가지므로 margin으로 정렬 맞춤
  font-size: 14px;
  font-weight: 700;
  color: #6f6f6f;
`;

const OrText = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
  margin: 8px 0;
`;

const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 19px;
`;

const SocialButton = styled.button`
  padding: 2px;
  cursor: pointer;
  background: none;
  border: none;

  img {
    width: 30px;
    height: 30px;
  }
`;

const FindAccountLink = styled.a`
  display: block;
  text-align: center;
  font-size: 11px;
  color: #6b7280;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #191919;
`;

const SignupLink = styled.a`
  color: #50b498;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;
