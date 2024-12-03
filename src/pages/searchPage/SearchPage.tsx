import styled from 'styled-components';
import { useState } from 'react';
import { SearchBar } from '@/shared/ui/SearchBar/SearchBar';
import {
  useSearchUsers,
  useSendFriendRequest,
} from '@/features/search/lib/queries';
import { useDebounce } from '@/features/search/lib/useDebounce';
import { SearchResultList } from '@/features/search/ui/SearchResultList';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 페이지 상태 추가
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: searchResults, isLoading } = useSearchUsers(
    debouncedSearch,
    currentPage,
    8
  ); // currentPage 전달
  const { mutate: sendFriendRequest, isPending } = useSendFriendRequest();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // 새로운 검색어 입력시 페이지 초기화
  };

  return (
    <ContentContainer>
      <PageTitle>전체 사용자 검색</PageTitle>
      <SearchBarWrapper>
        <SearchBar
          value={searchTerm}
          onChange={handleSearch} // 핸들러 함수로 변경
          placeholder="Search"
        />
      </SearchBarWrapper>
      <SearchResultList
        users={searchResults?.content || []}
        isLoading={isLoading}
        onFriendRequest={sendFriendRequest}
        isSending={isPending}
        currentPage={currentPage} // 페이지 props 추가
        totalPages={searchResults?.totalPages || 0} // 전체 페이지 수 전달
        onPageChange={setCurrentPage} // 페이지 변경 핸들러 전달
      />
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
