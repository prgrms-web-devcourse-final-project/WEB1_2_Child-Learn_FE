import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { MessageCircle } from 'lucide-react';
import { Friend } from '@/features/freind/model/types';

interface FriendListProps {
  friends: Friend[];
  isLoading: boolean;
  onRemoveFriend: (friendId: number) => Promise<void>;
  hasMore?: boolean;
  onLoadMore?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const FriendList = ({
  friends,
  isLoading,
  onRemoveFriend,
  hasMore,
  onLoadMore,
  currentPage = 0,
  totalPages = 0,
  onPageChange,
}: FriendListProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

  if (isLoading && friends.length === 0) {
    return (
      <EmptyStateWrapper>
        <LoadingText>친구 목록을 불러오는 중...</LoadingText>
      </EmptyStateWrapper>
    );
  }

  if (!isLoading && friends.length === 0) {
    return (
      <EmptyStateWrapper>
        <EmptyText>아직 친구가 없습니다.</EmptyText>
        <EmptySubText>새로운 친구를 추가해보세요!</EmptySubText>
      </EmptyStateWrapper>
    );
  }

  return (
    <Wrapper>
      <ListContainer>
        {friends.map((friend) => (
          <UserItem key={friend.id}>
            <UserInfoWrapper>
              <ProfileImage
                src={friend.profileImage || '/img/basic-profile.png'}
                alt="프로필"
              />
              <UserInfo>
                <NameWrapper>
                  <UserName>{friend.username}</UserName>
                  <ActiveStatus $isActive={friend.active}>
                    {friend.active ? '접속중' : '미접속'}
                  </ActiveStatus>
                </NameWrapper>
                <UserLoginId>{friend.loginId}</UserLoginId>
              </UserInfo>
            </UserInfoWrapper>
            <ButtonsWrapper>
              <MessageButton>
                <MessageCircle size={16} />
                <span>메시지</span>
              </MessageButton>
              <DeleteButton onClick={() => onRemoveFriend(friend.id)}>
                삭제
              </DeleteButton>
            </ButtonsWrapper>
          </UserItem>
        ))}
        {hasMore && <LoadingTarget ref={observerTarget} />}
      </ListContainer>

      {totalPages > 1 && onPageChange && (
        <Pagination>
          <NavigationButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            이전
          </NavigationButton>
          <PageNumber>{currentPage + 1} / {totalPages}</PageNumber>
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

const Wrapper = styled.div`
  position: relative;
`;

const ListContainer = styled.div`
  height: 590px;
  overflow-y: auto;
`;

const UserItem = styled.div`
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
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
  gap: 4px;
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

const ActiveStatus = styled.span<{ $isActive: boolean }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: ${props => props.$isActive ? '#6cc2a1' : '#666'};
  color: white;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const MessageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
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

  span {
    margin-left: 4px;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  border-radius: 30px;
  border: none;
  background-color: #ff6b6b;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff5252;
  }
`;

const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 590px;
  padding: 20px;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #666;
  font-size: 15px;
`;

const EmptyText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const EmptySubText = styled.p`
  font-size: 14px;
  color: #666;
`;

const LoadingTarget = styled.div`
  height: 20px;
  width: 100%;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  margin-top: 8px;
`;

const PageNumber = styled.span`
  color: #666;
  font-size: 14px;
  min-width: 60px;
  text-align: center;
`;

const NavigationButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f5f5f5;
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }
`;

export default FriendList;