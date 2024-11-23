import styled from 'styled-components';

interface MenuCardProps {
  title: string;
  bgColor: string;
  iconSrc: string;
  iconAlt: string;
  onClick?: () => void;
  extended?: boolean;
}

export const MenuCard = ({
  title,
  bgColor,
  iconSrc,
  iconAlt,
  onClick,
}: MenuCardProps) => {
  return (
    <CardContainer $bgColor={bgColor} onClick={onClick}>
      <CardText>{title}</CardText>
      <CardIcon src={iconSrc} alt={iconAlt} />
    </CardContainer>
  );
};

const adjustColor = (color: string, amount: number) => {
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return [r, g, b];
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = Math.min(255, x).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  };

  const [r, g, b] = hexToRgb(color);
  return rgbToHex(
    Math.min(r + amount, 255),
    Math.min(g + amount, 255),
    Math.min(b + amount, 255)
  );
};

const CardContainer = styled.div<{ $bgColor: string }>`
  background: linear-gradient(
    -45deg,
    ${(props) => adjustColor(props.$bgColor, 30)} 0%,
    ${(props) => adjustColor(props.$bgColor, 15)} 30%,
    ${(props) => props.$bgColor} 50%,
    ${(props) => adjustColor(props.$bgColor, -15)} 70%,
    ${(props) => adjustColor(props.$bgColor, -30)} 100%
  );
  padding: 20px;
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardText = styled.p`
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  color: #ffffff;
  white-space: pre-line;
`;

const CardIcon = styled.img`
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 35px;
  height: 35px;
`;
