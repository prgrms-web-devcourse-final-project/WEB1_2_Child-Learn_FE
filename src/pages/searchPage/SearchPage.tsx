import styled from 'styled-components';
import { useState } from 'react';
import { SearchBar } from '@/shared/ui/SearchBar/SearchBar';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <ContentContainer>
      <PageTitle>전체 사용자 검색</PageTitle>
      <SearchBarWrapper>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search"
        />
      </SearchBarWrapper>
      <ResultsContainer>{/* 검색 결과 컴포넌트들 */}</ResultsContainer>
    </ContentContainer>
  );
};

export default SearchPage;

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

const ResultsContainer = styled.div`
  padding: 20px 0;
`;
