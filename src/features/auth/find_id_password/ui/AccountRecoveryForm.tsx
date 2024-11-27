import { useState } from 'react';
import styled from 'styled-components';
import { AuthInput } from '@/shared/ui/AuthInput/AuthInput';
import { AuthButton } from '@/shared/ui/AuthButton/AuthButton';
import { RecoveryTab, RecoveryFormData } from '../model/types';
import { useFindId, useResetPassword } from '../lib/queries';
import showToast from '@/shared/lib/toast';
import { MaskedIdModal } from './MaskedIdModal'; // 모달 컴포넌트 추가

interface AccountRecoveryFormProps {
  activeTab: RecoveryTab;
}

export const AccountRecoveryForm = ({
  activeTab,
}: AccountRecoveryFormProps) => {
  const [maskedId, setMaskedId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const findIdMutation = useFindId();
  const resetPasswordMutation = useResetPassword();

  const [formData, setFormData] = useState<RecoveryFormData>({
    birthday: '',
    email: '',
    loginId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'id') {
      if (formData.birthday.length !== 8) {
        showToast.error('생년월일을 8자리로 입력해주세요.');
        return;
      }

      const birth = `${formData.birthday.slice(0, 4)}-${formData.birthday.slice(4, 6)}-${formData.birthday.slice(6, 8)}`;

      findIdMutation.mutate(
        { email: formData.email, birth },
        {
          onSuccess: (data) => {
            if (data.loginId) {
              setMaskedId(data.loginId);
              setIsModalOpen(true);
            }
          },
        }
      );
    } else {
      resetPasswordMutation.mutate({
        loginId: formData.loginId,
        email: formData.email,
      });
    }
  };

  const isLoading = findIdMutation.isPending || resetPasswordMutation.isPending;

  return (
    <Form onSubmit={handleSubmit}>
      {activeTab === 'id' ? (
        <>
          <InputGroup>
            <Label>생년월일</Label>
            <AuthInput
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              width="80%"
              placeholder="ex) 19990417"
            />
          </InputGroup>

          <InputGroup>
            <Label>이메일</Label>
            <AuthInput
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              width="80%"
              placeholder="ex) lhj2778@email.com"
            />
          </InputGroup>
        </>
      ) : (
        <>
          <InputGroup>
            <Label>아이디</Label>
            <AuthInput
              name="loginId"
              value={formData.loginId}
              onChange={handleChange}
              width="80%"
              placeholder="ex) abc1234"
            />
          </InputGroup>

          <InputGroup>
            <Label>이메일</Label>
            <AuthInput
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              width="80%"
              placeholder="ex) lhj2778@email.com"
            />
          </InputGroup>
        </>
      )}

      <AuthButton
        type="submit"
        disabled={
          isLoading ||
          !formData.email ||
          (activeTab === 'id' ? !formData.birthday : !formData.loginId)
        }
      >
        {isLoading
          ? '처리중...'
          : activeTab === 'id'
            ? '아이디 찾기'
            : '비밀번호 찾기'}
      </AuthButton>

      {isModalOpen && (
        <MaskedIdModal
          maskedId={maskedId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  padding: 0 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #181818;
  margin-left: 4px;
  width: 80%;
  align-self: center;
`;
