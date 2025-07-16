import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../theme/them';

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

const GradientBadge = styled(LinearGradient)`
  flex: 1;
  border-radius: ${({ theme }) => theme.radius.full}px;
`;

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 6,
      }),
    ]).start();
  }, []);
  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };
  // Definir colores de gradiente para cada variante
  const getGradient = () => {
    switch (variant) {
      case 'success':
        return [theme.colors.success, theme.colors.accent] as [string, string];
      case 'warning':
        return [theme.colors.warning, theme.colors.accent] as [string, string];
      case 'error':
        return [theme.colors.error, theme.colors.accent] as [string, string];
      case 'info':
        return [theme.colors.info, theme.colors.accent] as [string, string];
      default:
        return [theme.colors.textTertiary, theme.colors.surface] as [string, string];
    }
  };
  if (variant !== 'default') {
    return (
      <Animated.View style={animatedStyle}>
        <GradientBadge
          colors={getGradient()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: theme.radius.full }}
        >
          <BadgeContainer
            variant={variant}
            size={size}
            style={[{ backgroundColor: 'transparent', shadowColor: theme.colors.border, shadowOpacity: 0.12, elevation: 2 }, style]}
          >
            <BadgeText
              variant={variant}
              size={size}
              style={{ textShadowColor: '#0002', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
            >
              {label}
            </BadgeText>
          </BadgeContainer>
        </GradientBadge>
      </Animated.View>
    );
  }
  return (
    <Animated.View style={animatedStyle}>
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
    </Animated.View>
  );
}; 