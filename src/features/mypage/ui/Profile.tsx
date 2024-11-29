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
  align-items: flex-start;  // 👈 center에서 flex-start로 변경하여 위로 정렬
  justify-content: space-between;
  gap: 12px;
  padding-top: 20px;
  margin-top: -40px;
  padding-left: 20px;  // 👈 전체 섹션에 왼쪽 패딩 추가
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-left: auto;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;
  padding-left: 0;
  margin-right: auto;
  margin-top: 0px;  // 👈 위로 올리기 위해 음수 마진 추가
  position: relative;  // 👈 추가
  left: -20px;  // 👈 더 왼쪽으로 이동
`;

const Username = styled.h2`
  font-size: 35px;
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