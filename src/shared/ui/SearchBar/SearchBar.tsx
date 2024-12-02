import styled from 'styled-components';
import searchIcon from '/public/img/search.png'; // 돋보기 아이콘 추가 필요

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search',
}: SearchBarProps) => {
  return (
    <SearchContainer>
      <SearchIcon src={searchIcon} alt="검색" />
      <SearchInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 25px;
  padding: 0 16px;
  gap: 8px;
`;

const SearchIcon = styled.img`
  width: 17px;
  height: 17px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 0;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 500;
  margin-left: 8px;
  color: #181818;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
  }
`;
