import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { AuthInput } from '@/shared/ui/AuthInput/AuthInput';
import { AuthButton } from '@/shared/ui/AuthButton/AuthButton';
import { Link, useNavigate } from 'react-router-dom';
import { useJoin } from '@/features/auth/signup/lib/useJoin';
import { joinValidation } from '@/features/auth/signup/model/validation';
import { SuccessModal } from '@/features/auth/signup/ui/SuccessModal';

const formatBirth = (birth: string) => {
  if (birth.length !== 8) return birth;
  const year = birth.substring(0, 4);
  const month = birth.substring(4, 6);
  const day = birth.substring(6, 8);
  return `${year}-${month}-${day}`;
};

export const SignUpForm = () => {
  const navigate = useNavigate();
  // fieldErrors 추가
  const { handleJoin, isLoading, error, fieldErrors } = useJoin();
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

  // useEffect 추가: fieldErrors가 변경되면 validationErrors에 반영
  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) {
      setValidationErrors((prev) => ({
        ...prev,
        ...fieldErrors,
      }));
    }
  }, [fieldErrors]);

  const validateField = (name: string, value: string) => {
    if (name === 'pwConfirm') {
      return formData.pw !== value ? '비밀번호가 일치하지 않습니다.' : '';
    }

    const validation = joinValidation[name as keyof typeof joinValidation];
    if (!validation) return '';

    if (!value && validation.required) {
      return validation.required;
    }

    // 이메일 최대 길이 체크 추가
    if (name === 'email' && value.length > 50) {
      return '이메일은 최대 50자까지 가능합니다.';
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
      // 입력 값이 변경되면 해당 필드의 서버 에러 메시지를 초기화
      setValidationErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));

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

    if (!formData.terms) {
      setValidationErrors((prev) => ({
        ...prev,
        terms: '약관에 동의해주세요.',
      }));
      return;
    }

    const errors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'terms' && key !== 'pwConfirm') {
        const error = validateField(key, String(value));
        if (error) errors[key] = error;
      }
    });

    if (formData.pw !== formData.pwConfirm) {
      errors.pwConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const submitData = {
      loginId: formData.loginId,
      pw: formData.pw,
      username: formData.username,
      email: formData.email,
      birth: formatBirth(formData.birth),
    };

    try {
      await handleJoin(submitData);
      setShowSuccessModal(true);
    } catch (error) {
      // fieldErrors와 일반 error는 useJoin에서 처리됨
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
            placeholder="ex) 19990417"
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

export default SignUpForm;
