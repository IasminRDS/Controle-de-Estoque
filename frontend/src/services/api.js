// Camada de comunicação com a API Flask do backend.
// A URL base pode ser configurada por variável de ambiente do Vite.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Wrapper que centraliza fetch, cabeçalhos JSON e tratamento de erro.
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.erro || `Erro na requisição (HTTP ${res.status}).`);
  }
  return data;
}

export const api = {
  listarProdutos: ({ categoria = '', busca = '' } = {}) => {
    const params = new URLSearchParams();
    if (categoria) params.set('categoria', categoria);
    if (busca) params.set('busca', busca);
    const qs = params.toString();
    return request(`/produtos${qs ? `?${qs}` : ''}`);
  },
  resumo: () => request('/resumo'),
  categorias: () => request('/categorias'),
  criarProduto: (produto) =>
    request('/produtos', { method: 'POST', body: JSON.stringify(produto) }),
  atualizarProduto: (id, produto) =>
    request(`/produtos/${id}`, { method: 'PUT', body: JSON.stringify(produto) }),
  removerProduto: (id) => request(`/produtos/${id}`, { method: 'DELETE' }),
};
