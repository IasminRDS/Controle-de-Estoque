import { formatCurrency } from '../utils/format';

// Tabela de produtos. Destaca em vermelho os que estão com estoque baixo
// (quantidade <= estoque mínimo).
export default function ProductTable({ produtos, onEditar, onRemover }) {
  if (produtos.length === 0) {
    return <p className="empty">Nenhum produto encontrado.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th className="num">Qtd.</th>
            <th className="num">Preço</th>
            <th className="num">Total</th>
            <th>Status</th>
            <th className="acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((p) => {
            const baixo = p.quantidade <= p.estoque_min;
            return (
              <tr key={p.id} className={baixo ? 'row--alerta' : ''}>
                <td data-label="Produto">{p.nome}</td>
                <td data-label="Categoria">
                  <span className="tag">{p.categoria}</span>
                </td>
                <td data-label="Qtd." className="num">{p.quantidade}</td>
                <td data-label="Preço" className="num">{formatCurrency(p.preco)}</td>
                <td data-label="Total" className="num">
                  {formatCurrency(p.quantidade * p.preco)}
                </td>
                <td data-label="Status">
                  {baixo ? (
                    <span className="status status--baixo">Estoque baixo</span>
                  ) : (
                    <span className="status status--ok">OK</span>
                  )}
                </td>
                <td data-label="Ações" className="acoes">
                  <button className="btn-icon" onClick={() => onEditar(p)} title="Editar">
                    ✏️
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => onRemover(p)}
                    title="Remover"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
