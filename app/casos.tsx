import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Modal, ScrollView, Text, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import styled from 'styled-components/native';
import { Header as AppHeader } from '../components/Header';
import { useCreateCase } from '../hooks/useCreateCase';
import { useGeneratePartePolicial } from '../hooks/useGeneratePartePolicial';
import { MockCase, useMockCases } from '../hooks/useMockCases';
import { useTheme } from '../theme/them';

// Gradient background with softer colors
const GradientBackground = styled(LinearGradient)`
  flex: 1;
  padding: 16px;
`;

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
  padding: 24px;
  width: 90%;
  max-width: 420px;
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

// Floating action button with gradient
const FAB = styled(LinearGradient)`
  position: absolute;
  bottom: 32px;
  right: 32px;
  border-radius: 32px;
  width: 64px;
  height: 64px;
  justify-content: center;
  align-items: center;
  elevation: 6;
  shadow-color: ${({ theme }) => theme.colors.cardShadow};
  shadow-opacity: 0.4;
  shadow-radius: 8px;
`;

const BottomArea = styled.View`
  position: absolute;
  left: 32px;
  bottom: 48px;
  align-items: flex-start;
  padding: 0 24px;
`;

const AnimatedButton = styled(Animated.View)`
  width: 100%;
  max-width: 320px;
`;

const AnimatedModalContent = Animated.createAnimatedComponent(ModalContent);

