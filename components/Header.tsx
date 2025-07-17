import React from 'react';
import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../theme/them';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  style?: ViewStyle;
  rightContent?: React.ReactNode;
}

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  margin-top: 56px;
`;

const LogoRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LogoImage = styled.Image`
  width: 48px;
  height: 48px;
  resize-mode: contain;
`;

const TitleBlock = styled.View`
  margin-left: 12px;
`;

const KunturTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.h1.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  color: ${({ theme }) => theme.colors.onPrimary};
  letter-spacing: 2px;
`;

const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  color: ${({ theme }) => theme.colors.onPrimary};
  opacity: 0.7;
  margin-top: 2px;
`;

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showLogo = true,
  style,
  rightContent,
}) => {
  const theme = useTheme();
  return (
    <HeaderContainer style={style}>
      <LogoRow>
        {showLogo && (
          <LogoImage source={require('../assets/images/icon.png')} />
        )}
        <TitleBlock>
          <KunturTitle>{title}</KunturTitle>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleBlock>
      </LogoRow>
      {rightContent}
    </HeaderContainer>
  );
}; 