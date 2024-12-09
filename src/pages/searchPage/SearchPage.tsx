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
  const [currentPage, setCurrentPage] = useState(0);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: searchResults, isLoading } = useSearchUsers(
    debouncedSearch,
    currentPage,
    8
  );

  const { mutate: sendFriendRequest, isPending } = useSendFriendRequest();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  return (
    <ContentContainer>
      <PageTitle>전체 사용자 검색</PageTitle>
      <SearchBarWrapper>
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search"
        />
      </SearchBarWrapper>
      <SearchResultList
        users={searchResults?.content || []}
        isLoading={isLoading}
        onFriendRequest={(receiverUsername: string) => {
          const user = searchResults?.content.find(
            (user) => user.username === receiverUsername
          );
          if (user) {
            sendFriendRequest({
              receiverId: user.id,
              receiverUsername,
            });
          }
        }}
        isSending={isPending}
        currentPage={currentPage}
        totalPages={searchResults?.totalPages || 0}
        onPageChange={setCurrentPage}
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
