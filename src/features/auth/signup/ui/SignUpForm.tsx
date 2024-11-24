import styled from 'styled-components';
import { useState } from 'react';
import { AuthInput } from '@/shared/ui/AuthInput/AuthInput';
import { AuthButton } from '@/shared/ui/AuthButton/AuthButton';
import { Link, useNavigate } from 'react-router-dom';
import { useJoin } from '../lib/useJoin';
import { joinValidation } from '../model/validation';
import { SuccessModal } from './SuccessModal';

export const SignUpForm = () => {
  const navigate = useNavigate();
  const { handleJoin, isLoading, error } = useJoin();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    loginId: '',
    pw: '',
    username: '',
    email: '',
    birth: '',
    pwConfirm: '',
    terms: false,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validateField = (name: string, value: string) => {
    if (name === 'pwConfirm') {
      return formData.pw !== value ? '비밀번호가 일치하지 않습니다.' : '';
    }

    const validation = joinValidation[name as keyof typeof joinValidation];
    if (!validation) return '';

    if (!value && validation.required) {
      return validation.required;
    }

    if (validation.pattern && !validation.pattern.value.test(value)) {
      return validation.pattern.message;
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (type !== 'checkbox') {
      const error = validateField(name, value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));

      // 비밀번호 변경 시 비밀번호 확인 필드도 재검증
      if (name === 'pw' && formData.pwConfirm) {
        setValidationErrors((prev) => ({
          ...prev,
          pwConfirm:
            formData.pwConfirm !== value ? '비밀번호가 일치하지 않습니다.' : '',
        }));
      }
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/auth/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 약관 동의 확인
    if (!formData.terms) {
      setValidationErrors((prev) => ({
        ...prev,
        terms: '약관에 동의해주세요.',
      }));
      return;
    }

    // 전체 폼 유효성 검사
    const errors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'terms' && key !== 'pwConfirm') {
        const error = validateField(key, String(value));
        if (error) errors[key] = error;
      }
    });

    // 비밀번호 확인 검사
    if (formData.pw !== formData.pwConfirm) {
      errors.pwConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // API 호출용 데이터 준비
    const submitData = {
      loginId: formData.loginId,
      pw: formData.pw,
      username: formData.username,
      email: formData.email,
      birth: Number(formData.birth),
    };

    try {
      await handleJoin(submitData);
      setShowSuccessModal(true);
    } catch (error) {
      // 에러는 useJoin에서 처리됨
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>아이디</Label>
          <AuthInput
            width="80%"
            placeholder="ex) abcd1234"
            name="loginId"
            value={formData.loginId}
            onChange={handleChange}
            error={validationErrors.loginId}
          />
        </InputGroup>

        <InputGroup>
          <Label>비밀번호</Label>
          <AuthInput
            width="80%"
            placeholder="******"
            type="password"
            name="pw"
            value={formData.pw}
            onChange={handleChange}
            error={validationErrors.pw}
          />
        </InputGroup>

        <InputGroup>
          <Label>비밀번호 확인</Label>
          <AuthInput
            width="80%"
            placeholder="******"
            type="password"
            name="pwConfirm"
            value={formData.pwConfirm}
            onChange={handleChange}
            error={validationErrors.pwConfirm}
          />
        </InputGroup>

        <InputGroup>
          <Label>이메일</Label>
          <AuthInput
            width="80%"
            placeholder="ex) ijuju@gmail.com"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={validationErrors.email}
          />
        </InputGroup>

        <InputGroup>
          <Label>닉네임</Label>
          <AuthInput
            width="80%"
            name="username"
            placeholder="ex) 키앗"
            value={formData.username}
            onChange={handleChange}
            error={validationErrors.username}
          />
        </InputGroup>

        <InputGroup>
          <Label>생년월일</Label>
          <AuthInput
            width="80%"
            placeholder="ex) 20001123"
            name="birth"
            value={formData.birth}
            onChange={handleChange}
            error={validationErrors.birth}
          />
        </InputGroup>

        <InputGroup>
          <CheckboxContainer>
            <StyledCheckbox
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />
            <label htmlFor="terms">
              <TermsLink to="/terms">약관 및 정책</TermsLink>에 대해
              이해했습니다.
            </label>
          </CheckboxContainer>
          {validationErrors.terms && (
            <ErrorText>{validationErrors.terms}</ErrorText>
          )}
        </InputGroup>

        {error && <ErrorText>{error}</ErrorText>}

        <AuthButton width="80%" type="submit" disabled={isLoading}>
          {isLoading ? '회원가입 중...' : '회원가입'}
        </AuthButton>
      </Form>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        message="회원가입이 완료되었습니다!"
      />
    </>
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
  align-items: center;

  &:first-child {
    margin-top: -25px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #6f6f6f;
  width: 80%;
  text-align: left;
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
  appearance: none;
  width: 20px;
  height: 20px;
  border: 1px solid #50b498;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;

  &:checked {
    background-color: #50b498;
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

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  width: 80%;
  text-align: left;
`;
