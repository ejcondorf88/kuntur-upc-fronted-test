import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { Header as AppHeader } from '../components/Header';
import { Button } from '../components/ui/Button';
import { useWebSocket } from '../hooks/useWebSocket';
import { useTheme } from '../theme/them';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
`;

const GradientBackground = styled(LinearGradient)`
  flex: 1;
`;

const Header = styled.View`
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
  width: 52px;
  height: 52px;
  resize-mode: contain;
  border-radius: 26px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  elevation: 8;
`;

const TitleBlock = styled.View`
  margin-left: 16px;
`;

const KunturTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.h1.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
  color: ${({ theme }) => theme.colors.onPrimary};
  letter-spacing: 3px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  color: ${({ theme }) => theme.colors.onPrimary};
  opacity: 0.85;
  margin-top: 2px;
  font-style: italic;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
`;

const BuildingIconContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 25px;
  padding: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const MainContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

const MainTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.h2.fontSize + 4}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.onPrimary};
  text-align: center;
  margin-bottom: 32px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const AlertCard = styled.View`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  margin: 24px 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 12px;
  elevation: 10;
  min-height: 280px;
  width: ${width - 48}px;
  justify-content: center;
  align-items: center;
`;

const CenterLogo = styled.Image`
  width: 180px;
  height: 180px;
  resize-mode: contain;
  margin-bottom: 24px;
  opacity: 0.9;
`;

const StatusIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ active, theme }) => 
    active ? 'rgba(76, 175, 80, 0.2)' : 'rgba(158, 158, 158, 0.2)'};
  border-radius: 20px;
  padding: 8px 16px;
  margin-top: 16px;
  border: 1px solid ${({ active, theme }) => 
    active ? 'rgba(76, 175, 80, 0.4)' : 'rgba(158, 158, 158, 0.4)'};
`;

const StatusText = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
`;

const StatusDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ active }) => 
    active ? '#4CAF50' : '#9E9E9E'};
`;

const BottomArea = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 48px;
  align-items: center;
  padding: 0 24px;
`;

const AnimatedButton = styled(Animated.View)`
  width: 100%;
  max-width: 320px;
`;

const PulseAnimation = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.colors.error};
  opacity: 0.3;
`;

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [lastMessage, setLastMessage] = useState<any>(null);
  const ws = useWebSocket('ws://127.0.0.1:8001/ws/1');

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 15,
        bounciness: 8,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (ws.lastMessage) {
      setLastMessage(ws.lastMessage);
      console.log('Notificación recibida, habilitando botón:', ws.lastMessage);
      
      // Animación del botón cuando se activa
      Animated.sequence([
        Animated.spring(buttonScaleAnim, {
          toValue: 1.05,
          useNativeDriver: true,
          speed: 20,
        }),
        Animated.spring(buttonScaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
        }),
      ]).start();

      // Animación de pulso para el botón activo
      const startPulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (lastMessage) startPulse();
        });
      };
      startPulse();
    }
  }, [ws.lastMessage]);

  const isButtonEnabled = !!lastMessage;

  useFocusEffect(
    useCallback(() => {
      setLastMessage(null);
      pulseAnim.setValue(0);
      buttonScaleAnim.setValue(0.9);
    }, [])
  );

  const handlePress = () => {
    if (!lastMessage) {
      console.log('No hay lastMessage, no se navega');
      return;
    }
    
    // Animación de tap
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const params = {
      cameraId: '1',
      ip: lastMessage.ip || lastMessage.stream_url || '192.168.1.10',
      location: lastMessage.location || '',
      date: lastMessage.date || '',
      time: lastMessage.time || '',
      transcription_video: lastMessage.transcription_video || '',
      key_words: (lastMessage.key_words || []).join(', '),
      cordinates: lastMessage.cordinates ? JSON.stringify(lastMessage.cordinates) : undefined,
      confidence_level: lastMessage.confidence_level || undefined,
    };
    console.log('Navegando a /connection-info/[cameraId] con params:', params);
    router.push({ pathname: '/connection-info/[cameraId]', params });
  };

  return (
    <Container>
      <StatusBar barStyle={theme.colors.statusBarStyle} backgroundColor="transparent" translucent />
      <GradientBackground
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <AppHeader
          title="Kuntur UPC"
          subtitle="Sistema de monitoreo inteligente"
        />
        <MainTitle>Bienvenido</MainTitle>
        <CenterLogo source={require('../assets/images/react-logo.png')} />
        <BottomArea>
          <Button
            title={isButtonEnabled ? 'Ver caso detectado' : 'Esperando alerta...'}
            onPress={handlePress}
            disabled={!isButtonEnabled}
            variant={isButtonEnabled ? 'primary' : 'secondary'}
            size="large"
          />
        </BottomArea>
      </GradientBackground>
    </Container>
  );
}