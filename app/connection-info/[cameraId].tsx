import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import styled from 'styled-components/native';
import { useTheme } from '../../theme/them';

const cameraMap: Record<string, { ip: string; name: string }> = {
  cam1: { ip: '192.168.1.10', name: 'Cámara Kuntur 1' },
  cam2: { ip: '192.168.1.11', name: 'Cámara Kuntur 2' },
  cam3: { ip: '192.168.1.12', name: 'Cámara Kuntur 3' },
  // ... agrega tus cámaras aquí
};

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
  margin-top: 32px;
  margin-left: 24px;
  margin-bottom: 16px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.onPrimary};
  padding-left: 12px;
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 24px;
  margin-bottom: 16px;
`;

const LocationText = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.onPrimary};
  margin-left: 8px;
`;

const CameraContainer = styled.View`
  margin: 0 16px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.onPrimary};
`;

const CameraLabel = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 16px;
  margin: 8px 0 0 8px;
`;

const VolumeBar = styled.View`
  flex-direction: row;
  align-items: center;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 16px;
  margin: 24px 24px 16px 24px;
  padding: 8px 16px;
  elevation: 4;
`;

const VolumeTrack = styled.View`
  flex: 1;
  height: 6px;
  background: ${({ theme }) => theme.colors.surfaceVariant};
  border-radius: 3px;
  margin-left: 12px;
  justify-content: center;
`;

const VolumeFill = styled.View`
  width: 80%;
  height: 6px;
  background: ${({ theme }) => theme.colors.onPrimary};
  border-radius: 3px;
`;

const ActionButton = styled.TouchableOpacity<{ color: string; border: string }>`
  background-color: ${({ color }) => color};
  border-color: ${({ border }) => border};
  border-width: 2px;
  border-radius: 32px;
  padding: 16px 0;
  margin: 12px 24px 0 24px;
  align-items: center;
  elevation: 2;
`;

const ActionText = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 20px;
  font-weight: bold;
`;

