export async function createCase(caseData: any) {
  console.log('Enviando datos al backend:', caseData);
  const response = await fetch('/api/casos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(caseData),
  });
  if (!response.ok) {
    throw new Error('Error al crear el caso');
  }
  return response.json();
} 