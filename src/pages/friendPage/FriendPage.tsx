import { useState } from 'react';
import styled from 'styled-components';
import { SearchBar } from '@/shared/ui/SearchBar/SearchBar';
import { FriendList } from '@/features/freind/ui/FriendList';
import { useFriendList, useRemoveFriend } from '@/features/freind/lib/quries';
import { useDebounce } from '@/features/search/lib/useDebounce';

const FriendPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, isLoading } = useFriendList(debouncedSearchTerm, currentPage);
  const removeFriendMutation = useRemoveFriend();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <FriendList
        friends={data?.content ?? []}
        isLoading={isLoading}
        onRemoveFriend={removeFriendMutation.mutateAsync}
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 0}
        onPageChange={handlePageChange}
      />
    </ContentContainer>
  );
};

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

export default FriendPage;