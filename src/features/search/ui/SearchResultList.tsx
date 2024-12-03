import styled from 'styled-components';
import { SearchedUser } from '../model/types';

interface SearchResultListProps {
  users: SearchedUser[];
  isLoading: boolean;
  onFriendRequest: (loginId: string) => void;
  isSending: boolean;
}

export const SearchResultList = ({
  users,
  isLoading,
  onFriendRequest,
  isSending,
}: SearchResultListProps) => {
  if (isLoading) {
    return <LoadingText>검색중...</LoadingText>;
  }

  if (users.length === 0) {
    return <NoResultText>검색 결과가 없습니다.</NoResultText>;
  }

  const renderFriendButton = (user: SearchedUser) => {
    if (user.isFriend) {
      return <FriendLabel>친구</FriendLabel>;
    }

    switch (user.requestStatus) {
      case 'PENDING':
        return <PendingButton disabled>친구 요청중</PendingButton>;
      case 'REJECTED':
      case undefined:
        return (
          <AddFriendButton
            onClick={() => onFriendRequest(user.loginId)}
            disabled={isSending}
          >
            친구 추가
          </AddFriendButton>
        );
    }
  };

  return (
    <ResultsContainer>
      {users.map((user) => (
        <UserItem key={user.id}>
          <UserInfoWrapper>
            <ProfileImage
              src={user.profileImage || '/img/basic-profile.png'}
              alt="프로필"
            />
            <UserInfo>
              <UserName>{user.username}</UserName>
              <UserLoginId>{user.loginId}</UserLoginId>
            </UserInfo>
          </UserInfoWrapper>
          {renderFriendButton(user)}
        </UserItem>
      ))}
    </ResultsContainer>
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
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  border-radius: 20px;
  border: none;
  background-color: #6cc2a1;
  color: white;
  font-size: 14px;
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

const FriendLabel = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  background-color: #e8e8e8;
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

const PendingButton = styled(AddFriendButton)`
  background-color: #ffb74d;

  &:disabled {
    background-color: #ffb74d;
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default SearchResultList;
