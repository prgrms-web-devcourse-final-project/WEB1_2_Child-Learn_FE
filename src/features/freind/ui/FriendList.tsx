import { useState, useRef, useEffect } from 'react';
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
  const [slideId, setSlideId] = useState<number | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState<number | null>(null);

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

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent, friendId: number) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    
    // 다른 항목이 슬라이드된 상태라면 닫기
    if (slideId && slideId !== friendId) {
      setSlideId(null);
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent, friendId: number) => {
    if (!startX) return;
    
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = startX - currentX;

    if (diff > 50) {
      setSlideId(friendId);
    } else if (diff < -50) {
      setSlideId(null);
    }
  };

  const handleDragEnd = () => {
    setStartX(null);
  };

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
          <UserItemWrapper key={friend.id}>
            <UserItem
              onMouseDown={(e) => handleDragStart(e, friend.id)}
              onMouseMove={(e) => handleDragMove(e, friend.id)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => handleDragStart(e, friend.id)}
              onTouchMove={(e) => handleDragMove(e, friend.id)}
              onTouchEnd={handleDragEnd}
              $isSlided={slideId === friend.id}
            >
              <UserInfoWrapper>
                <ProfileWrapper>
                  <ProfileImage
                    src={friend.profileImage || '/img/basic-profile.png'}
                    alt="프로필"
                  />
                  {friend.active && <ActiveIndicator />}
                </ProfileWrapper>
                <UserInfo>
                  <UserName>{friend.username}</UserName>
                  <UserLoginId>{friend.loginId}</UserLoginId>
                </UserInfo>
              </UserInfoWrapper>
              <MessageButton>
                <MessageCircle size={16} />
                <span>메시지</span>
              </MessageButton>
            </UserItem>
            <DeleteButtonWrapper $isVisible={slideId === friend.id}>
              <DeleteButton 
                onClick={async () => {
                  await onRemoveFriend(friend.id);
                  setSlideId(null);
                }}
              >
                삭제
              </DeleteButton>
            </DeleteButtonWrapper>
          </UserItemWrapper>
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
  padding: 5px 0;
`;

const UserItem = styled.div<{ $isSlided: boolean }>`
  min-height: 65px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  transform: translateX(${props => props.$isSlided ? '-80px' : '0'});
  transition: transform 0.3s ease-out;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px; 
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
  width: 80px;
  height: 100%;
  background-color: #ff6b6b;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #ff5252;
  }
`;

const DeleteButtonWrapper = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  transform: translateX(${props => props.$isVisible ? '0' : '100%'});
  transition: transform 0.3s ease-out;
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

const ProfileWrapper = styled.div`
  position: relative;
  width: 45px;
  height: 45px;
`;

const ActiveIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #6cc2a1;
  border: 2px solid white;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const UserItemWrapper = styled.div`
  position: relative;
  overflow: hidden;
  touch-action: pan-y pinch-zoom;
  user-select: none;
`;

export default FriendList;