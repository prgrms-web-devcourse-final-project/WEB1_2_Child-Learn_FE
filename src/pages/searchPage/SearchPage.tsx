import styled from 'styled-components';
import { useState } from 'react';
import { SearchBar } from '@/shared/ui/SearchBar/SearchBar';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <ContentContainer>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <ResultsContainer>{/* 검색 결과 컴포넌트들 */}</ResultsContainer>
    </ContentContainer>
  );
};

export default SearchPage;

const ContentContainer = styled.div`
  padding: 20px;
`;

const ResultsContainer = styled.div`
  padding: 20px 0;
`;
