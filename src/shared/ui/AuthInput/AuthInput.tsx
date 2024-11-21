import styled from 'styled-components';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  width?: string; // width prop 추가
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
  width: ${(props) => props.width || '100%'};
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #000000; // 글자 색상 추가
  background-color: white;
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
