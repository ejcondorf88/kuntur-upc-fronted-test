import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { useCreateCase } from '../hooks/useCreateCase';
import { useGeneratePartePolicial } from '../hooks/useGeneratePartePolicial';
import { MockCase, useMockCases } from '../hooks/useMockCases';
import { useTheme } from '../theme/them';

// Gradient background with softer colors
const GradientBackground = styled(LinearGradient)`
  flex: 1;
  padding: 16px;
`;

// Header with refined spacing
const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  margin-top: 64px;
  margin-bottom: 32px;
`;

// Logo row with centered alignment
const LogoRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

// Logo image with slightly larger size
const LogoImage = styled.Image`
  width: 56px;
  height: 56px;
  resize-mode: contain;
`;

// Title block with improved spacing
const TitleBlock = styled.View`
  margin-left: 16px;
`;

// Main title with refined typography
const KunturTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.h1.fontSize}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onPrimary};
  letter-spacing: 1.5px;
  text-transform: uppercase;
`;

// Subtitle with improved readability
const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.onPrimary};
  opacity: 0.8;
  margin-top: 4px;
`;

// Building icon with subtle shadow
const BuildingIcon = styled.View`
  margin-left: 16px;
  shadow-color: ${({ theme }) => theme.colors.onPrimary};
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  elevation: 4;
`;

// Main title with modern styling
const MainTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.h2.fontSize}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onPrimary};
  margin: 32px 24px 24px;
  padding-left: 16px;
  border-left-width: 4px;
  border-left-color: ${({ theme }) => theme.colors.accent};
  line-height: 32px;
`;

// Filter row with improved spacing
const FilterRow = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-left: 24px;
  margin-bottom: 24px;
`;

// Filter button with hover-like effect
const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 24px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.surface}20;
`;

// Filter text with refined typography
const FilterText = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 18px;
  font-weight: 500;
  margin-left: 8px;
`;

// Case card with modern design
const CaseCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin: 8px 16px;
  flex-direction: row;
  align-items: center;
  elevation: 4;
  shadow-color: ${({ theme }) => theme.colors.cardShadow};
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
`;

// Case text with improved readability
const CaseText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 16px;
  font-weight: 500;
  flex: 1;
  line-height: 24px;
`;

// Modal container with semi-transparent background
const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

// Modal content with modern styling
const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 16px;
  padding: 16px;
  width: 96%;
  max-width: 340px;
  elevation: 8;
  shadow-color: ${({ theme }) => theme.colors.cardShadow};
  shadow-opacity: 0.3;
  shadow-radius: 12px;
`;

// Modal title with bold typography
const ModalTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 16px;
  text-align: center;
`;

// Modal label with consistent styling
const ModalLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 12px;
`;

// Modal value with readable text
const ModalValue = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 24px;
`;

// Gradient button container
const GradientButton = styled(LinearGradient)`
  border-radius: 12px;
  padding: 2px;
  margin-top: 24px;
`;

// Close button with modern styling
const CloseButton = styled.TouchableOpacity`
  margin-top: 24px;
  align-self: flex-end;
`;

// Close text with bold typography
const CloseText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 16px;
  font-weight: 600;
`;

// Input field with modern styling
const StyledTextInput = styled.TextInput`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 16px;
  background-color: ${({ theme }) => theme.colors.surface}CC;
  border-radius: 12px;
  padding: 12px;
  width: 100%;
  margin-bottom: 12px;
  border: 1px solid ${({ theme }) => theme.colors.onSurface}33;
`;

// Enhanced Floating Action Button with gradient and animation
const FAB = styled(TouchableOpacity)`
  position: absolute;
  bottom: 32px;
  right: 32px;
  width: 72px;
  height: 72px;
  border-radius: 36px;
  justify-content: center;
  align-items: center;
  elevation: 10;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-opacity: 0.35;
  shadow-radius: 14px;
  shadow-offset: 0px 8px;
`;

const FABGradient = styled(LinearGradient)`
  width: 100%;
  height: 100%;
  border-radius: 36px;
  justify-content: center;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.onPrimary}33;
`;

