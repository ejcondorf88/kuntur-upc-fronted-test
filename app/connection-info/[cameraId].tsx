import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import styled from 'styled-components/native';
import { useTheme } from '../../theme/them';

const { width, height } = Dimensions.get('window');

const cameraMap: Record<string, { ip: string; name: string }> = {
  cam1: { ip: '192.168.1.10', name: 'Cámara Kuntur 1' },
  cam2: { ip: '192.168.1.11', name: 'Cámara Kuntur 2' },
  cam3: { ip: '192.168.1.12', name: 'Cámara Kuntur 3' },
  // ... agrega tus cámaras aquí
};

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
  margin-bottom: 24px;
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

const BackButton = styled.TouchableOpacity`
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 25px;
  padding: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const ContentContainer = styled(ScrollView)`
  flex: 1;
  padding: 0 24px;
`;

const InfoCard = styled.View`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  elevation: 6;
`;

const MainTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.h2.fontSize + 2}px;
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.onPrimary};
  margin-bottom: 16px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const LocationText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.onPrimary};
  margin-left: 12px;
  font-weight: 500;
`;

const CameraContainer = styled.View`
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  shadow-color: #000;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.25;
  shadow-radius: 12px;
  elevation: 10;
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const CameraHeader = styled.View`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const CameraLabel = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 16px;
  font-weight: bold;
`;

const StreamStatus = styled.View`
  flex-direction: row;
  align-items: center;
`;

interface StatusDotProps {
  connected: boolean;
}

const StatusDot = styled.View<StatusDotProps>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ connected }) => connected ? '#4CAF50' : '#FF5722'};
  margin-right: 8px;
`;

const StatusText = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 12px;
  opacity: 0.8;
`;

const VideoContainer = styled.View`
  height: 220px;
  position: relative;
`;

const ErrorContainer = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.8);
`;

const ErrorText = styled.Text`
  color: #ff6b6b;
  margin-top: 8px;
  font-size: 16px;
  text-align: center;
  font-weight: 500;
`;

const RetryText = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  margin-top: 4px;
  font-size: 14px;
  text-align: center;
  opacity: 0.8;
`;

const StreamInfo = styled.View`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StreamText = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 14px;
  opacity: 0.8;
`;

const VolumeCard = styled.View`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  elevation: 6;
`;

const VolumeBar = styled.View`
  flex-direction: row;
  align-items: center;
`;

const VolumeTrack = styled.View`
  flex: 1;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-left: 16px;
  justify-content: center;
`;

const VolumeFill = styled.View`
  width: 80%;
  height: 8px;
  background-color: #4CAF50;
  border-radius: 4px;
`;

const ActionsContainer = styled.View`
  margin-top: 12px;
  margin-bottom: 32px;
`;

interface ActionButtonProps {
  bgColor: string;
  borderColor: string;
}

const ActionButton = styled.TouchableOpacity<ActionButtonProps>`
  background-color: ${({ bgColor }) => bgColor};
  border-color: ${({ borderColor }) => borderColor};
  border-width: 2px;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 16px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 6;
`;

interface ActionTextProps {
  color: string;
}

const ActionText = styled.Text<ActionTextProps>`
  color: ${({ color }) => color};
  font-size: 18px;
  font-weight: bold;
  margin-left: 8px;
  letter-spacing: 0.5px;
`;

const AnimatedButton = styled(Animated.View)`
  width: 100%;
