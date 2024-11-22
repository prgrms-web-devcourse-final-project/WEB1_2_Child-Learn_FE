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
  variant = 'white'
}: InfoCardProps) => {
  return (
    <CardContainer $variant={variant} onClick={onClick}>
      <TextContent>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {actionText && <ActionButton $variant={variant}>{actionText}</ActionButton>}
      </TextContent>
      {iconSrc && <Icon src={iconSrc} alt={iconAlt || ''} />}
    </CardContainer>
  );
};

const CardContainer = styled.div<{ $variant: 'primary' | 'white' }>`
  background-color: ${({ $variant }) => $variant === 'primary' ? '#50B498' : 'white'};
  padding: 20px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;
  box-shadow: ${({ $variant }) => $variant === 'white' ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none'};
`;

const TextContent = styled.div`
  flex: 1;
`;

const Title = styled.p`
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 4px;
  white-space: pre-line;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  white-space: pre-line;
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'white' }>`
  background-color: ${({ $variant }) => $variant === 'primary' ? 'white' : '#50B498'};
  color: ${({ $variant }) => $variant === 'primary' ? '#50B498' : 'white'};
  border: none;
  padding: 8px 24px;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 12px;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
  margin-left: 16px;
`;