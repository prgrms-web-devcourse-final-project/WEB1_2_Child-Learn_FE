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
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: searchResults, isLoading } = useSearchUsers(debouncedSearch);
  const { mutate: sendFriendRequest, isPending } = useSendFriendRequest(); // isLoading -> isPending

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
      <SearchResultList
        users={searchResults?.content || []}
        isLoading={isLoading}
        onFriendRequest={sendFriendRequest}
        isSending={isPending} // isLoading -> isPending
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
