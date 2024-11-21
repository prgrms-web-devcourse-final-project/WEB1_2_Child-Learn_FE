import styled from 'styled-components';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const AuthInput = ({ error, width, ...props }: AuthInputProps) => {
  return (
    <InputContainer>
      <StyledInput error={error} width={width} {...props} />
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const StyledInput = styled.input<AuthInputProps>`
  width: ${(props) => props.width || '100%'}; // width prop 사용
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  background-color: white; // 배경색 추가
  border: 1px solid ${(props) => (props.error ? '#ef4444' : '#e5e7eb')};
  transition: border-color 0.2s ease;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #50b498;
  }
`;
