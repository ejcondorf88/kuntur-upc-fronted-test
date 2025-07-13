import React from 'react';
import { ActivityIndicator, TextStyle, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../theme/them';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const ButtonContainer = styled.TouchableOpacity<{
  variant: string;
  size: string;
  disabled: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.full}px;
  padding: ${({ theme, size }) => 
    size === 'small' ? `${theme.spacing.sm}px ${theme.spacing.md}px` :
    size === 'large' ? `${theme.spacing.lg}px ${theme.spacing.xl}px` :
    `${theme.spacing.md}px ${theme.spacing.lg}px`
  };
  
  background-color: ${({ theme, variant, disabled }) => {
    if (disabled) return theme.colors.textTertiary;
    
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  }};
  
  border-width: ${({ variant }) => variant === 'outline' ? '2px' : '0px'};
  border-color: ${({ theme, variant }) => 
    variant === 'outline' ? theme.colors.primary : 'transparent'
  };
  
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  
  shadow-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary : 'transparent'
  };
  shadow-offset: 0px 4px;
  shadow-opacity: ${({ variant }) => variant === 'primary' ? 0.3 : 0};
  shadow-radius: 8px;
  elevation: ${({ variant }) => variant === 'primary' ? 6 : 0};
`;

const ButtonText = styled.Text<{
  variant: string;
  size: string;
  disabled: boolean;
}>`
  font-size: ${({ theme, size }) => 
    size === 'small' ? theme.typography.caption.fontSize :
    size === 'large' ? 18 : theme.typography.button.fontSize
  };
  font-weight: ${({ theme }) => theme.typography.button.fontWeight};
  color: ${({ theme, variant, disabled }) => {
    if (disabled) return theme.colors.onPrimary;
    
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.colors.onPrimary;
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.onPrimary;
    }
  }};
  text-align: center;
  letter-spacing: ${({ theme }) => theme.typography.button.letterSpacing};
  margin-left: ${({ theme }) => theme.spacing.xs}px;
`;

const IconContainer = styled.View`
  margin-right: ${({ theme }) => theme.spacing.xs}px;
`;

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  return (
    <ButtonContainer
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onPress={onPress}
      style={style}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : theme.colors.primary} 
        />
      ) : (
        <>
          {icon && <IconContainer>{icon}</IconContainer>}
          <ButtonText 
            variant={variant} 
            size={size} 
            disabled={disabled}
            style={textStyle}
          >
            {title}
          </ButtonText>
        </>
      )}
    </ButtonContainer>
  );
}; 