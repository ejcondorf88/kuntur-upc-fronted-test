import { MockCase } from './useMockCases';

export function useGeneratePartePolicial() {
  function generarParte(caso: MockCase) {
    // Simula el payload que se enviaría al backend
    const payload = {
      id: caso.id,
      fecha: caso.fecha,
      tipo: caso.tipo,
      ubicacion: caso.ubicacion,
      oficial: caso.oficial,
      estado: caso.estado,
      descripcion: caso.descripcion,
      generadoEn: new Date().toISOString(),
    };
    console.log('Datos enviados al backend para parte policial:', payload);
    // Aquí podrías hacer un fetch/axios.post en el futuro
    return payload;
  }
  return { generarParte };
} 