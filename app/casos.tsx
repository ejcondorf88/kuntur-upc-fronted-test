import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useGeneratePartePolicial } from '../hooks/useGeneratePartePolicial';
import { MockCase, useMockCases } from '../hooks/useMockCases';

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
  color: #fff;
  font-size: 20px;
  margin-left: 8px;
`;

const CaseCard = styled.TouchableOpacity`
  background-color: #f5f3ff;
  border-radius: 24px;
  padding: 20px 18px;
  margin: 10px 16px;
  flex-direction: row;
  align-items: flex-start;
  elevation: 2;
`;

const CaseText = styled.Text`
  color: #6D28D9;
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
  background-color: #fff;
  border-radius: 24px;
  padding: 32px 24px;
  width: 90%;
  max-width: 400px;
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #6D28D9;
  margin-bottom: 12px;
`;

const ModalLabel = styled.Text`
  font-size: 16px;
  color: #6D28D9;
  font-weight: bold;
  margin-top: 8px;
`;

const ModalValue = styled.Text`
  font-size: 16px;
  color: #222;
`;

const CloseButton = styled.TouchableOpacity`
  margin-top: 24px;
  align-self: flex-end;
`;

const CloseText = styled.Text`
  color: #8B5CF6;
  font-size: 18px;
  font-weight: bold;
`;

export default function CasosScreen() {
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
  });
  const router = useRouter();

  const openModal = (c: MockCase) => {
    setSelectedCase(c);
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  const handleCreateCase = () => {
    setCreateModalVisible(false);
    // Aquí podrías guardar el caso en un backend o estado global
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
      },
    });
    setNewCase({
      id: '', fecha: '', ubicacion: '', tipo: '', estado: '', nombrePolicia: '', rango: '', unidad: '', idOficial: '', resumen: '',
    });
  };

  return (
    <GradientBackground
      colors={['#8B5CF6', '#3B82F6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Header>
        <LogoRow>
          <LogoImage source={require('../assets/images/icon.png')} />
          <TitleBlock>
            <KunturTitle>KUNTUR</KunturTitle>
            <Subtitle>Seguridad desde las nubes</Subtitle>
          </TitleBlock>
        </LogoRow>
        <BuildingIcon>
          <Ionicons name="business" size={40} color="#fff" />
        </BuildingIcon>
      </Header>
      <MainTitle>Casos</MainTitle>
      <FilterRow>
        <FilterButton>
          <Ionicons name="chevron-down" size={20} color="#fff" />
          <FilterText>Ubicación</FilterText>
        </FilterButton>
        <FilterButton>
          <Ionicons name="chevron-down" size={20} color="#fff" />
          <FilterText>Fecha</FilterText>
        </FilterButton>
      </FilterRow>
      <ScrollView>
        {cases.map((c) => (
          <CaseCard key={c.id} onPress={() => openModal(c)}>
            <Ionicons name="document" size={32} color="#6D28D9" style={{ marginRight: 12, marginTop: 2 }} />
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
          backgroundColor: '#8B5CF6',
          borderRadius: 32,
          width: 64,
          height: 64,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 4,
        }}
        onPress={() => setCreateModalVisible(true)}
      >
        <Ionicons name="add" size={36} color="#fff" />
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
              placeholderTextColor="#b3b3b3"
              style={{ color: '#6D28D9', fontSize: 16, backgroundColor: '#f5f3ff', borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.id}
              onChangeText={text => setNewCase({ ...newCase, id: text })}
            />
            <TextInput
              placeholder="Fecha del Incidente"
              placeholderTextColor="#b3b3b3"
              style={{ color: '#6D28D9', fontSize: 16, backgroundColor: '#f5f3ff', borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.fecha}
              onChangeText={text => setNewCase({ ...newCase, fecha: text })}
            />
            <TextInput
              placeholder="Ubicación"
              placeholderTextColor="#b3b3b3"
              style={{ color: '#6D28D9', fontSize: 16, backgroundColor: '#f5f3ff', borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.ubicacion}
              onChangeText={text => setNewCase({ ...newCase, ubicacion: text })}
            />
            <TextInput
              placeholder="Tipo de Caso"
              placeholderTextColor="#b3b3b3"
              style={{ color: '#6D28D9', fontSize: 16, backgroundColor: '#f5f3ff', borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.tipo}
              onChangeText={text => setNewCase({ ...newCase, tipo: text })}
            />
            <TextInput
              placeholder="Estado del Caso"
              placeholderTextColor="#b3b3b3"
              style={{ color: '#6D28D9', fontSize: 16, backgroundColor: '#f5f3ff', borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.estado}
              onChangeText={text => setNewCase({ ...newCase, estado: text })}
            />
            <Text style={{ color: '#6D28D9', fontWeight: 'bold', fontSize: 16, marginTop: 8, alignSelf: 'flex-start' }}>Datos del Oficial que Atendió</Text>
            <TextInput
              placeholder="Nombre del Policía"
              placeholderTextColor="#b3b3b3"
              style={{ color: '#6D28D9', fontSize: 16, backgroundColor: '#f5f3ff', borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.nombrePolicia}
              onChangeText={text => setNewCase({ ...newCase, nombrePolicia: text })}
            />
            <TextInput
              placeholder="Rango"
              placeholderTextColor="#b3b3b3"
              style={{ color: '#6D28D9', fontSize: 16, backgroundColor: '#f5f3ff', borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.rango}
              onChangeText={text => setNewCase({ ...newCase, rango: text })}
            />
            <TextInput
              placeholder="Unidad"
              placeholderTextColor="#b3b3b3"
              style={{ color: '#6D28D9', fontSize: 16, backgroundColor: '#f5f3ff', borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.unidad}
              onChangeText={text => setNewCase({ ...newCase, unidad: text })}
            />
            <TextInput
              placeholder="ID del Oficial"
              placeholderTextColor="#b3b3b3"
              style={{ color: '#6D28D9', fontSize: 16, backgroundColor: '#f5f3ff', borderRadius: 12, padding: 10, width: '100%', marginBottom: 8 }}
              value={newCase.idOficial}
              onChangeText={text => setNewCase({ ...newCase, idOficial: text })}
            />
            <Text style={{ color: '#6D28D9', fontWeight: 'bold', fontSize: 16, marginTop: 8, alignSelf: 'flex-start' }}>Transcripción del Video de Cámara de Seguridad</Text>
            <TextInput
              placeholder="Resumen"
              placeholderTextColor="#b3b3b3"
              style={{ color: '#6D28D9', fontSize: 16, backgroundColor: '#f5f3ff', borderRadius: 12, padding: 10, width: '100%', marginBottom: 16, minHeight: 48 }}
              value={newCase.resumen}
              onChangeText={text => setNewCase({ ...newCase, resumen: text })}
              multiline
            />
            <TouchableOpacity
              style={{ backgroundColor: '#8B5CF6', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, marginBottom: 12 }}
              onPress={handleCreateCase}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
              <Text style={{ color: '#8B5CF6', fontSize: 16 }}>Cancelar</Text>
            </TouchableOpacity>
          </ModalContent>
        </ModalContainer>
      </Modal>
      <Modal visible={modalVisible} transparent animationType="fade">
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
                  style={{marginTop: 24, backgroundColor: '#8B5CF6', borderRadius: 16, paddingVertical: 12, alignItems: 'center'}}
                  onPress={() => selectedCase && generarParte(selectedCase)}
                >
                  <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>Generar parte policial</Text>
                </TouchableOpacity>
              </>
            )}
            <CloseButton onPress={closeModal}>
              <CloseText>Cerrar</CloseText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </GradientBackground>
  );
} 