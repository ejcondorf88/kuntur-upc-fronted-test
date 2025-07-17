import { useEffect, useState } from 'react';

const PAGE_SIZE = 5;

export function usePolicias() {
  const [policias, setPolicias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('http://192.168.11.100:8001/api/policias/')
      .then((res) => res.json())
      .then((data) => {
        // Adaptar al formato de Element
        const adaptados = data.map((p: any) => {
          const [nombre, ...apellidos] = p.identificacion.nombre.split(' ');
          return {
            id: String(p.id),
            nombre,
            apellido: apellidos.join(' '),
            cargo: p.identificacion.rango,
            pnc: p.identificacion.placa,
          };
        });
        setPolicias(adaptados);
        console.log('Policías adaptados para elementos:', adaptados);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(policias.length / PAGE_SIZE);
  const paginatedPolicias = policias.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return { policias: paginatedPolicias, loading, error, page, totalPages, nextPage, prevPage };
} 