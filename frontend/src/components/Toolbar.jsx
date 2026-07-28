// Barra de ações: busca por nome, filtro por categoria e botão de novo produto.
export default function Toolbar({
  busca,
  onBusca,
  categoria,
  onCategoria,
  categorias,
  onNovo,
}) {
  return (
    <div className="toolbar">
      <input
        type="search"
        className="toolbar__search"
        placeholder="🔎 Buscar produto..."
        value={busca}
        onChange={(e) => onBusca(e.target.value)}
        aria-label="Buscar produto"
      />

      <select
        value={categoria}
        onChange={(e) => onCategoria(e.target.value)}
        aria-label="Filtrar por categoria"
      >
        <option value="">Todas as categorias</option>
        {categorias.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button className="btn btn--primary" onClick={onNovo}>
        + Novo produto
      </button>
    </div>
  );
}
