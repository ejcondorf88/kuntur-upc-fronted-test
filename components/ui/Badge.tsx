import React from 'react';
import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const BadgeContainer = styled.View<{
  variant: string;
  size: string;
}>`
  background-color: ${({ theme, variant }) => {
    switch (variant) {
      case 'success':
        return `${theme.colors.success}20`;
      case 'warning':
        return `${theme.colors.warning}20`;
      case 'error':
        return `${theme.colors.error}20`;
      case 'info':
        return `${theme.colors.info}20`;
      default:
        return `${theme.colors.textTertiary}20`;
    }
  }};
  
  border-width: 1px;
  border-color: ${({ theme, variant }) => {
    switch (variant) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.textTertiary;
    }
  }};
  
  padding: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return `${theme.spacing.xs}px ${theme.spacing.sm}px`;
      case 'large':
        return `${theme.spacing.sm}px ${theme.spacing.md}px`;
      default:
        return `${theme.spacing.xs}px ${theme.spacing.sm}px`;
    }
  }};
  
  border-radius: ${({ theme }) => theme.radius.full}px;
  align-items: center;
  justify-content: center;
  min-width: ${({ size }) => size === 'large' ? '80px' : '60px'};
`;

const BadgeText = styled.Text<{
  variant: string;
  size: string;
}>`
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 14;
      default:
        return 12;
    }
  }};
  font-weight: 600;
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  return (
    <BadgeContainer
      variant={variant}
      size={size}
      style={style}
    >
      <BadgeText
        variant={variant}
        size={size}
      >
        {label}
      </BadgeText>
    </BadgeContainer>
  );
}; 