import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

const CharacterPage = () => {
  return (
    <PageContainer>
      <h1>내 캐릭터 꾸미기</h1>
      <p>여기서 캐릭터를 꾸밀 수 있습니다.</p>
    </PageContainer>
  );
};

export default CharacterPage;
