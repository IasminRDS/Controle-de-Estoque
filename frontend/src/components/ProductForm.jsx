import { useState } from 'react';

const vazio = {
  nome: '',
  categoria: '',
  quantidade: 0,
  preco: 0,
  estoque_min: 5,
};

// Modal de formulário usado tanto para criar quanto para editar um produto.
// Recebe `produto` (ou null) e devolve os dados via onSalvar.
export default function ProductForm({ produto, onSalvar, onFechar }) {
  const [form, setForm] = useState(produto ?? vazio);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const editando = Boolean(produto?.id);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.categoria.trim()) {
      setErro('Preencha nome e categoria.');
      return;
    }
    try {
      setSalvando(true);
      setErro('');
      await onSalvar(
        {
          nome: form.nome.trim(),
          categoria: form.categoria.trim(),
          quantidade: Number(form.quantidade),
          preco: Number(form.preco),
          estoque_min: Number(form.estoque_min),
        },
        produto?.id
      );
      onFechar();
    } catch (err) {
      setErro(err.message);
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h2>{editando ? 'Editar produto' : 'Novo produto'}</h2>
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Nome</span>
            <input
              value={form.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Ex.: Fone Bluetooth"
            />
          </label>

          <label className="field">
            <span>Categoria</span>
            <input
              value={form.categoria}
              onChange={(e) => handleChange('categoria', e.target.value)}
              placeholder="Ex.: Eletrônicos"
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Quantidade</span>
              <input
                type="number"
                min="0"
                value={form.quantidade}
                onChange={(e) => handleChange('quantidade', e.target.value)}
              />
            </label>
            <label className="field">
              <span>Estoque mínimo</span>
              <input
                type="number"
                min="0"
                value={form.estoque_min}
                onChange={(e) => handleChange('estoque_min', e.target.value)}
              />
            </label>
          </div>

          <label className="field">
            <span>Preço (R$)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.preco}
              onChange={(e) => handleChange('preco', e.target.value)}
            />
          </label>

          {erro && <p className="form-error" role="alert">{erro}</p>}

          <div className="modal__actions">
            <button type="button" className="btn" onClick={onFechar} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