const FABText = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin-top: 4px;
`;

// Función para autocompletar campos usando la API local
async function completarCamposConOpenAI(alertData, camposVacios) {
  const response = await fetch('http://localhost:8001/api/completar-campos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alertData, camposVacios })
  });
  const data = await response.json();
  console.log('Respuesta de completar-campos:', data);
  try {
    return typeof data.completados === 'string' ? JSON.parse(data.completados) : data.completados;
  } catch {
    return {};
  }
}

export default function CasosScreen() {
  const theme = useTheme();
  const cases = useMockCases();
  const { generarParte } = useGeneratePartePolicial();
  const [selectedCase, setSelectedCase] = useState<MockCase | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newCase, setNewCase] = useState({
    id: '', fecha: '', ubicacion: '', tipo: '', estado: '', nombrePolicia: '', rango: '', unidad: '', idOficial: '', resumen: '', palabrasClave: '', hora: '', pnc: '', codigoDelito: 'a',
  });
  const router = useRouter();
  const params = useLocalSearchParams();
  const alertData = params.alertData ? JSON.parse(params.alertData) : {};
  console.log('alertData recibido en casos:', alertData);
  const { createCase, loading, error, result } = useCreateCase();
  const buttonScaleAnim = React.useRef(new Animated.Value(1)).current;
  const [loadingRequest, setLoadingRequest] = useState(false);

  const handleFabPress = () => {
    Animated.sequence([
      Animated.timing(buttonScaleAnim, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setCreateModalVisible(true);
  };

  // Llenar el modal con alertData si está disponible
  useEffect(() => {
    if (createModalVisible && alertData) {
      // Detecta campos vacíos
      const camposVacios = Object.keys(newCase).filter(key => !newCase[key]);
      if (camposVacios.length > 0) {
        (async () => {
          const completados = await completarCamposConOpenAI(alertData, camposVacios);
          setNewCase((prev) => ({
            ...prev,
            ...completados,
            ubicacion: alertData.location || prev.ubicacion,
            fecha: alertData.date || prev.fecha,
            resumen: alertData.transcription_video || prev.resumen,
            palabrasClave: Array.isArray(alertData.key_words) ? alertData.key_words.join(', ') : alertData.key_words || prev.palabrasClave || '',
            hora: alertData.time || prev.hora || '',
            nombrePolicia: params.nombrePolicia || prev.nombrePolicia || '',
            rango: params.rango || prev.rango || '',
            pnc: params.pnc || prev.pnc || '',
          }));
        })();
      } else {
        setNewCase((prev) => ({
          ...prev,
          ubicacion: alertData.location || prev.ubicacion,
          fecha: alertData.date || prev.fecha,
          resumen: alertData.transcription_video || prev.resumen,
          palabrasClave: Array.isArray(alertData.key_words) ? alertData.key_words.join(', ') : alertData.key_words || prev.palabrasClave || '',
          hora: alertData.time || prev.hora || '',
          nombrePolicia: params.nombrePolicia || prev.nombrePolicia || '',
          rango: params.rango || prev.rango || '',
          pnc: params.pnc || prev.pnc || '',
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModalVisible, alertData, params]);

  const openModal = (c: MockCase) => {
    setSelectedCase(c);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleCreateCase = async () => {
    setCreateModalVisible(false);
    setLoadingRequest(true);
    try {
      let cordinatesObj = undefined;
      if (alertData.cordinates) {
        try {
          cordinatesObj = typeof alertData.cordinates === 'string' ? JSON.parse(alertData.cordinates) : alertData.cordinates;
        } catch (e) {
          cordinatesObj = undefined;
        }
      }
      const partePolicial = {
        ubicacion: alertData.location || newCase.ubicacion,
        fecha: alertData.date || newCase.fecha,
        hora: alertData.time || newCase.hora,
        descripcion: alertData.transcription_video || newCase.resumen,
        palabrasClave: Array.isArray(alertData.key_words) ? alertData.key_words.join(', ') : alertData.key_words || newCase.palabrasClave,
        nivelConfianza: alertData['confidence level'] || alertData.confidence_level,
        alerta: alertData.alert_information,
        dispositivo: {
          id: alertData.device_id,
          tipo: alertData.device_type,
          ip: alertData.ip || alertData.stream_url,
        },
        coordenadas: cordinatesObj && typeof cordinatesObj === 'object' && 'latitude' in cordinatesObj && 'longitude' in cordinatesObj
          ? {
            lat: cordinatesObj.latitude,
            lng: cordinatesObj.longitude,
          }
          : undefined,
        duracionVideo: alertData.media_duration,
        nombrePolicia: newCase.nombrePolicia,
        rango: newCase.rango,
        pnc: newCase.pnc,
        codigoDelito: newCase.codigoDelito,
        user: alertData.user || 'usuario_desconocido',
      };
      console.log('Datos que se enviarán al backend:', partePolicial);
      const res = await createCase(partePolicial);
      console.log('Respuesta del backend:', res);
      setLoadingRequest(false);
      router.push({
        pathname: '/crear-caso',
        params: {
          ...params,
          ...(typeof res === 'object' ? res : {}),
          alertData: params.alertData,
        },
      });
    } catch (err) {
      setLoadingRequest(false);
      console.log('Error al crear caso en backend:', err);
    }
    setNewCase({
      id: '',
      fecha: '',
      ubicacion: '',
      tipo: '',
      estado: '',
      nombrePolicia: '',
      rango: '',
      unidad: '',
      idOficial: '',
      resumen: '',
      palabrasClave: '',
      hora: '',
      pnc: '',
      codigoDelito: 'a',
    });
  };

  // Render the enhanced FAB
  const renderFAB = () => (
    <FAB onPress={handleFabPress} activeOpacity={0.8}>
      <FABGradient
        colors={[theme.colors.primary, theme.colors.accent + 'CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="add" size={28} color={theme.colors.onPrimary} />
        <FABText>Crear</FABText>
      </FABGradient>
    </FAB>
  );

  return (
    <GradientBackground
      colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Header>
        <LogoRow>
          <TouchableOpacity onPress={() => router.push('/')}>
            <LogoImage source={require('../assets/images/icon.png')} />
          </TouchableOpacity>
          <TitleBlock>
            <KunturTitle>KUNTUR</KunturTitle>
            <Subtitle>Seguridad desde las nubes</Subtitle>
          </TitleBlock>
        </LogoRow>
        <BuildingIcon>
          <Ionicons name="business" size={44} color={theme.colors.onPrimary} />
        </BuildingIcon>
      </Header>
      <MainTitle>Casos registrados</MainTitle>
      <FilterRow>
        <FilterButton>
          <Ionicons name="chevron-down" size={18} color={theme.colors.onPrimary} />
          <FilterText>Ubicación</FilterText>
        </FilterButton>
        <FilterButton>
          <Ionicons name="chevron-down" size={18} color={theme.colors.onPrimary} />
          <FilterText>Fecha</FilterText>
        </FilterButton>
      </FilterRow>
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 120 }}>
        {cases.map((c) => (
          <CaseCard key={c.id} onPress={() => openModal(c)}>
            <Ionicons name="document" size={28} color={theme.colors.primary} style={{ marginRight: 12, marginTop: 4 }} />
            <CaseText>
              {`${c.id} | ${c.fecha} | ${c.tipo} | ${c.ubicacion} | Oficial: ${c.oficial} | Estado: ${c.estado}`}
            </CaseText>
          </CaseCard>
        ))}
      </ScrollView>
      {renderFAB()}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <ModalTitle>Crear nuevo caso</ModalTitle>
            <StyledTextInput
              placeholder="ID del Caso"
              placeholderTextColor={theme.colors.onSurface + '99'}
              value={newCase.id}
              onChangeText={(text) => setNewCase({ ...newCase, id: text })}
            />
            <StyledTextInput
              placeholder="Fecha del Incidente"
              placeholderTextColor={theme.colors.onSurface + '99'}
              value={newCase.fecha}
              onChangeText={(text) => setNewCase({ ...newCase, fecha: text })}
            />
            <StyledTextInput
              placeholder="Ubicación"
              placeholderTextColor={theme.colors.onSurface + '99'}
              value={newCase.ubicacion}
              onChangeText={(text) => setNewCase({ ...newCase, ubicacion: text })}
            />
            <StyledTextInput
              placeholder="Tipo de Caso"
              placeholderTextColor={theme.colors.onSurface + '99'}
              value={newCase.tipo}
              onChangeText={(text) => setNewCase({ ...newCase, tipo: text })}
            />
            <StyledTextInput
              placeholder="Estado del Caso"
              placeholderTextColor={theme.colors.onSurface + '99'}
              value={newCase.estado}
              onChangeText={(text) => setNewCase({ ...newCase, estado: text })}
            />
            <Text style={{ color: theme.colors.secondary, fontWeight: '600', fontSize: 15, marginTop: 10, alignSelf: 'flex-start' }}>
              Código de delito
            </Text>
            <Picker
              selectedValue={newCase.codigoDelito}
              style={{ width: '100%', color: theme.colors.secondary, backgroundColor: theme.colors.surface + 'CC', borderRadius: 10, marginBottom: 10 }}
              onValueChange={(itemValue) => setNewCase({ ...newCase, codigoDelito: itemValue })}
            >
              <Picker.Item label="A" value="a" />
              <Picker.Item label="B" value="b" />
              <Picker.Item label="C" value="c" />
              <Picker.Item label="D" value="d" />
            </Picker>
            <Text style={{ color: theme.colors.secondary, fontWeight: '600', fontSize: 16, marginTop: 12, alignSelf: 'flex-start' }}>
              Datos del Oficial que Atendió
            </Text>
            <StyledTextInput
              placeholder="Nombre del Policía"
              placeholderTextColor={theme.colors.onSurface + '99'}
              value={newCase.nombrePolicia}
              onChangeText={(text) => setNewCase({ ...newCase, nombrePolicia: text })}
            />
            <StyledTextInput
              placeholder="Rango"
              placeholderTextColor={theme.colors.onSurface + '99'}
              value={newCase.rango}
              onChangeText={(text) => setNewCase({ ...newCase, rango: text })}
            />
            <StyledTextInput
              placeholder="Placa (PNC)"
              placeholderTextColor={theme.colors.onSurface + '99'}
              value={newCase.pnc}
              onChangeText={(text) => setNewCase({ ...newCase, pnc: text })}
            />
            <Text style={{ color: theme.colors.secondary, fontWeight: '600', fontSize: 16, marginTop: 12, alignSelf: 'flex-start' }}>
              Transcripción del Video de Cámara de Seguridad
            </Text>
            <StyledTextInput
              placeholder="Resumen"
              placeholderTextColor={theme.colors.onSurface + '99'}
              value={newCase.resumen}
              onChangeText={(text) => setNewCase({ ...newCase, resumen: text })}
              multiline
              style={{ minHeight: 80 }}
            />
            <TouchableOpacity
              style={{ borderRadius: 12, marginTop: 24 }}
              onPress={handleCreateCase}
            >
              <GradientButton
                colors={[theme.colors.accent, theme.colors.accent + 'CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={{ color: theme.colors.onPrimary, fontWeight: '700', fontSize: 16, textAlign: 'center', paddingVertical: 12 }}>
                  Confirmar
                </Text>
              </GradientButton>
            </TouchableOpacity>
            <CloseButton onPress={() => setCreateModalVisible(false)}>
              <CloseText>Cancelar</CloseText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <ModalContainer>
          <ModalContent>
            {selectedCase && (
              <>
                <ModalTitle>{selectedCase.id}</ModalTitle>
                <ModalLabel>Fecha:</ModalLabel>
                <ModalValue>{selectedCase.fecha}</ModalValue>
                <ModalLabel>Tipo:</ModalLabel>
                <ModalValue>{selectedCase.tipo}</ModalValue>
                <ModalLabel>Ubicación:</ModalLabel>
                <ModalValue>{selectedCase.ubicacion}</ModalValue>
                <ModalLabel>Oficial:</ModalLabel>
                <ModalValue>{selectedCase.oficial}</ModalValue>
                <ModalLabel>Estado:</ModalLabel>
                <ModalValue>{selectedCase.estado}</ModalValue>
                <ModalLabel>Descripción:</ModalLabel>
                <ModalValue>{selectedCase.descripcion}</ModalValue>
                <TouchableOpacity
                  style={{ borderRadius: 12, marginTop: 24 }}
                  onPress={() => selectedCase && generarParte(selectedCase)}
                >
                  <GradientButton
                    colors={[theme.colors.accent, theme.colors.accent + 'CC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={{ color: theme.colors.onPrimary, fontWeight: '700', fontSize: 16, textAlign: 'center', paddingVertical: 12 }}>
                      Generar parte policial
                    </Text>
                  </GradientButton>
                </TouchableOpacity>
              </>
            )}
            <CloseButton onPress={closeModal}>
              <CloseText>Cerrar</CloseText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
      {loadingRequest && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={{ color: '#fff', marginTop: 12, fontWeight: 'bold' }}>Enviando datos...</Text>
        </View>
      )}
    </GradientBackground>
  );
}