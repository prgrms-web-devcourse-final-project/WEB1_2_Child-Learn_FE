import styled from 'styled-components';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  width?: string;
}

export const AuthInput = ({ error, width, ...props }: AuthInputProps) => {
  return (
    <InputContainer width={width}>
      <StyledInput error={error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

const InputContainer = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;
  width: ${(props) => props.width || '100%'};
  gap: 4px;
`;

const StyledInput = styled.input<{ error?: string }>`
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
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

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 12px;
  text-align: left;
`;
