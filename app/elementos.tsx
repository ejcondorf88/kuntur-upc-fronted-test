import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Switch, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import styled from 'styled-components/native';
import { Header as AppHeader } from '../components/Header';
import { usePolicias } from '../hooks/usePolicias';
import { useTheme } from '../theme/them';

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

const LocationSelector = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-left: 32px;
  margin-bottom: 24px;
`;

const LocationText = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.onPrimary};
  margin-left: 8px;
`;

const getCardWidth = () => {
  const screenWidth = Dimensions.get('window').width;
  if (screenWidth < 500) return '98%'; // 1 por fila
  if (screenWidth < 900) return '46%'; // 2 por fila
  return '30%'; // 3 por fila
};

const CardGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  padding-bottom: 24px;
`;

const GradientCard = styled(Animated.View)<{ cardwidth: string }>`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-radius: 28px;
  padding: 24px 20px;
  margin: 16px 12px 0 12px;
  width: ${({ cardwidth }) => cardwidth};
  max-width: 320px;
  shadow-color: #000;
  shadow-opacity: 0.10;
  shadow-radius: 12px;
  elevation: 6;
  border-width: 0;
`;

const AvatarWrapper = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: #e6e9f0;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
`;

const CardContent = styled.View`
  flex: 1;
  justify-content: center;
`;

const CardText = styled.Text`
  color: #6c4eb6;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 2px;
`;

const CardSubText = styled.Text`
  color: #6c4eb6;
  font-size: 15px;
  font-weight: 400;
`;

const SwitchRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 32px 24px 0 24px;
`;

const SwitchLabel = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 17px;
  margin-right: 12px;
`;

const ModalContent = styled.View`
  background-color: #fff;
  border-radius: 24px;
  padding: 32px;
  width: 90%;
  max-width: 400px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.18;
  shadow-radius: 24;
  elevation: 12;
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
`;

const ModalLabel = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 4px;
  align-self: flex-start;
`;

const ModalValue = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.onSurface};
  margin-bottom: 12px;
  text-align: left;
  width: 100%;
`;

const CloseButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 16px;
  padding-vertical: 12px;
  padding-horizontal: 32px;
  margin-top: 12px;
