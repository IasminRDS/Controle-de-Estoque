import { formatCurrency } from '../utils/format';

// Cartões de indicadores do estoque, alimentados pelo endpoint /api/resumo.
export default function SummaryCards({ resumo }) {
  if (!resumo) return null;

  const cards = [
    { label: 'Produtos cadastrados', value: resumo.total_produtos, icon: '📦' },
    { label: 'Itens em estoque', value: resumo.itens_em_estoque, icon: '🔢' },
    { label: 'Valor em estoque', value: formatCurrency(resumo.valor_estoque), icon: '💰' },
    {
      label: 'Alertas de estoque baixo',
      value: resumo.alertas_estoque_baixo,
      icon: '⚠️',
      alerta: resumo.alertas_estoque_baixo > 0,
    },
  ];

  return (
    <section className="summary-cards">
      {cards.map((c) => (
        <article key={c.label} className={`card ${c.alerta ? 'card--alerta' : ''}`}>
          <span className="card__icon">{c.icon}</span>
          <div>
            <p className="card__value">{c.value}</p>
            <p className="card__label">{c.label}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
