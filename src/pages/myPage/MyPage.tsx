import styled from 'styled-components';

const MyPage = () => {
  return (
    <PageContainer>
      <ContentContainer>
        {/* 여기에 실제 컨텐츠가 들어갈 예정입니다 */}
      </ContentContainer>
    </PageContainer>
  );
};

export default MyPage;

// 스타일 컴포넌트
const PageContainer = styled.div`
  background: linear-gradient(
    to bottom,
    #def9c4 0%,
    #def9c4 40%,
    white 40%,
    white 100%
  );
  min-height: 100%;
  padding: 20px;
`;

const ContentContainer = styled.div`
  padding: 20px;
  position: relative;
  & > * {
    position: relative;
    z-index: 1;
  }
`;
