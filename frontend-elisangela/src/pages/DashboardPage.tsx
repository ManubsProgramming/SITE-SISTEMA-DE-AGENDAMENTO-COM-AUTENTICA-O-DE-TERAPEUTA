import { useEffect, useState } from "react";
import {
  getCurrentTherapist,
  getDashboardSummary,
  therapistLogout,
} from "../services/dashboardApi";
import type {
  DashboardSummary,
  Therapist,
} from "../services/dashboardApi";
import "./DashboardPage.css";


const statusLabels: Record<string, string> = {
  PENDING: "Aguardando",
  PAID: "Pago",
  PROCESSING: "Processando",
  EXPIRED: "Expirado",
  CANCELLED: "Cancelado",
  REFUNDED: "Estornado",
  FAILED: "Falhou",
};

function currency(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function dateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}


export default function DashboardPage() {
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getCurrentTherapist(),
      getDashboardSummary(),
    ])
      .then(([auth, summary]) => {
        setTherapist(auth.user);
        setData(summary);
      })
      .catch(() => {
        window.location.href = "/acesso-terapeuta";
      });
  }, []);

  async function handleLogout() {
    try {
      await therapistLogout();
      window.location.href = "/acesso-terapeuta";
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível sair.",
      );
    }
  }

  if (!data) {
    return (
      <main className="dashboard-loading">
        <span className="loading-logo">EF</span>
        <p>Carregando painel...</p>
      </main>
    );
  }

  const cards = [
    ["Clientes", data.summary.customers],
    ["Pagamentos", data.summary.payments],
    ["Pagamentos recebidos", data.summary.paid_payments],
    ["Aguardando pagamento", data.summary.pending_payments],
    ["Anamneses", data.summary.anamneses],
    ["Total recebido", currency(data.summary.received_total)],
  ];

  return (
    <main className="dashboard">
      <aside className="dashboard-sidebar">
        <a className="dashboard-brand" href="/">
          <span>EF</span>
          <div>
            <strong>Elisângela</strong>
            <small>Área da terapeuta</small>
          </div>
        </a>

        <nav>
          <a className="active" href="/painel">
            Visão geral
          </a>
          <a href="/painel/clientes">Clientes</a>
          <a href="/painel/pagamentos">Pagamentos</a>
          <a href="/painel/anamneses">Anamneses</a>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Sair da conta
        </button>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p>Painel administrativo</p>
            <h1>Olá, {therapist?.name || "Elisângela"}</h1>
            <span>Acompanhe os atendimentos em um só lugar.</span>
          </div>

          <a href="/" target="_blank" rel="noreferrer">
            Abrir site
          </a>
        </header>

        {error && <div className="dashboard-error">{error}</div>}

        <section className="summary-grid">
          {cards.map(([label, value]) => (
            <article className="summary-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </section>

        <section className="recent-section">
          <div className="section-heading">
            <div>
              <p>Movimentação</p>
              <h2>Pagamentos recentes</h2>
            </div>

            <a href="/painel/pagamentos">Ver todos</a>
          </div>

          {data.recent_payments.length === 0 ? (
            <div className="empty-dashboard">
              Nenhum pagamento registrado.
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {data.recent_payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <strong>{payment.customer_name}</strong>
                        <small>{payment.customer_email}</small>
                      </td>
                      <td>{dateTime(payment.created_at)}</td>
                      <td>{currency(payment.value)}</td>
                      <td>
                        <span
                          className={`payment-status status-${payment.status.toLowerCase()}`}
                        >
                          {statusLabels[payment.status] ?? payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}