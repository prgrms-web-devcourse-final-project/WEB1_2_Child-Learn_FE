// shared/ui/AuthButton.tsx
import styled from 'styled-components';

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const AuthButton = ({
  children,
  isLoading,
  width,
  ...props
}: AuthButtonProps) => {
  return (
    <ButtonContainer>
      <StyledButton
        disabled={isLoading || props.disabled}
        width={width}
        {...props}
      >
        {isLoading ? '로딩중...' : children}
      </StyledButton>
    </ButtonContainer>
  );
};

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  width?: string; // width prop 추가
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center; // 가로 중앙 정렬
  width: 100%;
`;

const StyledButton = styled.button<{ width?: string }>`
  width: ${(props) => props.width || '80%'}; // width prop 사용
  padding: 12px 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: white;
  background-color: #50b498;
  border: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
