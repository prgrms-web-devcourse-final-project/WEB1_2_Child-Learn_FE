import styled from 'styled-components';
import { SearchedUser } from '@/features/search/model/types';

interface SearchResultListProps {
  users: SearchedUser[];
  isLoading: boolean;
  onFriendRequest: (receiverId: number) => void; // string -> number
  isSending: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const SearchResultList = ({
  users,
  isLoading,
  onFriendRequest,
  isSending,
  currentPage,
  totalPages,
  onPageChange,
}: SearchResultListProps) => {
  if (isLoading) {
    return <LoadingText>검색중...</LoadingText>;
  }

  if (users.length === 0) {
    return <NoResultText>검색 결과가 없습니다.</NoResultText>;
  }

  const renderFriendButton = (user: SearchedUser) => {
    switch (user.friendshipStatus) {
      case 'FRIEND':
        return null;
      case 'PENDING':
        return <PendingButton disabled>요청중...</PendingButton>;
      case 'NOT_FRIEND':
        return (
          <AddFriendButton
            onClick={() => onFriendRequest(user.id)} // loginId -> id로 변경
            disabled={isSending}
          >
            친구 추가
          </AddFriendButton>
        );
    }
  };

  const renderPageButtons = () => {
    const pages = [];

    if (totalPages <= 5) {
      // 5페이지 이하면 모든 페이지 표시
      for (let i = 0; i < totalPages; i++) {
        pages.push(
          <PageButton
            key={i}
            onClick={() => onPageChange(i)}
            $active={currentPage === i}
          >
            {i + 1}
          </PageButton>
        );
      }
    } else {
      // 첫 페이지
      pages.push(
        <PageButton
          key={0}
          onClick={() => onPageChange(0)}
          $active={currentPage === 0}
        >
          1
        </PageButton>
      );

      // 현재 페이지가 처음이나 끝에 가까우면 생략 부호 한 번만 표시
      if (currentPage <= 2) {
        // 현재 페이지가 앞쪽에 있는 경우
        for (let i = 1; i <= 2; i++) {
          pages.push(
            <PageButton
              key={i}
              onClick={() => onPageChange(i)}
              $active={currentPage === i}
            >
              {i + 1}
            </PageButton>
          );
        }
        pages.push(<EllipsisSpan key="ellipsis">...</EllipsisSpan>);
      } else if (currentPage >= totalPages - 3) {
        // 현재 페이지가 뒤쪽에 있는 경우
        pages.push(<EllipsisSpan key="ellipsis">...</EllipsisSpan>);
        for (let i = totalPages - 3; i <= totalPages - 2; i++) {
          pages.push(
            <PageButton
              key={i}
              onClick={() => onPageChange(i)}
              $active={currentPage === i}
            >
              {i + 1}
            </PageButton>
          );
        }
      } else {
        // 현재 페이지가 중간에 있는 경우
        pages.push(<EllipsisSpan key="ellipsis1">...</EllipsisSpan>);
        pages.push(
          <PageButton
            key={currentPage}
            onClick={() => onPageChange(currentPage)}
            $active={true}
          >
            {currentPage + 1}
          </PageButton>
        );
        pages.push(<EllipsisSpan key="ellipsis2">...</EllipsisSpan>);
      }

      // 마지막 페이지
      pages.push(
        <PageButton
          key={totalPages - 1}
          onClick={() => onPageChange(totalPages - 1)}
          $active={currentPage === totalPages - 1}
        >
          {totalPages}
        </PageButton>
      );
    }

    return pages;
  };

  return (
    <Wrapper>
      <ListContainer>
        <ResultsContainer>
          {users.map((user) => (
            <UserItem key={user.id}>
              <UserInfoWrapper>
                <ProfileImage
                  src={user.profileImage || '/img/basic-profile.png'}
                  alt="프로필"
                />
                <UserInfo>
                  <NameWrapper>
                    <UserName>{user.username}</UserName>
                    {user.friendshipStatus === 'FRIEND' && ( // isFriend 대신 friendshipStatus 체크
                      <FriendIcon src="/img/friend-mark.png" alt="친구" />
                    )}
                  </NameWrapper>
                  <UserLoginId>{user.loginId}</UserLoginId>
                </UserInfo>
              </UserInfoWrapper>
              {renderFriendButton(user)}
            </UserItem>
          ))}
        </ResultsContainer>
      </ListContainer>

      {totalPages > 1 && (
        <Pagination>
          <NavigationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            이전
          </NavigationButton>

          {renderPageButtons()}

          <NavigationButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            다음
          </NavigationButton>
        </Pagination>
      )}
    </Wrapper>
  );
};

const ResultsContainer = styled.div`
  padding: 5px 0;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #666;
  padding: 20px 0;
`;

const UserItem = styled.div`
  min-height: 65px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 700;
  color: #181818;
  font-size: 16px;
`;

const UserLoginId = styled.span`
  color: #666;
  font-size: 12px;
`;

const AddFriendButton = styled.button`
  padding: 8px 16px;
  border-radius: 30px;
  border: none;
  background-color: #6cc2a1;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5ba88d;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const NoResultText = styled.p`
  text-align: center;
  color: #666;
  padding: 200px 0;
  font-size: 15px;
  font-weight: 500;
`;

const PendingButton = styled(AddFriendButton)`
  background-color: #666;

  &:disabled {
    background-color: #666;
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Wrapper = styled.div`
  position: relative;
`;

const ListContainer = styled.div`
  height: 590px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 12px 0;
  margin-top: 8px;
`;

const EllipsisSpan = styled.span`
  padding: 0 8px;
  color: #666;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: ${(props) => (props.$active ? '#6cc2a1' : 'white')};
  color: ${(props) => (props.$active ? 'white' : '#333')};
  cursor: pointer;
  font-size: 12px;
  min-width: 28px;
  height: 28px;
  line-height: 1;

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$active ? '#5ba88d' : '#f5f5f5')};
  }
`;

const NavigationButton = styled(PageButton)`
  font-size: 11px;
  padding: 4px 8px;
  min-width: 40px;
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FriendIcon = styled.img`
  width: 20px;
  height: 20px;
`;

export default SearchResultList;
