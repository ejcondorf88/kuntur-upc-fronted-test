import { useState } from 'react';
import { createCase as createCaseApi } from '../adapter/apiAdapter';

export function useCreateCase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [result, setResult] = useState<any>(null);

  async function createCase(caseData: any) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await createCaseApi(caseData);
      setResult(res);
      console.log('Respuesta del backend al crear caso:', res);
      return res;
    } catch (err: any) {
      setError(err.message);
      console.log('Error al crear caso:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { createCase, loading, error, result };
} 