`;

export default function ConnectionInfoScreen() {
  const params = useLocalSearchParams();
  const alertData = params.alertData ? JSON.parse(params.alertData) : {};
  const deliveryTag = Array.isArray(params.deliveryTag)
    ? Number(params.deliveryTag[0])
    : params.deliveryTag
      ? Number(params.deliveryTag)
      : null;
  console.log('alertData recibido en connection-info:', alertData);
  const router = useRouter();
  const theme = useTheme();
  const [streamError, setStreamError] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Asegurar que ip sea string
  const ipStr = alertData.ip || alertData.stream_url || '';
  console.log('Valor de ipStr en ConnectionInfoScreen:', ipStr);

  // Reemplazar variables sueltas por alertData
  const dateStr = alertData.date || '';
  const timeStr = alertData.time || '';
  const transcriptionVideo = alertData.transcription_video || '';
  const keyWords = Array.isArray(alertData.key_words) ? alertData.key_words.join(', ') : alertData.key_words || '';
  const cordinates = alertData.cordinates;
  const confidenceLevel = alertData.confidence_level || alertData['confidence level'] || undefined;

  const clipUrl = Array.isArray(alertData.stream_url)
    ? alertData.stream_url[0]
    : alertData.stream_url;

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com.*(?:[\\?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };
  const videoId = clipUrl ? getYoutubeId(clipUrl) : null;

  // Función para manejar falsa alarma
  const handleFalsaAlarma = async () => {
    console.log('Falsa alarma detectada - cerrando conexión al stream');

    // Consumir el mensaje de RabbitMQ si hay deliveryTag
    if (deliveryTag) {
      await fetch('http://localhost:8001/ack_alerta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_tag: deliveryTag })
      });
    }

    // Animación de botón
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
    
    // Detener el video si existe
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
      videoRef.current.load();
    }
    
    // Detener la imagen MJPEG si existe
    if (imgRef.current) {
      imgRef.current.src = '';
    }
    
    // Resetear estados
    setStreamError(false);
    setIsReconnecting(false);
    setRetryCount(0);
    setIsConnected(false);
    
    // Navegar de vuelta
    router.push('/');
  };

  // Función para manejar errores del stream
  const handleStreamError = () => {
    setStreamError(true);
    setIsReconnecting(true);
    setIsConnected(false);
    
    // Reintentar después de 3 segundos
    setTimeout(() => {
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setStreamError(false);
        setIsReconnecting(false);
        console.log(`Reintentando conexión al stream (intento ${retryCount + 1}/3)`);
      }
    }, 3000);
  };

  // Función para manejar carga exitosa del stream
  const handleStreamLoad = () => {
    setStreamError(false);
    setIsReconnecting(false);
    setRetryCount(0);
    setIsConnected(true);
    console.log('Stream cargado exitosamente');
  };

  // Función para manejar presión de botón
  const handleButtonPress = (action: () => void) => {
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
    
    action();
  };

  // Resetear estado cuando cambia la IP
  useEffect(() => {
    setStreamError(false);
    setIsReconnecting(false);
    setRetryCount(0);
    setIsConnected(false);
  }, [ipStr]);

  // Limpiar conexiones al desmontar el componente
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
      if (imgRef.current) {
        imgRef.current.src = '';
      }
    };
  }, []);

  // Si recibimos la IP por parámetro, la usamos directamente
  if (ipStr) {
    let streamType = 'desconocido';
    if (ipStr.startsWith('rtsp://')) streamType = 'RTSP';
    else if (ipStr.startsWith('http://') || ipStr.startsWith('https://')) streamType = 'HTTP(S)';
    console.log('Tipo de stream detectado:', streamType);
    
    return (
      <Container>
        <GradientBackground
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={{ 
            flex: 1, 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }}>
            <Header>
              <LogoRow>
                <BackButton onPress={() => router.push('/')}>
                  <Ionicons name="arrow-back" size={24} color={theme.colors.onPrimary} />
                </BackButton>
                <TitleBlock>
                  <KunturTitle>KUNTUR</KunturTitle>
                  <Subtitle>Seguridad desde las nubes</Subtitle>
                </TitleBlock>
              </LogoRow>
            </Header>

            <ContentContainer showsVerticalScrollIndicator={false}>
              <InfoCard>
                <MainTitle>Información de Conexión</MainTitle>
                <LocationRow>
                  <Ionicons name="location-outline" size={24} color={theme.colors.onPrimary} />
                  <LocationText>Quito, Solanda, 170148</LocationText>
                </LocationRow>
              </InfoCard>

              <CameraContainer>
                <CameraHeader>
                  <CameraLabel>Cámara {params.cameraId}</CameraLabel>
                  <StreamStatus>
                    <StatusDot connected={isConnected} />
                    <StatusText>
                      {isConnected ? 'Conectado' : streamError ? 'Error' : 'Conectando...'}
                    </StatusText>
                  </StreamStatus>
                </CameraHeader>
                <VideoContainer>
                  {videoId ? (
                    <YoutubePlayer
                      height={220}
                      play={false}
                      videoId={videoId}
                    />
                  ) : (
                    <ErrorContainer>
                      <ErrorText>No hay clip disponible</ErrorText>
                    </ErrorContainer>
                  )}
                </VideoContainer>

                <StreamInfo>
                  <StreamText>IP: {ipStr}</StreamText>
                  <StreamText>Tipo: {streamType}</StreamText>
                </StreamInfo>
              </CameraContainer>

              <VolumeCard>
                <VolumeBar>
                  <Ionicons name="volume-high" size={24} color={theme.colors.onPrimary} />
                  <VolumeTrack>
                    <VolumeFill />
                  </VolumeTrack>
                </VolumeBar>
              </VolumeCard>

              <ActionsContainer>
                <AnimatedButton style={{ transform: [{ scale: buttonScaleAnim }] }}>
                  <ActionButton 
                    bgColor="rgba(185, 251, 192, 0.9)" 
                    borderColor="#2DC653"
                    onPress={() => handleButtonPress(() => {
                      // Al navegar a elementos:
                      console.log('Enviando alertData a elementos:', alertData);
                      router.push({
                        pathname: '/elementos',
                        params: { alertData: JSON.stringify(alertData) }
                      });
                    })}
                  >
                    <Ionicons name="send" size={20} color="#2DC653" />
                    <ActionText color="#2DC653">Enviar Elementos</ActionText>
                  </ActionButton>
                </AnimatedButton>

                <AnimatedButton style={{ transform: [{ scale: buttonScaleAnim }] }}>
                  <ActionButton 
                    bgColor="rgba(255, 229, 236, 0.9)" 
                    borderColor="#EF4444"
                    onPress={() => handleButtonPress(handleFalsaAlarma)}
                  >
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                    <ActionText color="#EF4444">Falsa Alarma</ActionText>
                  </ActionButton>
                </AnimatedButton>
              </ActionsContainer>
            </ContentContainer>
          </Animated.View>
        </GradientBackground>
      </Container>
    );
  }

  // Si no hay IP, usa el mapa estático como antes
  const camera = cameraMap[params.cameraId as string];
  if (!camera) {
    return (
      <Container>
        <GradientBackground
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ErrorContainer>
            <Ionicons name="camera-outline" size={64} color="#ff6b6b" />
            <ErrorText style={{ fontSize: 18, marginTop: 16 }}>Cámara no encontrada</ErrorText>
          </ErrorContainer>
        </GradientBackground>
      </Container>
    );
  }

  return (
    <Container>
      <GradientBackground
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={{ 
          flex: 1, 
          opacity: fadeAnim, 
          transform: [{ translateY: slideAnim }] 
        }}>
          <Header>
            <LogoRow>
              <BackButton onPress={() => router.push('/')}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.onPrimary} />
              </BackButton>
              <TitleBlock>
                <KunturTitle>KUNTUR</KunturTitle>
                <Subtitle>Seguridad desde las nubes</Subtitle>
              </TitleBlock>
            </LogoRow>
          </Header>

          <ContentContainer showsVerticalScrollIndicator={false}>
            <InfoCard>
              <MainTitle>Información de Conexión</MainTitle>
              <LocationRow>
                <Ionicons name="location-outline" size={24} color={theme.colors.onPrimary} />
                <LocationText>Quito, Solanda, 170148</LocationText>
              </LocationRow>
            </InfoCard>

            <CameraContainer>
              <CameraHeader>
                <CameraLabel>{camera.name}</CameraLabel>
                <StreamStatus>
                  <StatusDot connected={true} />
                  <StatusText>Conectado</StatusText>
                </StreamStatus>
              </CameraHeader>

              <VideoContainer>
                {camera.ip ? (
                  <WebView source={{ uri: `http://${camera.ip}/video` }} style={{ flex: 1 }} />
                ) : (
                  <ErrorContainer>
                    <Ionicons name="videocam-off-outline" size={48} color="#ff6b6b" />
                    <ErrorText>No hay stream disponible (IP no definida)</ErrorText>
                  </ErrorContainer>
                )}
              </VideoContainer>

              <StreamInfo>
                <StreamText>IP: {camera.ip}</StreamText>
                <StreamText>Tipo: WebView</StreamText>
              </StreamInfo>
            </CameraContainer>

            <VolumeCard>
              <VolumeBar>
                <Ionicons name="volume-high" size={24} color={theme.colors.onPrimary} />
                <VolumeTrack>
                  <VolumeFill />
                </VolumeTrack>
              </VolumeBar>
            </VolumeCard>

            <ActionsContainer>
              <AnimatedButton style={{ transform: [{ scale: buttonScaleAnim }] }}>
                <ActionButton 
                  bgColor="rgba(185, 251, 192, 0.9)" 
                  borderColor="#2DC653"
                  onPress={() => handleButtonPress(() => router.push('/elementos'))}
                >
                  <Ionicons name="send" size={20} color="#2DC653" />
                  <ActionText color="#2DC653">Enviar Elementos</ActionText>
                </ActionButton>
              </AnimatedButton>

              <AnimatedButton style={{ transform: [{ scale: buttonScaleAnim }] }}>
                <ActionButton 
                  bgColor="rgba(255, 229, 236, 0.9)" 
                  borderColor="#EF4444"
                  onPress={() => handleButtonPress(handleFalsaAlarma)}
                >
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                  <ActionText color="#EF4444">Falsa Alarma</ActionText>
                </ActionButton>
              </AnimatedButton>
            </ActionsContainer>
          </ContentContainer>
        </Animated.View>
      </GradientBackground>
    </Container>
  );
}

const styles = StyleSheet.create({
  error: { color: 'red', fontSize: 18, margin: 32, textAlign: 'center' },
});