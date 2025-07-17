import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StatusBar } from 'react-native';
import styled from 'styled-components/native';
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
  const ws = useWebSocket('ws://192.168.11.100:8001/ws/1');

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
      console.log('Webhook recibido en index:', ws.lastMessage);
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

    console.log('Enviando alertData a connection-info:', lastMessage);
    // Pasar el JSON completo como alertData
    router.push({
      pathname: '/connection-info/[cameraId]',
      params: { alertData: JSON.stringify(lastMessage) }
    });
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
            <BuildingIconContainer>
              <Ionicons name="business" size={40} color={theme.colors.onPrimary} />
            </BuildingIconContainer>
          </Header>

          <MainContent>
            <MainTitle>Sistema de Alertas</MainTitle>
            
            <AlertCard>
              <CenterLogo source={require('../assets/images/image.png')} />
              
              <StatusIndicator active={isButtonEnabled}>
                <StatusDot active={isButtonEnabled} />
                <StatusText>
                  {isButtonEnabled ? 'Evento detectado' : 'Monitoreando...'}
                </StatusText>
              </StatusIndicator>
            </AlertCard>
          </MainContent>

          <BottomArea>
            <AnimatedButton style={{ transform: [{ scale: buttonScaleAnim }] }}>
              {isButtonEnabled && (
                <PulseAnimation style={{ transform: [{ scale: pulseAnim }] }} />
              )}
              <Button
                title="Responder a Evento"
                onPress={handlePress}
                variant="outline"
                size="large"
                icon={<Ionicons 
                  name={isButtonEnabled ? "notifications-outline" : "notifications-off-outline"} 
                  size={22} 
                  color={isButtonEnabled ? theme.colors.error : theme.colors.onPrimary} 
                />}
                style={{ 
                  backgroundColor: isButtonEnabled ? theme.colors.onPrimary : 'rgba(255, 255, 255, 0.1)',
                  borderColor: isButtonEnabled ? theme.colors.error : 'rgba(255, 255, 255, 0.3)',
                  borderWidth: 2,
                  borderRadius: 25,
                  paddingVertical: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
                textStyle={{ 
                  color: isButtonEnabled ? theme.colors.error : theme.colors.onPrimary,
                  fontWeight: 'bold',
                  fontSize: 18,
                  letterSpacing: 1,
                }}
                disabled={!isButtonEnabled}
              />
            </AnimatedButton>
          </BottomArea>
        </Animated.View>
      </GradientBackground>
    </Container>
  );
}