export default function ConnectionInfoScreen() {
  const { cameraId, ip, location, date, time, transcription_video, key_words, cordinates, confidence_level } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const [streamError, setStreamError] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Asegurar que ip sea string
  const ipStr = Array.isArray(ip) ? ip[0] : ip;
  console.log('Valor de ipStr en ConnectionInfoScreen:', ipStr);

  // Función para manejar falsa alarma
  const handleFalsaAlarma = () => {
    console.log('Falsa alarma detectada - cerrando conexión al stream');
    
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
    
    // Navegar de vuelta
    router.push('/');
  };

  // Función para manejar errores del stream
  const handleStreamError = () => {
    setStreamError(true);
    setIsReconnecting(true);
    
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
    console.log('Stream cargado exitosamente');
  };

  // Resetear estado cuando cambia la IP
  useEffect(() => {
    setStreamError(false);
    setIsReconnecting(false);
    setRetryCount(0);
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
      <GradientBackground
        colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Header>
          <LogoRow>
            <TouchableOpacity onPress={() => router.push('/')}>
              <LogoImage source={require('../../assets/images/icon.png')} />
            </TouchableOpacity>
            <TitleBlock>
              <KunturTitle>KUNTUR</KunturTitle>
              <Subtitle>Seguridad desde las nubes</Subtitle>
            </TitleBlock>
          </LogoRow>
          <BuildingIcon>
            <Ionicons name="business" size={40} color={theme.colors.onPrimary} />
          </BuildingIcon>
        </Header>
        <MainTitle>Información de la conexión</MainTitle>
        <LocationRow>
          <Ionicons name="location" size={24} color={theme.colors.onPrimary} />
          <LocationText>Quito, Solanda, 170148</LocationText>
        </LocationRow>
        
        {/* Renderizar video con manejo de errores */}
        {ipStr && ipStr.startsWith('rtsp://') ? (
          <Text style={{ color: 'red', marginLeft: 24, marginTop: 8, fontSize: 16 }}>
            No se puede mostrar video RTSP en web. Usa una URL HTTP/HLS compatible.
          </Text>
        ) : ipStr && (ipStr.startsWith('http://') || ipStr.startsWith('https://')) ? (
          <>
            {/* Video con manejo de errores */}
            <div style={{ width: '100%', height: 200, margin: '0 16px', background: '#000', borderRadius: 8, position: 'relative' }}>
              {streamError ? (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column',
                  color: '#fff'
                }}>
                  <Ionicons name="warning" size={48} color="#ff6b6b" />
                  <Text style={{ color: '#ff6b6b', marginTop: 8, fontSize: 16, textAlign: 'center' }}>
                    Error de conexión al stream
                  </Text>
                  {isReconnecting && (
                    <Text style={{ color: '#fff', marginTop: 4, fontSize: 14, textAlign: 'center' }}>
                      Reintentando... ({retryCount}/3)
                    </Text>
                  )}
                  {retryCount >= 3 && (
                    <Text style={{ color: '#ff6b6b', marginTop: 4, fontSize: 14, textAlign: 'center' }}>
                      No se pudo conectar después de 3 intentos
                    </Text>
                  )}
                </div>
              ) : (
                <video 
                  ref={videoRef}
                  controls 
                  autoPlay 
                  style={{ width: '100%', height: '100%', borderRadius: 8 }}
                  onError={handleStreamError}
                  onLoad={handleStreamLoad}
                >
                  <source src={String(ipStr)} />
                  Tu navegador no soporta video embebido.
                </video>
              )}
            </div>
            
            {/* Imagen MJPEG como respaldo */}
            <div style={{ width: '100%', height: 200, margin: '0 16px', background: '#000', borderRadius: 8, marginTop: 8 }}>
              <img 
                ref={imgRef}
                src={String(ipStr)} 
                alt="Stream MJPEG" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={handleStreamError}
                onLoad={handleStreamLoad}
              />
            </div>
          </>
        ) : null}
        
        <CameraLabel>{`Cámara ${cameraId}`}</CameraLabel>
        {/* Mostrar la IP recibida */}
        <Text style={{ color: theme.colors.onPrimary, marginLeft: 24, marginTop: 8, fontSize: 16 }}>
          IP: {ipStr}
        </Text>
        <VolumeBar>
          <Ionicons name="volume-high" size={24} color={theme.colors.onPrimary} />
          <VolumeTrack>
            <VolumeFill />
          </VolumeTrack>
        </VolumeBar>
        <ActionButton color="#B9FBC0" border="#2DC653" onPress={() => {
          const paramsToSend = {
            ip: ip || '',
            location: location || '',
            date: date || '',
            time: time || '',
            transcription_video: transcription_video || '',
            key_words: key_words || '',
            cordinates: typeof cordinates !== 'undefined' ? (typeof cordinates === 'string' ? cordinates : JSON.stringify(cordinates)) : undefined,
            confidence_level: typeof confidence_level !== 'undefined' ? confidence_level : undefined,
          };
          console.log('Params que se envían a /elementos:', paramsToSend);
          router.push({
            pathname: '/elementos',
            params: paramsToSend
          });
        }}>
          <ActionText color="#2DC653">&gt; Enviar elementos</ActionText>
        </ActionButton>
        <ActionButton color="#FFE5EC" border="#EF4444" onPress={handleFalsaAlarma}>
          <ActionText color="#EF4444">
            <Ionicons name="notifications" size={20} color="#EF4444" /> Falsa alarma
          </ActionText>
        </ActionButton>
      </GradientBackground>
    );
  }

  // Si no hay IP, usa el mapa estático como antes
  const camera = cameraMap[cameraId as string];
  if (!camera) {
    return <Text style={styles.error}>Cámara no encontrada</Text>;
  }

  return (
    <GradientBackground
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Header>
        <LogoRow>
          <TouchableOpacity onPress={() => router.push('/')}>
            <LogoImage source={require('../../assets/images/icon.png')} />
          </TouchableOpacity>
          <TitleBlock>
            <KunturTitle>KUNTUR</KunturTitle>
            <Subtitle>Seguridad desde las nubes</Subtitle>
          </TitleBlock>
        </LogoRow>
        <BuildingIcon>
          <Ionicons name="business" size={40} color={theme.colors.onPrimary} />
        </BuildingIcon>
      </Header>
      <MainTitle>Información de la conexión</MainTitle>
      <LocationRow>
        <Ionicons name="location" size={24} color={theme.colors.onPrimary} />
        <LocationText>Quito, Solanda, 170148</LocationText>
      </LocationRow>
      <CameraContainer style={{ height: 200 }}>
        <WebView source={{ uri: `http://${camera.ip}/video` }} style={{ flex: 1 }} />
      </CameraContainer>
      <CameraLabel>{camera.name}</CameraLabel>
      <VolumeBar>
        <Ionicons name="volume-high" size={24} color={theme.colors.onPrimary} />
        <VolumeTrack>
          <VolumeFill />
        </VolumeTrack>
      </VolumeBar>
      <ActionButton color="#B9FBC0" border="#2DC653" onPress={() => router.push('/elementos')}>
        <ActionText color="#2DC653">&gt; Enviar elementos</ActionText>
      </ActionButton>
      <ActionButton color="#FFE5EC" border="#EF4444" onPress={handleFalsaAlarma}>
        <ActionText color="#EF4444">
          <Ionicons name="notifications" size={20} color="#EF4444" /> Falsa alarma
        </ActionText>
      </ActionButton>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  error: { color: 'red', fontSize: 18, margin: 32, textAlign: 'center' },
}); 