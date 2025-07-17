import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function CrearCasoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const nombre = params.nombre || '';
  const ip = params.ip || '';
  const location = params.location || '';
  const date = params.date || '';
  const time = params.time || '';
  const transcription_video = params.transcription_video || '';
  const key_words = params.key_words || '';

  const [showJusticiaPrompt, setShowJusticiaPrompt] = useState(true);

  const handleFinish = () => {
    router.replace('/');
  };

  const handleEnviarJusticia = () => {
    console.log('Enviando datos a Justicia IA:', params);
    setShowJusticiaPrompt(false);
    setTimeout(() => router.replace('/casos'), 1200);
  };

  const InfoItem = ({ label, value, icon }) => {
    if (!value) return null;
    return (
      <View style={styles.infoItem}>
        <View style={styles.infoLabel}>
          <Text style={styles.infoLabelText}>{label}</Text>
        </View>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
              <Image 
                source={require('../assets/images/icon.png')} 
                style={styles.backIcon} 
              />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Crear Caso</Text>
              <View style={styles.titleUnderline} />
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Elemento Principal */}
            <View style={styles.elementoContainer}>
              <Text style={styles.elementoLabel}>Elemento</Text>
              <Text style={styles.elementoValue}>{nombre}</Text>
            </View>

            {/* Información del Caso */}
            <View style={styles.infoContainer}>
              <InfoItem label="IP" value={ip} />
              <InfoItem label="Ubicación" value={location} />
              <InfoItem label="Fecha" value={date} />
              <InfoItem label="Hora" value={time} />
              <InfoItem label="Transcripción" value={transcription_video} />
              <InfoItem label="Palabras Clave" value={key_words} />
            </View>

            {/* Justicia IA Section */}
            {showJusticiaPrompt ? (
              <View style={styles.justiciaSection}>
                <View style={styles.justiciaHeader}>
                  <Text style={styles.justiciaTitle}>Justicia IA</Text>
                  <Text style={styles.justiciaSubtitle}>
                    ¿Desea enviar los datos para procesamiento inteligente?
                  </Text>
                </View>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={handleEnviarJusticia}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.primaryButtonText}>Enviar a Justicia IA</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={handleFinish}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.secondaryButtonText}>Omitir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                  <Text style={styles.successIconText}>✓</Text>
                </View>
                <Text style={styles.successText}>¡Datos enviados a Justicia IA!</Text>
                <Text style={styles.successSubtext}>El caso será procesado automáticamente</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = {
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    width: width * 0.9,
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
    overflow: 'hidden',
  },
  header: {
    position: 'relative',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#667eea',
    borderRadius: 2,
  },
  content: {
    padding: 24,
  },
  elementoContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  elementoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  elementoValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  infoContainer: {
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 80,
  },
  infoLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
    fontWeight: '500',
  },
  justiciaSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  justiciaHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  justiciaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  justiciaSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryButton: {
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIconText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  successText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 14,
    color: '#16a34a',
    textAlign: 'center',
  },
};