export default function CasosScreen() {
  const theme = useTheme();
  const cases = useMockCases();
  const { generarParte } = useGeneratePartePolicial();
  const [selectedCase, setSelectedCase] = useState<MockCase | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newCase, setNewCase] = useState({
    id: '', fecha: '', ubicacion: '', tipo: '', estado: '', nombrePolicia: '', rango: '', unidad: '', idOficial: '', resumen: '', palabrasClave: '', hora: '', pnc: '',
  });
  const router = useRouter();
  const params = useLocalSearchParams();
  const { createCase, loading, error, result } = useCreateCase();
  const [modalAnim] = useState(new Animated.Value(0));
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (createModalVisible) {
      console.log('Autollenando modal de crear caso con:', params);
      setNewCase((prev) => {
        const ubicacion = (typeof params.location === 'string' ? params.location : Array.isArray(params.location) ? params.location[0] : '') || prev.ubicacion;
        const fecha = (typeof params.date === 'string' ? params.date : Array.isArray(params.date) ? params.date[0] : '') || prev.fecha;
        const resumen = (typeof params.transcription_video === 'string' ? params.transcription_video : Array.isArray(params.transcription_video) ? params.transcription_video[0] : '') || prev.resumen;
        const palabrasClave = (typeof params.key_words === 'string' ? params.key_words : Array.isArray(params.key_words) ? params.key_words[0] : '') || prev.palabrasClave || '';
        const hora = (typeof params.time === 'string' ? params.time : Array.isArray(params.time) ? params.time[0] : '') || prev.hora || '';
        const nombrePolicia = (typeof params.nombrePolicia === 'string' ? params.nombrePolicia : Array.isArray(params.nombrePolicia) ? params.nombrePolicia[0] : '') || prev.nombrePolicia || '';
        const rango = (typeof params.rango === 'string' ? params.rango : Array.isArray(params.rango) ? params.rango[0] : '') || prev.rango || '';
        const pnc = (typeof params.pnc === 'string' ? params.pnc : Array.isArray(params.pnc) ? params.pnc[0] : '') || prev.pnc || '';
        return {
          ...prev,
          ubicacion,
          fecha,
          resumen,
          palabrasClave,
          hora,
          nombrePolicia,
          rango,
          pnc,
        };
      });
    }
  }, [createModalVisible, params]);

  const openModal = (c: MockCase) => {
    setSelectedCase(c);
    setModalVisible(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const closeModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const handleCreateCase = async () => {
    setCreateModalVisible(false);
    try {
      let cordinatesObj = undefined;
      if (params.cordinates) {
        try {
          cordinatesObj = typeof params.cordinates === 'string' ? JSON.parse(params.cordinates) : params.cordinates;
        } catch (e) {
          cordinatesObj = undefined;
        }
      }
      const partePolicial = {
        ubicacion: params.location || newCase.ubicacion,
        fecha: params.date || newCase.fecha,
        hora: params.time || newCase.hora,
        descripcion: params.transcription_video || newCase.resumen,
        palabrasClave: params.key_words || newCase.palabrasClave,
        nivelConfianza: params.confidence_level,
        alerta: params.alert_information,
        dispositivo: {
          id: params.device_id,
          tipo: params.device_type,
          ip: params.ip || params.stream_url,
        },
        coordenadas:
          cordinatesObj && typeof cordinatesObj === 'object' && 'latitude' in cordinatesObj && 'longitude' in cordinatesObj
            ? {
                lat: cordinatesObj.latitude,
                lng: cordinatesObj.longitude,
              }
            : undefined,
        duracionVideo: params.media_duration,
        nombrePolicia: newCase.nombrePolicia,
        rango: newCase.rango,
        pnc: newCase.pnc,
      };
      console.log('Parte policial a enviar:', partePolicial);
      const res = await createCase(partePolicial);
      if (res instanceof Blob) {
        const pdfUrl = URL.createObjectURL(res);
        window.open(pdfUrl, '_blank');
      } else {
        console.log('Caso creado en backend:', res);
      }
    } catch (err) {
      console.log('Error al crear caso en backend:', err);
    }
    router.push({
      pathname: '/crear-caso',
      params: {
        id: newCase.id,
        fecha: newCase.fecha,
        ubicacion: newCase.ubicacion,
        tipo: newCase.tipo,
        estado: newCase.estado,
        nombrePolicia: newCase.nombrePolicia,
        rango: newCase.rango,
        unidad: newCase.unidad,
        idOficial: newCase.idOficial,
        resumen: newCase.resumen,
        palabrasClave: newCase.palabrasClave,
        hora: newCase.hora,
        pnc: newCase.pnc,
      },
    });
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
    });
  };

  return (
    <GradientBackground
      colors={[theme.colors.primary, theme.colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <AppHeader
        title="Casos"
        subtitle="Lista de casos recientes"
      />
      <MainTitle>Casos detectados</MainTitle>
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
      <BottomArea>
        <AnimatedButton style={{ transform: [{ scale: buttonScaleAnim }] }}>
          <Button
            title="Crear caso"
            onPress={handleFabPress}
            variant="outline"
            size="large"
            icon={<Ionicons name="add" size={28} color={theme.colors.secondary} />}
            style={{
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.secondary,
              borderWidth: 2,
              borderRadius: 32,
              paddingVertical: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              width: 64,
              height: 64,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            textStyle={{
              color: theme.colors.secondary,
              fontWeight: 'bold',
              fontSize: 18,
              letterSpacing: 1,
            }}
          />
        </AnimatedButton>
      </BottomArea>
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
      <Modal visible={modalVisible} transparent animationType="none">
        <BlurView intensity={60} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={{ flex: 1 }}>
          <ModalContainer>
            <AnimatedModalContent
              style={{
                opacity: modalAnim,
                transform: [
                  {
                    scale: modalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 24,
                elevation: 12,
              }}
            >
              <ModalTitle>Detalle del caso</ModalTitle>
              {selectedCase && (
                <>
                  <ModalLabel>ID:</ModalLabel>
                  <ModalValue>{selectedCase.id}</ModalValue>
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
                    style={{marginTop: 24, backgroundColor: theme.colors.secondary, borderRadius: 16, paddingVertical: 12, alignItems: 'center'}}
                    onPress={() => selectedCase && generarParte(selectedCase)}
                  >
                    <Text style={{color: theme.colors.onPrimary, fontWeight: 'bold', fontSize: 16}}>Generar parte policial</Text>
                  </TouchableOpacity>
                </>
              )}
              <CloseButton onPress={closeModal}>
                <CloseText>Cerrar</CloseText>
              </CloseButton>
            </AnimatedModalContent>
          </ModalContainer>
        </BlurView>
      </Modal>
    </GradientBackground>
  );
}