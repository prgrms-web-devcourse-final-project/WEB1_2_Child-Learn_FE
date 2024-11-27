import styled from 'styled-components';
import { AuthButton } from '@/shared/ui/AuthButton/AuthButton';

interface ResetPasswordModalProps {
  onClose: () => void;
}

export const ResetPasswordModal = ({ onClose }: ResetPasswordModalProps) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>비밀번호 재설정 완료</ModalHeader>
        <Divider />
        <ModalBody>
          <Text>
            임시 비밀번호가
            <br /> 이메일로 발송되었습니다.
          </Text>
          <SubText>이메일을 확인하여 로그인해 주세요.</SubText>
        </ModalBody>
        <ModalFooter>
          <AuthButton type="button" onClick={onClose}>
            닫기
          </AuthButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
  margin: 20px;
  text-align: center;
  box-sizing: border-box;
`;

const ModalHeader = styled.h2`
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 700;
  padding-bottom: 3px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e5e5e5;
  margin: 0 5px 16px 5px;
`;

const ModalBody = styled.div`
  margin-bottom: 18px;
  font-size: 16px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
`;

const Text = styled.p`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
`;

const SubText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin: 0;
`;
