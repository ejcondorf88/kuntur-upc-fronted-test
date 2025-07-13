export type MockCase = {
  id: string;
  fecha: string;
  tipo: string;
  ubicacion: string;
  oficial: string;
  estado: string;
  descripcion: string;
};

export function useMockCases() {
  return [
    {
      id: 'CASO-2025-0043',
      fecha: '03/07/2025',
      tipo: 'Robo',
      ubicacion: 'Quito',
      oficial: 'María López (Cabo Primero)',
      estado: 'En investigación',
      descripcion: 'Robo a local comercial en la zona de Solanda. Sospechoso huyó en vehículo negro. Se recabaron huellas y se revisan cámaras de seguridad.'
    },
    {
      id: 'CASO-2025-0044',
      fecha: '04/07/2025',
      tipo: 'Asalto',
      ubicacion: 'Quito',
      oficial: 'Carlos Pérez (Sargento)',
      estado: 'Cerrado',
      descripcion: 'Asalto a transeúnte en la Av. América. Sospechoso detenido y puesto a órdenes de la autoridad.'
    },
    // ...más casos mockeados
  ];
} 