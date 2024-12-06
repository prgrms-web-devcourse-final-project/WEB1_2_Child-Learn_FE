import styled from 'styled-components';
import { SearchBar } from '@/shared/ui/SearchBar/SearchBar';
import { FriendList } from '@/features/freind/ui/FriendList';
import { useFriendList, useRemoveFriend } from '@/features/freind/lib/quries';
import { useState } from 'react';

const FriendPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { friends, isLoading, hasMore, loadMore } = useFriendList(searchTerm);
  const { mutateAsync: removeFriend } = useRemoveFriend();

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
      <FriendList
        friends={friends}
        isLoading={isLoading}
        onRemoveFriend={removeFriend}
        hasMore={hasMore}
        onLoadMore={loadMore}
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