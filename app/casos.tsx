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

const GradientBackground = styled(LinearGradient)`
  flex: 1;
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

const FilterRow = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-left: 24px;
  margin-bottom: 16px;
`;

const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 32px;
`;

const FilterText = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 20px;
  margin-left: 8px;
`;

const CaseCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 20px 18px;
  margin: 10px 16px;
  flex-direction: row;
  align-items: flex-start;
  elevation: 2;
  shadow-color: ${({ theme }) => theme.colors.cardShadow};
  shadow-opacity: 0.12;
  shadow-radius: 8px;
`;

const CaseText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  font-weight: 500;
  flex: 1;
`;

const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.4);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 32px 24px;
  width: 90%;
  max-width: 400px;
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 12px;
`;

const ModalLabel = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: bold;
  margin-top: 8px;
`;

const ModalValue = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
  margin-top: 24px;
  align-self: flex-end;
`;

const CloseText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 18px;
  font-weight: bold;
`;

const AnimatedModalContent = Animated.createAnimatedComponent(ModalContent);

export default function CasosScreen() {
  const theme = useTheme();
  const cases = useMockCases();
  const [selectedCase, setSelectedCase] = useState<MockCase | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { generarParte } = useGeneratePartePolicial();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newCase, setNewCase] = useState({
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
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log('Params recibidos en /casos:', params);
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
    // Solo ejecutar cuando se abre el modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModalVisible]);

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
      // Deserializar cordinates si es string
      let cordinatesObj = undefined;
      if (params.cordinates) {
        try {
          cordinatesObj = typeof params.cordinates === 'string' ? JSON.parse(params.cordinates) : params.cordinates;
        } catch (e) {
          cordinatesObj = undefined;
        }
      }
      // Construir el objeto partePolicial con la información relevante
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
      // Visualizar PDF si la respuesta es un blob (PDF)
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
          <Ionicons name="chevron-down" size={20} color={theme.colors.onPrimary} />
          <FilterText>Ubicación</FilterText>
        </FilterButton>
        <FilterButton>
          <Ionicons name="chevron-down" size={20} color={theme.colors.onPrimary} />
          <FilterText>Fecha</FilterText>
        </FilterButton>
      </FilterRow>
      <ScrollView>
        {cases.map((c) => (
          <CaseCard key={c.id} onPress={() => openModal(c)}>
            <Ionicons name="document" size={32} color={theme.colors.primary} style={{ marginRight: 12, marginTop: 2 }} />
            <CaseText>
              {`${c.id} | ${c.fecha} | ${c.tipo} | ${c.ubicacion} | Oficial: ${c.oficial} | Estado: ${c.estado}`}
            </CaseText>
          </CaseCard>
        ))}
      </ScrollView>
      {/* Botón flotante para crear caso */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 32,
          right: 32,
          backgroundColor: theme.colors.secondary,
          borderRadius: 32,
          width: 64,
          height: 64,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 4,
        }}
        onPress={() => setCreateModalVisible(true)}
      >
        <Ionicons name="add" size={36} color={theme.colors.onPrimary} />
      </TouchableOpacity>
      {/* Modal para crear caso */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent style={{ alignItems: 'center' }}>
            <ModalTitle>Crear nuevo caso</ModalTitle>
            <TextInput
              placeholder="ID del Caso"
              placeholderTextColor={theme.colors.onSurface}
              style={{ color: theme.colors.secondary, fontSize: 16, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.id}
              onChangeText={text => setNewCase({ ...newCase, id: text })}
            />
            <TextInput
              placeholder="Fecha del Incidente"
              placeholderTextColor={theme.colors.onSurface}
              style={{ color: theme.colors.secondary, fontSize: 16, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.fecha}
              onChangeText={text => setNewCase({ ...newCase, fecha: text })}
            />
            <TextInput
              placeholder="Ubicación"
              placeholderTextColor={theme.colors.onSurface}
              style={{ color: theme.colors.secondary, fontSize: 16, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.ubicacion}
              onChangeText={text => setNewCase({ ...newCase, ubicacion: text })}
            />
            <TextInput
              placeholder="Tipo de Caso"
              placeholderTextColor={theme.colors.onSurface}
              style={{ color: theme.colors.secondary, fontSize: 16, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.tipo}
              onChangeText={text => setNewCase({ ...newCase, tipo: text })}
            />
            <TextInput
              placeholder="Estado del Caso"
              placeholderTextColor={theme.colors.onSurface}
              style={{ color: theme.colors.secondary, fontSize: 16, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.estado}
              onChangeText={text => setNewCase({ ...newCase, estado: text })}
            />
            <Text style={{ color: theme.colors.secondary, fontWeight: 'bold', fontSize: 16, marginTop: 8, alignSelf: 'flex-start' }}>Datos del Oficial que Atendió</Text>
            <TextInput
              placeholder="Nombre del Policía"
              placeholderTextColor={theme.colors.onSurface}
              style={{ color: theme.colors.secondary, fontSize: 16, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.nombrePolicia}
              onChangeText={text => setNewCase({ ...newCase, nombrePolicia: text })}
            />
            <TextInput
              placeholder="Rango"
              placeholderTextColor={theme.colors.onSurface}
              style={{ color: theme.colors.secondary, fontSize: 16, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.rango}
              onChangeText={text => setNewCase({ ...newCase, rango: text })}
            />
            <TextInput
              placeholder="Placa (PNC)"
              placeholderTextColor={theme.colors.onSurface}
              style={{ color: theme.colors.secondary, fontSize: 16, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.pnc}
              onChangeText={text => setNewCase({ ...newCase, pnc: text })}
            />
            <Text style={{ color: theme.colors.secondary, fontWeight: 'bold', fontSize: 16, marginTop: 8, alignSelf: 'flex-start' }}>Transcripción del Video de Cámara de Seguridad</Text>
            <TextInput
              placeholder="Resumen"
              placeholderTextColor={theme.colors.onSurface}
              style={{ color: theme.colors.secondary, fontSize: 16, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 10, width: '100%', marginBottom: 16, minHeight: 48 }}
              value={newCase.resumen}
              onChangeText={text => setNewCase({ ...newCase, resumen: text })}
              multiline
            />
            <TouchableOpacity
              style={{ backgroundColor: theme.colors.secondary, borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, marginBottom: 12 }}
              onPress={handleCreateCase}
            >
              <Text style={{ color: theme.colors.onPrimary, fontWeight: 'bold', fontSize: 16 }}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
              <Text style={{ color: theme.colors.secondary, fontSize: 16 }}>Cancelar</Text>
            </TouchableOpacity>
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