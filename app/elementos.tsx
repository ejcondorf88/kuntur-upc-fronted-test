import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Switch, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { usePolicias } from '../hooks/usePolicias';

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

const LocationSelector = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-left: 32px;
  margin-bottom: 24px;
`;

const LocationText = styled.Text`
  font-size: 20px;
  color: #fff;
  margin-left: 8px;
`;

const CardGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const ElementCard = styled.View`
  background-color: #f5f3ff;
  border-radius: 24px;
  padding: 24px 16px;
  margin: 10px;
  width: 44%;
  min-width: 160px;
  max-width: 220px;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
`;

const CardRow = styled.View`
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
`;

const CardText = styled.Text`
  color: #6D28D9;
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CardSubText = styled.Text`
  color: #6D28D9;
  font-size: 14px;
  text-align: center;
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SwitchRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 32px 24px 0 24px;
`;

const SwitchLabel = styled.Text`
  color: #fff;
  font-size: 17px;
  margin-right: 12px;
`;

type Element = {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  pnc: string;
};

export default function ElementosScreen() {
  const [showAll, setShowAll] = useState(false);
  const { policias, loading, error, page, totalPages, nextPage, prevPage } = usePolicias() as { policias: Element[]; loading: boolean; error: string | null; page: number; totalPages: number; nextPage: () => void; prevPage: () => void };
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log('Params recibidos en /elementos:', params);

  const handleCardPress = (el: Element) => {
    setSelectedElement(el);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    if (selectedElement) {
      router.push({
        pathname: '/casos',
        params: {
          ip: params.ip || '',
          location: params.location || '',
          date: params.date || '',
          time: params.time || '',
          transcription_video: params.transcription_video || '',
          key_words: params.key_words || '',
        }
      });
    }
  };

  const locationValue = params.location || 'Ubicación no disponible';

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
      <MainTitle>Elementos disponibles</MainTitle>
      <LocationSelector>
        <Ionicons name="chevron-down" size={24} color="#fff" />
        <LocationText>{locationValue}</LocationText>
      </LocationSelector>
      <CardGrid>
        {loading ? (
          <Text style={{ color: '#fff', fontSize: 18 }}>Cargando policías...</Text>
        ) : error ? (
          <Text style={{ color: 'red', fontSize: 18 }}>Error: {error}</Text>
        ) : (
          policias.map((el) => (
            <TouchableOpacity key={el.id} onPress={() => handleCardPress(el)}>
              <ElementCard>
                <CardRow>
                  <Ionicons name="person" size={28} color="#6D28D9" style={{ marginRight: 8 }} />
                  <View>
                    <CardText>{el.nombre} {el.apellido}</CardText>
                    <CardSubText>{el.cargo}  ID:{'\n'}PNC-{el.pnc}</CardSubText>
                  </View>
                </CardRow>
              </ElementCard>
            </TouchableOpacity>
          ))
        )}
      </CardGrid>
      {/* Controles de paginación */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
        <TouchableOpacity onPress={prevPage} disabled={page === 1} style={{ opacity: page === 1 ? 0.5 : 1, marginHorizontal: 16 }}>
          <Text style={{ color: '#8B5CF6', fontSize: 18 }}>{'< Anterior'}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 16 }}>{`Página ${page} de ${totalPages}`}</Text>
        <TouchableOpacity onPress={nextPage} disabled={page === totalPages} style={{ opacity: page === totalPages ? 0.5 : 1, marginHorizontal: 16 }}>
          <Text style={{ color: '#8B5CF6', fontSize: 18 }}>{'Siguiente >'}</Text>
        </TouchableOpacity>
      </View>
      <SwitchRow>
        <SwitchLabel>Mostrar todos los elementos más cercanos</SwitchLabel>
        <Switch
          value={showAll}
          onValueChange={setShowAll}
          thumbColor={showAll ? '#8B5CF6' : '#fff'}
          trackColor={{ true: '#c4b5fd', false: '#e5e7eb' }}
        />
      </SwitchRow>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 32, width: '90%', maxWidth: 400, alignItems: 'center' }}>
            {selectedElement && (
              <>
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#6D28D9', marginBottom: 12 }}>Enviar elemento</Text>
                <Text style={{ fontSize: 16, color: '#222', marginBottom: 8 }}>{selectedElement.nombre} {selectedElement.apellido}</Text>
                {/* Mostrar la IP y otros datos recibidos por params */}
                {params.ip && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 4 }}>IP: {params.ip}</Text>}
                {params.location && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 4 }}>Ubicación: {params.location}</Text>}
                {params.date && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 4 }}>Fecha: {params.date}</Text>}
                {params.time && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 4 }}>Hora: {params.time}</Text>}
                {params.transcription_video && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 4 }}>Transcripción: {params.transcription_video}</Text>}
                {params.key_words && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 8 }}>Palabras clave: {params.key_words}</Text>}
                <TouchableOpacity
                  style={{ backgroundColor: '#8B5CF6', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, marginBottom: 12 }}
                  onPress={handleConfirm}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Confirmar y crear caso</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={{ color: '#8B5CF6', fontSize: 16 }}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
} 