import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Animated, Pressable, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../theme/them';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const CardContainer = styled.View<{
  variant: string;
  padding: string;
  margin: string;
}>`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  
  padding: ${({ theme, padding }) => {
    switch (padding) {
      case 'none': return '0px';
      case 'small': return `${theme.spacing.sm}px`;
      case 'large': return `${theme.spacing.lg}px`;
      default: return `${theme.spacing.md}px`;
    }
  }};
  
  margin: ${({ theme, margin }) => {
    switch (margin) {
      case 'none': return '0px';
      case 'small': return `${theme.spacing.sm}px`;
      case 'large': return `${theme.spacing.lg}px`;
      default: return `${theme.spacing.md}px`;
    }
  }};
  
  border-width: ${({ variant }) => variant === 'outlined' ? '1px' : '0px'};
  border-color: ${({ theme, variant }) => 
    variant === 'outlined' ? theme.colors.border : 'transparent'
  };
  
  shadow-color: ${({ theme }) => theme.colors.cardShadow};
  shadow-offset: ${({ variant }) => 
    variant === 'elevated' ? '0px 8px' : '0px 2px'
  };
  shadow-opacity: ${({ variant }) => 
    variant === 'elevated' ? 0.15 : 0.08
  };
  shadow-radius: ${({ variant }) => 
    variant === 'elevated' ? 16 : 8
  };
  elevation: ${({ variant }) => 
    variant === 'elevated' ? 12 : 4
  };
`;

const GradientCard = styled(LinearGradient)`
  flex: 1;
  border-radius: ${({ theme }) => theme.radius.lg}px;
`;

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'medium',
  style,
}) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(4)).current;

  const animateIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 30,
        bounciness: 6,
      }),
      Animated.timing(shadowAnim, {
        toValue: 12,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };
  const animateOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 30,
        bounciness: 6,
      }),
      Animated.timing(shadowAnim, {
        toValue: 4,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    shadowRadius: shadowAnim,
    elevation: shadowAnim,
  };

  if (variant === 'elevated') {
    return (
      <Pressable onPressIn={animateIn} onPressOut={animateOut} style={style}>
        <Animated.View style={animatedStyle}>
          <GradientCard
            colors={theme.colors.kunturGradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: theme.radius.lg }}
          >
            <CardContainer
              variant={variant}
              padding={padding}
              margin={margin}
              style={[{ backgroundColor: 'transparent', shadowOpacity: 0.18, elevation: 12 }, style]}
            >
              {children}
            </CardContainer>
          </GradientCard>
        </Animated.View>
      </Pressable>
    );
  }
  return (
    <Pressable onPressIn={animateIn} onPressOut={animateOut} style={style}>
      <Animated.View style={animatedStyle}>
        <CardContainer
          variant={variant}
          padding={padding}
          margin={margin}
          style={style}
        >
          {children}
        </CardContainer>
      </Animated.View>
    </Pressable>
  );
}; 