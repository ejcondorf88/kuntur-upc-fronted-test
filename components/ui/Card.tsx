import React from 'react';
import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';

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

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'medium',
  style,
}) => {
  return (
    <CardContainer
      variant={variant}
      padding={padding}
      margin={margin}
      style={style}
    >
      {children}
    </CardContainer>
  );
}; 