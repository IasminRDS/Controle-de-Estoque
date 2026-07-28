import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

// Hook central: carrega produtos + resumo do backend e expõe as ações de
// CRUD, recarregando os dados após cada mudança para manter tudo em sincronia.
export function useEstoque({ categoria, busca }) {
  const [produtos, setProdutos] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [listaProdutos, dadosResumo] = await Promise.all([
        api.listarProdutos({ categoria, busca }),
        api.resumo(),
      ]);
      setProdutos(listaProdutos);
      setResumo(dadosResumo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [categoria, busca]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const salvar = async (produto, id) => {
    if (id) await api.atualizarProduto(id, produto);
    else await api.criarProduto(produto);
    await carregar();
  };

  const remover = async (id) => {
    await api.removerProduto(id);
    await carregar();
  };

  return { produtos, resumo, loading, error, salvar, remover, recarregar: carregar };
}
