import { useState, useEffect } from 'react';
import { api } from './services/api';
import { useEstoque } from './hooks/useEstoque';
import { useDebounce } from './hooks/useDebounce';
import SummaryCards from './components/SummaryCards';
import Toolbar from './components/Toolbar';
import ProductTable from './components/ProductTable';
import ProductForm from './components/ProductForm';
import './App.css';

export default function App() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [modal, setModal] = useState(null); // null | { produto|null }

  const buscaDebounced = useDebounce(busca, 400);

  const { produtos, resumo, loading, error, salvar, remover } = useEstoque({
    categoria,
    busca: buscaDebounced,
  });

  // Carrega a lista de categorias para o filtro (uma vez).
  useEffect(() => {
    api.categorias().then(setCategorias).catch(() => setCategorias([]));
  }, [produtos.length]);

  const handleRemover = async (produto) => {
    if (window.confirm(`Remover "${produto.nome}"?`)) {
      await remover(produto.id);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header__brand">
          <span className="header__logo">📦</span>
          <div>
            <h1>Controle de Estoque</h1>
            <p>Full-stack · React + Flask + SQLite</p>
          </div>
        </div>
      </header>

      <main className="container">
        {error && (
          <div className="banner banner--error">
            ⚠️ {error}
            <span className="banner__hint">
              O backend está rodando? Inicie com <code>python app.py</code> na pasta <code>backend/</code>.
            </span>
          </div>
        )}

        <SummaryCards resumo={resumo} />

        <Toolbar
          busca={busca}
          onBusca={setBusca}
          categoria={categoria}
          onCategoria={setCategoria}
          categorias={categorias}
          onNovo={() => setModal({ produto: null })}
        />

        {loading ? (
          <p className="empty">Carregando...</p>
        ) : (
          <ProductTable
            produtos={produtos}
            onEditar={(produto) => setModal({ produto })}
            onRemover={handleRemover}
          />
        )}
      </main>

      {modal && (
        <ProductForm
          produto={modal.produto}
          onSalvar={salvar}
          onFechar={() => setModal(null)}
        />
      )}

      <footer className="footer">
        <p>API REST em Flask · Banco SQLite · Frontend React + Vite</p>
      </footer>
    </div>
  );
}
