import { useState } from 'react';
import styled from 'styled-components';
import { AccountRecoveryTabs } from '@/features/auth/find_id_password/ui/AccountRecoveryTabs';
import { AccountRecoveryForm } from '@/features/auth/find_id_password/ui/AccountRecoveryForm';
import { RecoveryTab } from '@/features/auth/find_id_password/model/types';
import { useNavigate } from 'react-router-dom'; // 추가

export const AccountRecoveryPage = () => {
  const [activeTab, setActiveTab] = useState<RecoveryTab>('id');

  const navigate = useNavigate(); // 추가

  const handleBack = () => {
    navigate(-1); // 브라우저의 히스토리에서 한 단계 뒤로 이동
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <BackButton onClick={handleBack}>
          <img src="/img/out.png" alt="뒤로가기" />
        </BackButton>
        <ContentContainer>
          <AccountRecoveryTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <AccountRecoveryForm activeTab={activeTab} />
        </ContentContainer>
      </ContentWrapper>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  height: 100%; // 100vh에서 100%로 변경
  display: flex;
  flex-direction: column;
  background-color: #def9c4;
  overflow: hidden;
`;

const BackButton = styled.button`
  position: absolute;
  left: 20px;
  top: 20px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 60%;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 0 20px;
`;

export default AccountRecoveryPage;
