import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import styled from 'styled-components/native';

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
  margin-top: 32px;
  margin-left: 24px;
  margin-bottom: 16px;
  border-left-width: 4px;
  border-left-color: #fff;
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
  color: #fff;
  margin-left: 8px;
`;

const CameraContainer = styled.View`
  margin: 0 16px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  border-width: 2px;
  border-color: #fff;
`;

const CameraLabel = styled.Text`
  color: #fff;
  font-size: 16px;
  margin: 8px 0 0 8px;
`;

const VolumeBar = styled.View`
  flex-direction: row;
  align-items: center;
  background: #3B206A;
  border-radius: 16px;
  margin: 24px 24px 16px 24px;
  padding: 8px 16px;
  elevation: 4;
`;

const VolumeTrack = styled.View`
  flex: 1;
  height: 6px;
  background: #fff2;
  border-radius: 3px;
  margin-left: 12px;
  justify-content: center;
`;

const VolumeFill = styled.View`
  width: 80%;
  height: 6px;
  background: #fff;
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

  // Asegurar que ip sea string
  const ipStr = Array.isArray(ip) ? ip[0] : ip;
  console.log('Valor de ipStr en ConnectionInfoScreen:', ipStr);

  // Si recibimos la IP por parámetro, la usamos directamente
  if (ipStr) {
    let streamType = 'desconocido';
    if (ipStr.startsWith('rtsp://')) streamType = 'RTSP';
    else if (ipStr.startsWith('http://') || ipStr.startsWith('https://')) streamType = 'HTTP(S)';
    console.log('Tipo de stream detectado:', streamType);
    return (
      <GradientBackground
        colors={['#8B5CF6', '#3B82F6']}
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
            <Ionicons name="business" size={40} color="#fff" />
          </BuildingIcon>
        </Header>
        <MainTitle>Evento en Vivo</MainTitle>
        <LocationRow>
          <Ionicons name="location" size={24} color="#fff" />
          <LocationText>Quito, Solanda, 170148</LocationText>
        </LocationRow>
        {/* Renderizar video según el tipo de URL */}
        {ipStr && ipStr.startsWith('rtsp://') ? (
          <Text style={{ color: 'red', marginLeft: 24, marginTop: 8, fontSize: 16 }}>
            No se puede mostrar video RTSP en web. Usa una URL HTTP/HLS compatible.
          </Text>
        ) : ipStr && (ipStr.startsWith('http://') || ipStr.startsWith('https://')) ? (
          <>
            <video controls autoPlay style={{ width: '100%', height: 200, background: '#000', borderRadius: 8, margin: '0 16px' }}>
              <source src={String(ipStr)} />
              Tu navegador no soporta video embebido.
            </video>
            <div style={{ width: '100%', height: 200, margin: '0 16px', background: '#000', borderRadius: 8, marginTop: 8 }}>
              <img src={String(ipStr)} alt="Stream MJPEG" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </>
        ) : null}
        <CameraLabel>{`Cámara ${cameraId}`}</CameraLabel>
        {/* Mostrar la IP recibida */}
        <Text style={{ color: '#fff', marginLeft: 24, marginTop: 8, fontSize: 16 }}>
          IP: {ipStr}
        </Text>
        <VolumeBar>
          <Ionicons name="volume-high" size={24} color="#fff" />
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
        <ActionButton color="#FFE5EC" border="#EF4444" onPress={() => router.back()}>
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
      colors={['#8B5CF6', '#3B82F6']}
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
          <Ionicons name="business" size={40} color="#fff" />
        </BuildingIcon>
      </Header>
      <MainTitle>Evento en Vivo</MainTitle>
      <LocationRow>
        <Ionicons name="location" size={24} color="#fff" />
        <LocationText>Quito, Solanda, 170148</LocationText>
      </LocationRow>
      <CameraContainer style={{ height: 200 }}>
        <WebView source={{ uri: `http://${camera.ip}/video` }} style={{ flex: 1 }} />
      </CameraContainer>
      <CameraLabel>{camera.name}</CameraLabel>
      <VolumeBar>
        <Ionicons name="volume-high" size={24} color="#fff" />
        <VolumeTrack>
          <VolumeFill />
        </VolumeTrack>
      </VolumeBar>
      <ActionButton color="#B9FBC0" border="#2DC653" onPress={() => router.push('/elementos')}>
        <ActionText color="#2DC653">&gt; Enviar elementos</ActionText>
      </ActionButton>
      <ActionButton color="#FFE5EC" border="#EF4444" onPress={() => router.back()}>
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