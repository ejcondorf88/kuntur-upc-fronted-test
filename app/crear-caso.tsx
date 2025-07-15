import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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

  const handleFinish = () => {
    // Aquí podrías agregar lógica para guardar el caso si tuvieras backend o estado global
    router.replace('/casos'); // Redirige a la pantalla de casos
  };

  return (
    <LinearGradient
      colors={['#8B5CF6', '#3B82F6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 32, width: '90%', maxWidth: 400, alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#6D28D9', marginBottom: 12 }}>Crear caso</Text>
        <Text style={{ fontSize: 16, color: '#222', marginBottom: 8 }}>Elemento: <Text style={{ fontWeight: 'bold' }}>{nombre}</Text></Text>
        {ip && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 4 }}>IP: {ip}</Text>}
        {location && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 4 }}>Ubicación: {location}</Text>}
        {date && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 4 }}>Fecha: {date}</Text>}
        {time && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 4 }}>Hora: {time}</Text>}
        {transcription_video && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 4 }}>Transcripción: {transcription_video}</Text>}
        {key_words && <Text style={{ fontSize: 14, color: '#6D28D9', marginBottom: 8 }}>Palabras clave: {key_words}</Text>}
        <TouchableOpacity
          style={{ backgroundColor: '#8B5CF6', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 32, marginBottom: 12 }}
          onPress={handleFinish}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Confirmar creación</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#8B5CF6', fontSize: 16 }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
} 