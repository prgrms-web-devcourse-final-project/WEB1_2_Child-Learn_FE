import styled from 'styled-components';
import { RecoveryTab } from '../model/types';

interface AccountRecoveryTabsProps {
  activeTab: RecoveryTab;
  onTabChange: (tab: RecoveryTab) => void;
}

export const AccountRecoveryTabs = ({
  activeTab,
  onTabChange,
}: AccountRecoveryTabsProps) => {
  return (
    <TabContainer>
      <Tab
        $active={activeTab === 'id'} // active를 $active로 변경
        onClick={() => onTabChange('id')}
        type="button"
      >
        아이디 찾기
      </Tab>
      <Tab
        $active={activeTab === 'password'} // active를 $active로 변경
        onClick={() => onTabChange('password')}
        type="button"
      >
        비밀번호 찾기
      </Tab>
    </TabContainer>
  );
};

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0;
  margin: 0 0 40px;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
`;

// $를 앞에 붙여서 실제 DOM 속성으로 전달되지 않도록 함
const Tab = styled.button<{ $active: boolean }>`
  // active를 $active로 변경
  flex: 1;
  padding: 12px 16px;
  background-color: ${(props) => (props.$active ? '#50b498' : 'transparent')};
  color: ${(props) => (props.$active ? '#ffffff' : '#50b498')};
  border: none;
  font-size: 15px;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  cursor: pointer;

  &:first-child {
    border-radius: 10px 0 0 10px;
  }

  &:last-child {
    border-radius: 0 10px 10px 0;
  }

  &:hover {
    opacity: 0.9;
  }
`;
