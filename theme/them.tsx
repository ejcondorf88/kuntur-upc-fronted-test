import { useColorScheme } from '@/hooks/useColorScheme';
import React, { createContext, useContext } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

// Definición de los temas mejorados con colores más modernos
export const lightTheme = {
  colors: {
    // Colores principales del gradiente KUNTUR mejorados
    primary: '#6366F1', // Indigo moderno
    secondary: '#8B5CF6', // Violeta
    accent: '#F59E0B', // Ámbar
    
    // Gradientes mejorados
    gradientStart: '#667EEA', // Azul índigo
    gradientEnd: '#764BA2',   // Púrpura
    gradientMiddle: '#8B5CF6', // Violeta
    
    // Backgrounds
    background: '#FFFFFF',
    surface: '#F8FAFC',
    surfaceVariant: '#F1F5F9',
    
    // Textos
    text: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#1E293B',
    
    // Estados mejorados
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Bordes y divisores
    border: '#E2E8F0',
    divider: '#F1F5F9',
    outline: '#CBD5E1',
    
    // Elementos interactivos
    buttonBackground: '#6366F1',
    buttonText: '#FFFFFF',
    cardBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
    
    // Específicos de KUNTUR mejorados
    kunturRed: '#EF4444',
    kunturPurple: '#8B5CF6',
    kunturBlue: '#6366F1',
    kunturGradient: ['#667EEA', '#764BA2'],
    statusBarStyle: 'dark-content' as 'dark-content' | 'light-content',
  },
  
  // Espaciado
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Tipografía mejorada
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      lineHeight: 32,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
  },
  
  // Radius mejorado
  radius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  // Sombras mejoradas
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    
    // Backgrounds para modo oscuro mejorados
    background: '#0F172A',
    surface: '#1E293B',
    surfaceVariant: '#334155',
    
    // Textos para modo oscuro
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    onSurface: '#F8FAFC',
    
    // Bordes y divisores para modo oscuro
    border: '#475569',
    divider: '#334155',
    outline: '#64748B',
    
    // Elementos interactivos para modo oscuro
    cardBackground: '#1E293B',
    cardShadow: 'rgba(0, 0, 0, 0.25)',
    
    // Gradientes para modo oscuro
    gradientStart: '#1E293B',
    gradientEnd: '#334155',
    gradientMiddle: '#475569',
    
    // Status bar para modo oscuro
    statusBarStyle: 'light-content' as 'dark-content' | 'light-content',
  },
};

// Context para el tema
const ThemeContext = createContext<typeof lightTheme | typeof darkTheme>(lightTheme);

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a KunturThemeProvider');
  }
  return theme;
};

// Provider del tema
interface KunturThemeProviderProps {
  children: React.ReactNode;
}

export const KunturThemeProvider: React.FC<KunturThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={theme}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Tipos para TypeScript
export type Theme = typeof lightTheme;
export type ThemeColors = typeof lightTheme.colors;

// Declaración de módulo para styled-components
declare module 'styled-components/native' {
  export interface DefaultTheme extends Theme {}
}