import styled from 'styled-components';
import { UserInfo } from '@/entities/User/model/types';
import defaultProfileImg from '../../../../public/img/basic-profile.png';

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
          <JoinDate>가입일: {new Date(userInfo.createdAt).toLocaleDateString('ko-KR')}</JoinDate>
        </JoinDateWrapper>
      </ProfileInfo>
      <ProfileContainer>
        <ProfileImage src={defaultProfileImg} alt="프로필 이미지" />
        <EditProfileButton onClick={onEditClick}>회원 정보 수정</EditProfileButton>
      </ProfileContainer>
    </UserSection>
  );
};

export default Profile;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  margin-top: -40px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
  padding-left: 12px; // 왼쪽 여백 추가
`;

const Username = styled.h2`
  font-size: 30px;
  font-weight: 700;
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