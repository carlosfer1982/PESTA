async function fetchData() {
  try {
    const response = await fetch('http://localhost:3000/api/micro/data');
    if (!response.ok) {
      throw new Error('Erro na requisição: ' + response.status);
    }
    const data = await response.json();
    console.log('Dados recebidos:', data);
  } catch (error) {
    console.log('Erro:', error.message);
  }
}

fetchData();
