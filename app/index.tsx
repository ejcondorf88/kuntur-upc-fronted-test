import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { Button } from '../components/ui/Button';
import { useWebSocket } from '../hooks/useWebSocket';
import { useTheme } from '../theme/them';

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

const BuildingIcon = styled.View`
  margin-left: 12px;
`;

const MainTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.onPrimary};
  margin-top: 48px;
  margin-left: 24px;
  margin-bottom: 24px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.onPrimary};
  padding-left: 12px;
`;

const CenterLogo = styled.Image`
  width: 240px;
  height: 240px;
  align-self: center;
  margin-vertical: 32px;
  resize-mode: contain;
`;

const BottomArea = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 48px;
  align-items: center;
`;

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [lastMessage, setLastMessage] = useState<any>(null);
  const ws = useWebSocket('ws://127.0.0.1:8001/ws/1');

  // Animación de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
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

  useEffect(() => {
    if (ws.lastMessage) {
      setLastMessage(ws.lastMessage);
      console.log('Notificación recibida, habilitando botón:', ws.lastMessage);
    }
  }, [ws.lastMessage]);

  const isButtonEnabled = !!lastMessage;

  // Limpia el estado al volver a la pantalla principal usando useFocusEffect
  useFocusEffect(
    useCallback(() => {
      setLastMessage(null);
    }, [])
  );

  const handlePress = () => {
    if (!lastMessage) {
      console.log('No hay lastMessage, no se navega');
      return;
    }
    const params = {
      cameraId: '1',
      ip: lastMessage.ip || lastMessage.stream_url || '192.168.1.10', // valor por defecto para pruebas
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
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          <Header>
            <LogoRow>
              <LogoImage source={require('../assets/images/image.png')} />
              <TitleBlock>
                <KunturTitle>KUNTUR</KunturTitle>
                <Subtitle>Seguridad desde las nubes</Subtitle>
              </TitleBlock>
            </LogoRow>
            <BuildingIcon>
              <Ionicons name="business" size={40} color={theme.colors.onPrimary} />
            </BuildingIcon>
          </Header>
          <MainTitle>Alerta de Eventos</MainTitle>
          <CenterLogo source={require('../assets/images/image.png')} />
          <BottomArea>
            <Button
              title="Responder a evento"
              onPress={handlePress}
              variant="outline"
              size="large"
              icon={<Ionicons name="notifications" size={20} color={theme.colors.error} />}
              style={{ backgroundColor: theme.colors.onPrimary, borderColor: theme.colors.error, borderWidth: 2, width: 320 }}
              textStyle={{ color: theme.colors.error, fontWeight: 'bold', fontSize: 20 }}
              disabled={!isButtonEnabled}
            />
          </BottomArea>
        </Animated.View>
      </GradientBackground>
    </Container>
  );
}