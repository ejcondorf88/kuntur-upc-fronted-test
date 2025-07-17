import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Modal, Switch, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
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

const SearchContainer = styled.View`
  margin: 0 24px 20px 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 24px;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  elevation: 6;
  shadow-color: ${({ theme }) => theme.colors.cardShadow};
  shadow-opacity: 0.15;
  shadow-radius: 12px;
  shadow-offset: 0px 4px;
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  padding: 16px 12px;
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 16px;
  font-weight: 500;
`;

const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 0 24px 24px 24px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
  elevation: 4;
  shadow-color: ${({ theme }) => theme.colors.cardShadow};
  shadow-opacity: 0.12;
  shadow-radius: 8px;
  shadow-offset: 0px 2px;
`;

const StatItem = styled.View`
  align-items: center;
  flex: 1;
`;

const StatNumber = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatDivider = styled.View`
  width: 1px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.surfaceVariant};
  margin: 0 16px;
`;

const CardGrid = styled.ScrollView`
  flex: 1;
  padding: 0 16px;
`;

const ElementCard = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
  padding: 24px;
  margin: 8px;
  elevation: 5;
  shadow-color: ${({ theme }) => theme.colors.cardShadow};
  shadow-opacity: 0.18;
  shadow-radius: 12px;
  shadow-offset: 0px 4px;
  border: 1px solid ${({ theme }) => theme.colors.primary}10;
  position: relative;
  overflow: hidden;
`;

const CardGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
`;

const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const AvatarContainer = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.colors.primary}15;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  border: 2px solid ${({ theme }) => theme.colors.primary}30;
`;

const CardInfo = styled.View`
  flex: 1;
`;

const CardName = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const CardRank = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.secondary}10;
  padding: 4px 8px;
  border-radius: 8px;
  align-self: flex-start;
`;

const StatusContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ available, theme }) => available ? '#4CAF50' : '#FF5722'}15;
  padding: 6px 12px;
  border-radius: 16px;
`;

const StatusIndicator = styled.View<{ available: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ available }) => available ? '#4CAF50' : '#FF5722'};
  margin-right: 6px;
`;

const StatusText = styled.Text<{ available: boolean }>`
  color: ${({ available }) => available ? '#4CAF50' : '#FF5722'};
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
`;

const CardDetails = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.surfaceVariant};
`;

const PncBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.primary}20;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
`;

const PncText = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const DistanceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surfaceVariant};
  padding: 6px 10px;
  border-radius: 10px;
`;

const DistanceText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
`;

const LoadingTitle = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 20px;
  font-weight: 700;
  margin-top: 24px;
  text-align: center;
`;

const LoadingSubtitle = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  opacity: 0.7;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
`;

const ErrorTitle = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  font-size: 20px;
  font-weight: 700;
  margin-top: 24px;
  text-align: center;
`;

const ErrorSubtitle = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  opacity: 0.7;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const RetryButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 16px 32px;
  border-radius: 16px;
  margin-top: 20px;
  elevation: 3;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-opacity: 0.3;
  shadow-radius: 8px;
`;

const RetryButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-weight: 700;
  font-size: 16px;
`;

const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
`;

const EmptyTitle = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 20px;
  font-weight: 700;
  margin-top: 24px;
  text-align: center;
`;

const EmptySubtitle = styled.Text`
  color: ${({ theme }) => theme.colors.onPrimary};
  opacity: 0.7;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin: 16px 24px 8px 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  elevation: 2;
  shadow-color: ${({ theme }) => theme.colors.cardShadow};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const PaginationButton = styled.TouchableOpacity<{ disabled: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${({ disabled, theme }) => disabled ? theme.colors.surfaceVariant : theme.colors.primary};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  elevation: ${({ disabled }) => disabled ? 0 : 2};
`;

const PaginationText = styled.Text<{ disabled: boolean }>`
  color: ${({ disabled, theme }) => disabled ? theme.colors.secondary : theme.colors.onPrimary};
  font-weight: 600;
  font-size: 14px;
`;

