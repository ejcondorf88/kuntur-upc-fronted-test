import { useCallback, useEffect, useRef, useState } from 'react';

export function useRabbitPolling(pollingInterval = 2000) {
  const [alert, setAlert] = useState<any>(null);
  const [deliveryTag, setDeliveryTag] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const fetchAlert = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8001/get_alerta', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.data) {
        setAlert(data.data);
        setDeliveryTag(data.delivery_tag);
      } else {
        setAlert(null);
        setDeliveryTag(null);
      }
    } catch (e) {
      setError('Error al consultar alerta');
      setAlert(null);
      setDeliveryTag(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlert(); // consulta inicial
    intervalRef.current = window.setInterval(fetchAlert, pollingInterval);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pollingInterval, fetchAlert]);

  const ackAlert = useCallback(async () => {
    if (!deliveryTag) return;
    await fetch('http://localhost:8001/ack_alerta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delivery_tag: deliveryTag })
    });
    setAlert(null);
    setDeliveryTag(null);
  }, [deliveryTag]);

  return { alert, loading, error, ackAlert };
} 