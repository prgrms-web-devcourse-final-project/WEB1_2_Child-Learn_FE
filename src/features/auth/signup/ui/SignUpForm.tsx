import styled from 'styled-components';
import { AuthInput } from '@/shared/ui/AuthInput/AuthInput';
import { AuthButton } from '@/shared/ui/AuthButton/AuthButton';
import { Link } from 'react-router-dom';

export const SignUpForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 로직
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Label>닉네임</Label>
        <AuthInput
          width="80%" // 여기에 width 추가
          name="nickname"
          placeholder="ex) 키앗"
        />
      </InputGroup>

      <InputGroup>
        <Label>생년월일</Label>
        <AuthInput width="80%" placeholder="ex) 001123" name="birthdate" />
      </InputGroup>

      {/* 나머지 input들도 동일하게 width="80%" 추가 */}
      <InputGroup>
        <Label>아이디</Label>
        <AuthInput width="80%" placeholder="ex) abcd1234" name="userId" />
      </InputGroup>

      <InputGroup>
        <Label>이메일</Label>
        <AuthInput
          width="80%"
          placeholder="ex) ijuju@gmail.com"
          type="email"
          name="email"
        />
      </InputGroup>

      <InputGroup>
        <Label>비밀번호</Label>
        <AuthInput
          width="80%"
          placeholder="******"
          type="password"
          name="password"
        />
      </InputGroup>

      <InputGroup>
        <Label>비밀번호 확인</Label>
        <AuthInput
          width="80%"
          placeholder="******"
          type="password"
          name="passwordConfirm"
        />
      </InputGroup>

      <InputGroup>
        <CheckboxContainer>
          <StyledCheckbox type="checkbox" id="terms" />
          <label htmlFor="terms">
            <TermsLink to="/terms">약관 및 정책</TermsLink>에 대해 이해했습니다.
          </label>
        </CheckboxContainer>
      </InputGroup>

      <AuthButton width="80%" type="submit">
        회원가입
      </AuthButton>
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
  gap: 8px;
  width: 100%;
  align-items: center; // 가운데 정렬 추가

  &:first-child {
    margin-top: -25px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #6f6f6f;
  width: 80%; // Input과 같은 width
  text-align: left; // 왼쪽 정렬
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #6f6f6f;
  width: 80%;
  margin: 0 auto;
`;

const StyledCheckbox = styled.input`
  appearance: none; // 기본 체크박스 스타일 제거
  width: 20px;
  height: 20px;
  border: 1px solid #50b498; // 테두리 색상
  border-radius: 4px;
  background-color: white;
  cursor: pointer;

  &:checked {
    background-color: #50b498; // 체크됐을 때 배경색
    background-image: url("data:image/svg+xml,%3Csvg width='12' height='10' viewBox='0 0 12 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 5L4.5 8.5L11 1.5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: 12px;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const TermsLink = styled(Link)`
  color: #50b498;
  cursor: pointer;
  font-weight: 700;

  &:hover {
    opacity: 0.8;
  }
`;