const PageInfo = styled.Text`
  color: ${({ theme }) => theme.colors.onSurface};
  font-size: 14px;
  font-weight: 600;
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

type Element = {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  pnc: string;
};

export default function ElementosScreen() {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { policias, loading, error, page, totalPages, nextPage, prevPage } = usePolicias() as { policias: Element[]; loading: boolean; error: string | null; page: number; totalPages: number; nextPage: () => void; prevPage: () => void };
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const alertData = params.alertData ? JSON.parse(params.alertData) : {};
  console.log('alertData recibido en elementos:', alertData);
  const theme = useTheme();

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
  };

  const handleConfirm = () => {
    setModalVisible(false);
    if (selectedElement) {
      console.log('Enviando alertData a casos:', alertData);
      router.push({
        pathname: '/casos',
        params: {
          alertData: params.alertData,
          nombrePolicia: `${selectedElement.nombre} ${selectedElement.apellido}`,
          rango: selectedElement.cargo,
          pnc: selectedElement.pnc,
        }
      });
    }
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

  // Llenar el modal con datos de alertData cuando se abra
  useEffect(() => {
    if (modalVisible && alertData) {
      // Aquí puedes setear estados locales si el modal necesita mostrar datos de alertData
      // Por ejemplo, si tienes un estado para mostrar la ubicación, fecha, etc. en el modal, puedes hacer:
      // setSomeState(alertData.location || '');
      // setOtherState(alertData.date || '');
      // O simplemente acceder a alertData directamente en el render del modal
      console.log('Llenando modal con datos de alertData:', alertData);
    }
  }, [modalVisible, alertData]);

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
          <Ionicons name="business-outline" size={24} color={theme.colors.onPrimary} />
        </BuildingIcon>
      </Header>

      <MainTitle>Elementos disponibles</MainTitle>
      
      <LocationSelector>
        <Ionicons name="location-outline" size={20} color={theme.colors.onPrimary} />
        <LocationText>{locationValue}</LocationText>
      </LocationSelector>

      {/* Estadísticas mejoradas */}
      <StatsContainer>
        <StatItem>
          <StatNumber>{filteredPolicias.length}</StatNumber>
          <StatLabel>Elementos</StatLabel>
        </StatItem>
        <StatDivider />
        <StatItem>
          <StatNumber>{availableCount}</StatNumber>
          <StatLabel>Disponibles</StatLabel>
        </StatItem>
        <StatDivider />
        <StatItem>
          <StatNumber>{getRandomDistance()}</StatNumber>
          <StatLabel>Más cercano</StatLabel>
        </StatItem>
      </StatsContainer>

      {/* Búsqueda mejorada */}
      <SearchContainer>
        <Ionicons name="search-outline" size={20} color={theme.colors.secondary} />
        <SearchInput
          placeholder="Buscar por nombre, rango o PNC..."
          placeholderTextColor={theme.colors.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.secondary} />
          </TouchableOpacity>
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
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContent>
            {selectedElement && (
              <>
                <ModalHeader>
                  <ModalTitle>Confirmar asignación</ModalTitle>
                  <ModalSubtitle>
                    {selectedElement.nombre} {selectedElement.apellido}
                  </ModalSubtitle>
                </ModalHeader>

                <ModalSection>
                  <ModalSectionTitle>Información del elemento</ModalSectionTitle>
                  <ModalInfoRow>
                    <ModalInfoLabel>Rango:</ModalInfoLabel>
                    <ModalInfoValue>{selectedElement.cargo}</ModalInfoValue>
                  </ModalInfoRow>
                  <ModalInfoRow>
                    <ModalInfoLabel>PNC:</ModalInfoLabel>
                    <ModalInfoValue>{selectedElement.pnc}</ModalInfoValue>
                  </ModalInfoRow>
                  <ModalInfoRow>
                    <ModalInfoLabel>Distancia:</ModalInfoLabel>
                    <ModalInfoValue>{getRandomDistance()}</ModalInfoValue>
                  </ModalInfoRow>
                  <ModalInfoRow>
                    <ModalInfoLabel>Estado:</ModalInfoLabel>
                    <ModalInfoValue>Disponible</ModalInfoValue>
                  </ModalInfoRow>
                </ModalSection>

                <ModalSection>
                  <ModalSectionTitle>Detalles del incidente</ModalSectionTitle>
                  {params.location && (
                    <ModalInfoRow>
                      <ModalInfoLabel>Ubicación:</ModalInfoLabel>
                      <ModalInfoValue>{params.location}</ModalInfoValue>
                    </ModalInfoRow>
                  )}
                  {params.date && (
                    <ModalInfoRow>
                      <ModalInfoLabel>Fecha:</ModalInfoLabel>
                      <ModalInfoValue>{params.date}</ModalInfoValue>
                    </ModalInfoRow>
                  )}
                  {params.time && (
                    <ModalInfoRow>
                      <ModalInfoLabel>Hora:</ModalInfoLabel>
                      <ModalInfoValue>{params.time}</ModalInfoValue>
                    </ModalInfoRow>
                  )}
                </ModalSection>

                <ModalButton onPress={handleConfirm}>
                  <ModalButtonText>Confirmar y crear caso</ModalButtonText>
                </ModalButton>
                
                <CancelButton onPress={() => setModalVisible(false)}>
                  <CancelButtonText>Cancelar</CancelButtonText>
                </CancelButton>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </GradientBackground>
  );
} 