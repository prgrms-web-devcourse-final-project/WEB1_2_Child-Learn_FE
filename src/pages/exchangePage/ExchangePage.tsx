import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const ExchangePage = () => {
  return (
    <PageContainer>
      <h1>환전하기</h1>
      <p>여기서 포인트를 코인으로 환전할 수 있습니다.</p>
    </PageContainer>
  );
};

export default ExchangePage;
