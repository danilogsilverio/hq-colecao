const API_URL = 'http://localhost:3000';
const USER_ID = 'danilo98'; // pode ser fixo por enquanto

export async function buscarHQs(query) {
  const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
  return await res.json();
}

export async function salvarNaColecao(hq) {
  const payload = {
    user_id: USER_ID,
    hq_id: hq.id,
    titulo: hq.name || `${hq.volume?.name} #${hq.issue_number}`,
    status: 'quero ler', // pode ser customizado depois
    avaliacao: null,
    comentario: null
  };

  const res = await fetch(`${API_URL}/colecao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return await res.json();
}

export async function removerHQ(id) {
    const res = await fetch(`http://localhost:3000/colecao/${id}`, {
      method: 'DELETE',
    });
  
    return await res.json();
  }

export async function listarColecao() {
  const res = await fetch(`${API_URL}/colecao/${USER_ID}`);
  return await res.json();
}