`;

const CloseText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

type Element = {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  pnc: string;
};

const AnimatedModalContent = Animated.createAnimatedComponent(ModalContent);

export default function ElementosScreen() {
  const [showAll, setShowAll] = useState(false);
  const { policias, loading, error, page, totalPages, nextPage, prevPage } = usePolicias() as { policias: Element[]; loading: boolean; error: string | null; page: number; totalPages: number; nextPage: () => void; prevPage: () => void };
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnim] = useState(new Animated.Value(0));
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log('Params recibidos en /elementos:', params);
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const appearAnims = useRef<Animated.Value[]>([]);

  useEffect(() => {
    if (policias && policias.length > 0) {
      appearAnims.current = policias.map(() => new Animated.Value(0));
      Animated.stagger(80, appearAnims.current.map(anim =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      )).start();
    }
  }, [policias]);

  const handleCardPress = (el: Element) => {
    setSelectedElement(el);
    setModalVisible(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleConfirm = () => {
    setModalVisible(false);
    if (selectedElement) {
      router.push({
        pathname: '/casos',
        params: {
          location: params.location || '',
          date: params.date || '',
          time: params.time || '',
          transcription_video: params.transcription_video || '',
          key_words: params.key_words || '',
          nombrePolicia: `${selectedElement.nombre} ${selectedElement.apellido}`,
          rango: selectedElement.cargo,
          pnc: selectedElement.pnc,
          cordinates: params.cordinates ? (typeof params.cordinates === 'string' ? params.cordinates : JSON.stringify(params.cordinates)) : undefined,
          confidence_level: params.confidence_level || undefined,
        }
      });
    }
  };

  const handleClose = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const locationValue = params.location || 'Ubicación no disponible';

  return (
    <GradientBackground
      colors={[theme.colors.primary, theme.colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <AppHeader
        title="Elementos"
        subtitle="Personal policial disponible"
      />
      <MainTitle>Elementos</MainTitle>
      <LocationSelector>
        <Ionicons name="chevron-down" size={24} color={theme.colors.onPrimary} />
        <LocationText>{locationValue}</LocationText>
      </LocationSelector>
      <CardGrid>
        {loading ? (
          <Text style={{ color: theme.colors.onPrimary, fontSize: 18 }}>Cargando policías...</Text>
        ) : error ? (
          <Text style={{ color: theme.colors.error, fontSize: 18 }}>Error: {error}</Text>
        ) : (
          policias.map((el, idx) => {
            const animatedValue = new Animated.Value(1);
            const appearAnim = appearAnims.current[idx] || new Animated.Value(1);
            return (
              <TouchableOpacity
                key={el.id}
                onPress={() => handleCardPress(el)}
                activeOpacity={0.85}
                onPressIn={() => Animated.spring(animatedValue, { toValue: 0.97, useNativeDriver: true }).start()}
                onPressOut={() => Animated.spring(animatedValue, { toValue: 1, useNativeDriver: true }).start()}
              >
                <GradientCard
                  cardwidth={getCardWidth()}
                  style={{
                    transform: [
                      { scale: animatedValue },
                      { translateY: appearAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
                    ],
                    opacity: appearAnim,
                  }}
                >
                  <AvatarWrapper>
                    <Ionicons name="person" size={28} color="#4b3c7a" />
                  </AvatarWrapper>
                  <CardContent>
                    <CardText>{el.nombre} {el.apellido}</CardText>
                    <CardSubText>{el.cargo}  ID:
PNC-{el.pnc}</CardSubText>
                  </CardContent>
                </GradientCard>
              </TouchableOpacity>
            );
          })
        )}
      </CardGrid>
      {/* Controles de paginación */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
        <TouchableOpacity onPress={prevPage} disabled={page === 1} style={{ opacity: page === 1 ? 0.5 : 1, marginHorizontal: 16 }}>
          <Text style={{ color: theme.colors.secondary, fontSize: 18 }}>{'< Anterior'}</Text>
        </TouchableOpacity>
        <Text style={{ color: theme.colors.onPrimary, fontSize: 16 }}>{`Página ${page} de ${totalPages}`}</Text>
        <TouchableOpacity onPress={nextPage} disabled={page === totalPages} style={{ opacity: page === totalPages ? 0.5 : 1, marginHorizontal: 16 }}>
          <Text style={{ color: theme.colors.secondary, fontSize: 18 }}>{'Siguiente >'}</Text>
        </TouchableOpacity>
      </View>
      <SwitchRow>
        <SwitchLabel>Mostrar todos los elementos más cercanos</SwitchLabel>
        <Switch
          value={showAll}
          onValueChange={setShowAll}
          thumbColor={showAll ? theme.colors.secondary : theme.colors.onPrimary}
          trackColor={{ true: theme.colors.secondary + '55', false: theme.colors.surfaceVariant }}
        />
      </SwitchRow>
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
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
              <ModalTitle>Detalle del elemento</ModalTitle>
              {selectedElement && (
                <>
                  <ModalLabel>Nombre:</ModalLabel>
                  <ModalValue>{selectedElement.nombre} {selectedElement.apellido}</ModalValue>
                  <ModalLabel>Cargo:</ModalLabel>
                  <ModalValue>{selectedElement.cargo}</ModalValue>
                  <ModalLabel>PNC:</ModalLabel>
                  <ModalValue>{selectedElement.pnc}</ModalValue>
                </>
              )}
              <CloseButton onPress={handleClose}>
                <CloseText>Cerrar</CloseText>
              </CloseButton>
            </AnimatedModalContent>
          </ModalContainer>
        </BlurView>
      </Modal>
    </GradientBackground>
  );
} 