import styled from 'styled-components';
import { useState } from 'react';
import { SearchBar } from '@/shared/ui/SearchBar/SearchBar';

const FriendPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <ContentContainer>
      <PageTitle>친구 목록</PageTitle>
      <SearchBarWrapper>
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="친구 검색"
        />
      </SearchBarWrapper>
      {/* 여기에 친구 목록 컴포넌트들이 들어갈 예정입니다 */}
    </ContentContainer>
  );
};

export default FriendPage;

const ContentContainer = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 17px;
  font-weight: 700;
  margin-top: 5px;
  margin-bottom: 16px;
  color: #181818;
  text-align: center;
`;

const SearchBarWrapper = styled.div`
  margin-bottom: 24px;
`;