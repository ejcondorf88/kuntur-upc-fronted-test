import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

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

  console.log('params:', params);
  console.log('params.whatsapp_link:', params.whatsapp_link);
  const whatsappLink = Array.isArray(params.whatsapp_link) ? params.whatsapp_link[0] : params.whatsapp_link;

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#8b5cf6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Header con gradiente */}
          <LinearGradient
            colors={['#f8fafc', '#ffffff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.backButtonGradient}
              >
                <Image 
                  source={require('../assets/images/icon.png')} 
                  style={styles.backIcon} 
                />
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Crear Caso</Text>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.titleUnderline}
              />
            </View>
          </LinearGradient>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Elemento Principal con glassmorphism */}
            <LinearGradient
              colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.elementoContainer}
            >
              <View style={styles.elementoHeader}>
                <View style={styles.elementoIcon}>
                  <Text style={styles.elementoIconText}>📋</Text>
                </View>
                <Text style={styles.elementoLabel}>Elemento Principal</Text>
              </View>
              <Text style={styles.elementoValue}>{nombre}</Text>
            </LinearGradient>

            {/* Información del Caso con cards individuales */}
            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>Información del Caso</Text>
              <InfoItem label="IP" value={ip} />
              <InfoItem label="Ubicación" value={location} />
              <InfoItem label="Fecha" value={date} />
              <InfoItem label="Hora" value={time} />
              <InfoItem label="Transcripción" value={transcription_video} />
              <InfoItem label="Palabras Clave" value={key_words} />
            </View>

            {/* Justicia IA Section */}
            {showJusticiaPrompt ? (
              <LinearGradient
                colors={['#f8fafc', '#ffffff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.justiciaSection}
              >
                <View style={styles.justiciaHeader}>
                  <View style={styles.justiciaIconContainer}>
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.justiciaIcon}
                    >
                      <Text style={styles.justiciaIconText}>⚖️</Text>
                    </LinearGradient>
                  </View>
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
                      colors={['#10B981', '#059669', '#047857']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.primaryButtonText}>✨ Enviar a Justicia IA</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  {whatsappLink && (
                    <TouchableOpacity
                      style={[styles.button, styles.whatsappButton]}
                      onPress={() => Linking.openURL(whatsappLink)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#25D366', '#128C7E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                      >
                        <Text style={styles.whatsappButtonText}>💬 Enviar por WhatsApp</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={handleFinish}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.secondaryButtonText}>Omitir</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={['#f0fdf4', '#dcfce7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.successContainer}
              >
                <View style={styles.successIcon}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.successIconGradient}
                  >
                    <Text style={styles.successIconText}>✓</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.successText}>¡Datos enviados a Justicia IA!</Text>
                <Text style={styles.successSubtext}>El caso será procesado automáticamente</Text>
                
                {whatsappLink && (
                  <TouchableOpacity
                    style={styles.successWhatsappButton}
                    onPress={() => Linking.openURL(whatsappLink)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#25D366', '#128C7E']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.whatsappButtonText}>💬 Enviar por WhatsApp</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </LinearGradient>
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
    borderRadius: 32,
    width: width * 0.9,
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  header: {
    position: 'relative',
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 24,
    zIndex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  backButtonGradient: {
    padding: 10,
    borderRadius: 16,
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
    fontSize: 26,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  titleUnderline: {
    width: 70,
    height: 4,
    borderRadius: 2,
  },
  content: {
    padding: 24,
  },
  elementoContainer: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  elementoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  elementoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  elementoIconText: {
    fontSize: 20,
  },
  elementoLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  elementoValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: 0.5,
  },
  infoContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
    paddingLeft: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 8,
    backgroundColor: 'rgba(248, 250, 252, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  infoLabel: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 16,
    minWidth: 90,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  infoLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    color: '#334155',
    flex: 1,
    fontWeight: '600',
    lineHeight: 20,
  },
  justiciaSection: {
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  justiciaHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  justiciaIconContainer: {
    marginBottom: 16,
  },
  justiciaIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  justiciaIconText: {
    fontSize: 24,
  },
  justiciaTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  justiciaSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  primaryButton: {
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  whatsappButton: {
    shadowColor: '#25D366',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  whatsappButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderRadius: 20,
  },
  secondaryButtonText: {
    color: '#64748b',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  successContainer: {
    alignItems: 'center',
    padding: 36,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(187, 247, 208, 0.5)',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  successIcon: {
    marginBottom: 20,
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  successIconGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  successText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#059669',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  successSubtext: {
    fontSize: 15,
    color: '#16a34a',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 20,
  },
  successWhatsappButton: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#25D366',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
};