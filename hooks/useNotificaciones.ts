import { useEffect, useState } from 'react';

export interface Notificacion {
  _id: { $oid: string };
  device_id: string;
  device_type: string;
  location: string;
  alert_information: string;
  cordinates?: { latitude: number; longitude: number };
  date: string;
  time: string;
  stream_url: string;
  transcription_video: string;
  transcription_audio: string;
  media_duration: number;
  key_words: string[];
  confidence_level: number;
  user: string;
  alerta: string;
  coordenadas?: { lat: number; lng: number };
  descripcion: string;
  dispositivo?: { id: string; ip: string; tipo: string };
  duracionVideo?: number;
  fecha?: string;
  hora?: string;
  nivelConfianza?: number;
  palabrasClave?: string;
  ubicacion?: string;
}

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notificaciones')
      .then((res) => res.json())
      .then((data) => setNotificaciones(data))
      .finally(() => setLoading(false));
  }, []);

  return { notificaciones, loading };
} 