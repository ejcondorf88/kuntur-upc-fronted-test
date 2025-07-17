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

const { width, height } = Dimensions.get('window');

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
  opacity: 0.8;
  margin-top: 2px;
`;

const BuildingIcon = styled.View`
  margin-left: 12px;
  background-color: ${({ theme }) => theme.colors.onPrimary}15;
  padding: 8px;
  border-radius: 12px;
`;

const MainTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.onPrimary};
  margin-top: 32px;
  margin-left: 24px;
  margin-bottom: 16px;
  text-shadow: 0px 2px 4px rgba(0,0,0,0.1);
`;

const LocationSelector = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin: 0 24px 20px 24px;
  background-color: ${({ theme }) => theme.colors.onPrimary}15;
  padding: 12px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

const LocationText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.onPrimary};
  margin-left: 8px;
  font-weight: 500;
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
  margin: 0 24px 24px 24px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  elevation: 2;
  shadow-color: ${({ theme }) => theme.colors.cardShadow};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const SwitchLabel = styled.Text`
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 16px;
  font-weight: 600;
  margin-right: 12px;
  flex: 1;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.6);
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 24px;
  padding: 32px;
  width: 90%;
  max-width: 420px;
  elevation: 10;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-radius: 20px;
  shadow-offset: 0px 10px;
`;

const ModalHeader = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.Text`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const ModalSubtitle = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.onSurface};
  text-align: center;
  font-weight: 600;
`;

const ModalSection = styled.View`
  margin-bottom: 20px;
`;

const ModalSectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ModalInfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.surfaceVariant};
`;

const ModalInfoLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.onSurface};
  font-weight: 500;
`;

const ModalInfoValue = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

const ModalButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  padding: 18px;
  align-items: center;
  margin-bottom: 12px;
  elevation: 4;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-opacity: 0.3;
  shadow-radius: 8px;
`;

const ModalButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-weight: 700;
  font-size: 16px;
`;

const CancelButton = styled.TouchableOpacity`
  align-items: center;
  padding: 12px;
`;

const CancelButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 16px;
  font-weight: 600;
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
  const [searchQuery, setSearchQuery] = useState('');
  const { policias, loading, error, page, totalPages, nextPage, prevPage } = usePolicias() as { policias: Element[]; loading: boolean; error: string | null; page: number; totalPages: number; nextPage: () => void; prevPage: () => void };
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnim] = useState(new Animated.Value(0));
  const router = useRouter();
  const params = useLocalSearchParams();
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

  // Filtrar policías basado en la búsqueda
  const filteredPolicias = useMemo(() => {
    if (!searchQuery.trim()) return policias;
    
    const query = searchQuery.toLowerCase();
    return policias.filter(policia => 
      policia.nombre.toLowerCase().includes(query) ||
      policia.apellido.toLowerCase().includes(query) ||
      policia.cargo.toLowerCase().includes(query) ||
      policia.pnc.toLowerCase().includes(query)
    );
  }, [policias, searchQuery]);

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

  // Generar distancia aleatoria para demostración
  const getRandomDistance = () => {
    const distances = ['0.2 km', '0.5 km', '0.8 km', '1.2 km', '1.8 km', '2.5 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  // Simular disponibilidad
  const isAvailable = () => Math.random() > 0.3;

  const renderLoadingState = () => (
    <LoadingContainer>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <LoadingTitle>Cargando elementos disponibles...</LoadingTitle>
      <LoadingSubtitle>Conectando con la base de datos</LoadingSubtitle>
    </LoadingContainer>
  );

  const renderErrorState = () => (
    <ErrorContainer>
      <Ionicons name="alert-circle-outline" size={80} color={theme.colors.error} />
      <ErrorTitle>Error al cargar elementos</ErrorTitle>
      <ErrorSubtitle>{error}</ErrorSubtitle>
      <RetryButton onPress={() => window.location.reload()}>
        <RetryButtonText>Reintentar</RetryButtonText>
      </RetryButton>
    </ErrorContainer>
  );

  const renderEmptyState = () => (
    <EmptyContainer>
      <Ionicons name="people-outline" size={80} color={theme.colors.secondary} />
      <EmptyTitle>No se encontraron elementos</EmptyTitle>
      <EmptySubtitle>
        {searchQuery ? 'Intenta con otros términos de búsqueda' : 'No hay elementos disponibles en esta ubicación'}
      </EmptySubtitle>
    </EmptyContainer>
  );

  const availableCount = filteredPolicias.filter(p => isAvailable()).length;

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
        <Ionicons name="location-outline" size={20} color={theme.colors.onPrimary} />
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
      </SearchContainer>

      {/* Contenido principal */}
      {loading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : filteredPolicias.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <CardGrid showsVerticalScrollIndicator={false}>
            {filteredPolicias.map((el) => {
              const available = isAvailable();
              return (
                <ElementCard key={el.id} onPress={() => handleCardPress(el)}>
                  <CardGradient
                    colors={[theme.colors.primary, theme.colors.primary + '40']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                  <CardHeader>
                    <AvatarContainer>
                      <Ionicons name="person-outline" size={28} color={theme.colors.primary} />
                    </AvatarContainer>
                    <CardInfo>
                      <CardName>{el.nombre} {el.apellido}</CardName>
                      <CardRank>{el.cargo}</CardRank>
                    </CardInfo>
                    <StatusContainer available={available}>
                      <StatusIndicator available={available} />
                      <StatusText available={available}>
                        {available ? 'Disponible' : 'Ocupado'}
                      </StatusText>
                    </StatusContainer>
                  </CardHeader>
                  <CardDetails>
                    <PncBadge>
                      <PncText>PNC-{el.pnc}</PncText>
                    </PncBadge>
                    <DistanceContainer>
                      <Ionicons name="location-outline" size={12} color={theme.colors.secondary} />
                      <DistanceText>{getRandomDistance()}</DistanceText>
                    </DistanceContainer>
                  </CardDetails>
                </ElementCard>
              );
            })}
          </CardGrid>

          {/* Paginación mejorada */}
          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton disabled={page === 1} onPress={prevPage}>
                <Ionicons 
                  name="chevron-back" 
                  size={16} 
                  color={page === 1 ? theme.colors.secondary : theme.colors.onPrimary}
                  style={{ marginRight: 4 }}
                />
                <PaginationText disabled={page === 1}>Anterior</PaginationText>
              </PaginationButton>
              
              <PageInfo>{page} de {totalPages}</PageInfo>
              
              <PaginationButton disabled={page === totalPages} onPress={nextPage}>
                <PaginationText disabled={page === totalPages}>Siguiente</PaginationText>
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color={page === totalPages ? theme.colors.secondary : theme.colors.onPrimary}
                  style={{ marginLeft: 4 }}
                />
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}

      <SwitchRow>
        <SwitchLabel>Mostrar todos los elementos más cercanos</SwitchLabel>
        <Switch
          value={showAll}
          onValueChange={setShowAll}
          thumbColor={showAll ? theme.colors.primary : theme.colors.onPrimary}
          trackColor={{ true: theme.colors.primary + '40', false: theme.colors.surfaceVariant }}
        />
      </SwitchRow>

      {/* Modal completamente rediseñado */}
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