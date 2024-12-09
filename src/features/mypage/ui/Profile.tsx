import styled from 'styled-components';
import { UserInfo } from '@/entities/User/model/types';
import defaultProfileImg from '/public/img/basic-profile.png';
import UserPoints from '@/features/mypage/ui/UserPoints';

interface ProfileProps {
  userInfo: UserInfo;
  onEditClick: () => void;
}

const Profile = ({ userInfo, onEditClick }: ProfileProps) => {
  return (
    <UserSection>
      <ProfileInfo>
        <Username>{userInfo.username}</Username>
        <UserID>{userInfo.loginId}</UserID>
        <JoinDateWrapper>
          <ClockIcon src="/img/clock.png" alt="clock" />
          <JoinDate>
            가입일: {new Date(userInfo.createdAt).toLocaleDateString('ko-KR')}
          </JoinDate>
        </JoinDateWrapper>
      </ProfileInfo>
      <ProfileContainer>
        <ProfileImage src={defaultProfileImg} alt="프로필 이미지" />
        <EditProfileButton onClick={onEditClick}>
          회원 정보 수정
        </EditProfileButton>
      </ProfileContainer>
      <PointsWrapper>
        <UserPoints
          coins={userInfo.currentCoins ?? 0}
          points={userInfo.currentPoints ?? 0}
        />
      </PointsWrapper>
    </UserSection>
  );
};

export default Profile;

const UserSection = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
  margin-top: -40px;
  position: relative;
  width: 100%;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 80px;
  margin-right: -16px; // 오른쪽으로 더 이동
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
  width: calc(100% - 120px);
  margin-top: 0px;
  padding-left: 0;
  padding-right: 40px;
  margin-left: -20px;
`;

const Username = styled.h2`
  font-size: 28px;
  font-weight: 500;
  margin: 0;
  color: #181818;
`;

const UserID = styled.p`
  font-size: 14px;
  color: #666;
`;

const JoinDateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ClockIcon = styled.img`
  width: 12px;
  height: 12px;
`;

const JoinDate = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #181818;
  margin-top: 1px;
`;

const EditProfileButton = styled.button`
  font-size: 10px;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 4px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const PointsWrapper = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 120px; // 30px에서 80px로 늘림
`;
