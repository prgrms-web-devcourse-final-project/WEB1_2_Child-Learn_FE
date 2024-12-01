export { default as AdvancedTradePage } from './AdvancedTradePage';
import styled from 'styled-components';

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #E8F3F1;  // 연한 민트색 배경
  padding: 15px;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
`;

export const OutButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  
  img {
    width: 24px;
    height: 24px;
  }
`;