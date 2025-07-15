export async function createCase(caseData: any) {
  console.log('Enviando datos al backend:', caseData);
  const response = await fetch('http://localhost:8001/api/ia/recibir_alerta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(caseData),
  });
  if (!response.ok) {
    throw new Error('Error al crear el caso');
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/pdf')) {
    return await response.blob();
  } else if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    return await response.text();
  }
} 