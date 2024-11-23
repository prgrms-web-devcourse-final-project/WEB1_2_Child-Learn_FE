import styled from 'styled-components';

export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.variant === 'primary' ? '#1B63AB' : '#D75442'};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;
