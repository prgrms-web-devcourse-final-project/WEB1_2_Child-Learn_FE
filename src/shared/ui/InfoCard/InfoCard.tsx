import styled from 'styled-components';

interface InfoCardProps {
  title: string;
  description?: string;
  actionText?: string;
  iconSrc?: string;
  iconAlt?: string;
  onClick?: () => void;
  variant?: 'primary' | 'white';
}

export const InfoCard = ({
  title,
  description,
  actionText,
  iconSrc,
  iconAlt,
  onClick,
  variant = 'white',
}: InfoCardProps) => {
  return (
    <CardContainer $variant={variant} onClick={onClick}>
      <TextContent>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {actionText && (
          <ActionButton $variant={variant}>{actionText}</ActionButton>
        )}
      </TextContent>
      {iconSrc && <Icon src={iconSrc} alt={iconAlt || ''} />}
    </CardContainer>
  );
};

const CardContainer = styled.div<{ $variant: 'primary' | 'white' }>`
  background-color: ${({ $variant }) =>
    $variant === 'primary' ? '#50B498' : 'white'};
  padding: 24px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;
  border: ${({ $variant }) =>
    $variant === 'white' ? '1px solid #E5E7EB' : 'none'}; // 회색 테두리 추가
  box-shadow: ${({ $variant }) =>
    $variant === 'white' ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none'};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${({ $variant }) =>
      $variant === 'white' ? '#D1D5DB' : 'none'}; // hover 시 테두리 색상 변경
    box-shadow: ${({ $variant }) =>
      $variant === 'white'
        ? '0 8px 12px rgba(0, 0, 0, 0.1)'
        : '0 8px 12px rgba(0, 0, 0, 0.15)'};
  }
`;

const TextContent = styled.div`
  flex: 1;
`;

const Title = styled.p`
  font-weight: 500;
  font-size: 10px;
  margin-bottom: 4px;
  white-space: pre-line;
`;

const Description = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #181b1e;
  white-space: pre-line;
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'white' }>`
  background-color: ${({ $variant }) =>
    $variant === 'primary' ? 'white' : '#50B498'};
  color: ${({ $variant }) => ($variant === 'primary' ? '#50B498' : 'white')};
  border: none;
  padding: 8px 24px;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 12px;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 60px;
  height: 60px;
  margin-left: 10px;
`;
