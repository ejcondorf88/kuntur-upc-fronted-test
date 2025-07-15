import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Switch, Text, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { useMockElements } from '../hooks/useMockElements';

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
  padding: 20px 18px;
  margin: 10px;
  width: 44%;
  min-width: 160px;
  max-width: 200px;
  align-items: flex-start;
  elevation: 2;
`;

const CardRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const CardText = styled.Text`
  color: #6D28D9;
  font-size: 18px;
  font-weight: 500;
`;

const CardSubText = styled.Text`
  color: #6D28D9;
  font-size: 15px;
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

export default function ElementosScreen() {
  const [showAll, setShowAll] = useState(false);
  const mockElements = useMockElements();
  const [selectedElement, setSelectedElement] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleCardPress = (el) => {
    setSelectedElement(el);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    setModalVisible(false);
    if (selectedElement) {
      router.push({ pathname: '/crear-caso', params: { nombre: selectedElement.nombre } });
    }
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
      <MainTitle>Elementos disponibles</MainTitle>
      <LocationSelector>
        <Ionicons name="chevron-down" size={24} color="#fff" />
        <LocationText>Solanda</LocationText>
      </LocationSelector>
      <CardGrid>
        {mockElements.map((el) => (
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
        ))}
      </CardGrid>
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
                <Text style={{ fontSize: 16, color: '#222', marginBottom: 24 }}>{selectedElement.nombre} {selectedElement.apellido}</Text>
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