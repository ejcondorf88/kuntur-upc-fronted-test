import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
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
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  letter-spacing: 2px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: #fff;
  opacity: 0.7;
  margin-top: 2px;
`;

const BuildingIcon = styled.View`
  margin-left: 12px;
`;

const MainTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  margin-top: 48px;
  margin-left: 24px;
  margin-bottom: 24px;
  border-left-width: 4px;
  border-left-color: #fff;
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
    if (!lastMessage) return;
    router.push({
      pathname: '/connection-info/[cameraId]',
      params: {
        cameraId: '1',
        ip: lastMessage.ip || lastMessage.stream_url || '',
        location: lastMessage.location || '',
        date: lastMessage.date || '',
        time: lastMessage.time || '',
        transcription_video: lastMessage.transcription_video || '',
        key_words: (lastMessage.key_words || []).join(', '),
        cordinates: lastMessage.cordinates ? JSON.stringify(lastMessage.cordinates) : undefined,
        confidence_level: lastMessage.confidence_level || undefined,
      }
    });
  };

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <GradientBackground
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Header>
          <LogoRow>
            <LogoImage source={require('../assets/images/image.png')} />
            <TitleBlock>
              <KunturTitle>KUNTUR</KunturTitle>
              <Subtitle>Seguridad desde las nubes</Subtitle>
            </TitleBlock>
          </LogoRow>
          <BuildingIcon>
            <Ionicons name="business" size={40} color="#fff" />
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
            style={{ backgroundColor: '#fff', borderColor: theme.colors.error, borderWidth: 2, width: 320 }}
            textStyle={{ color: theme.colors.error, fontWeight: 'bold', fontSize: 20 }}
            disabled={!isButtonEnabled}
          />
        </BottomArea>
      </GradientBackground>
    </Container>
  );
}