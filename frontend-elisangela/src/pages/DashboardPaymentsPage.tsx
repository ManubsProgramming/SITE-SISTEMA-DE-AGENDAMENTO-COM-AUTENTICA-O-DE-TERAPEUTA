import { useEffect, useState } from "react";

import {
  getDashboardPayments,
  therapistLogout,
} from "../services/dashboardApi";
import type { DashboardPayment } from "../services/dashboardApi";
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


function formatCurrency(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}


function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}


function whatsappUrl(phone: string) {
  const number = phone.replace(/\D/g, "");
  const brazilianNumber = number.startsWith("55")
    ? number
    : `55${number}`;

  return `https://wa.me/${brazilianNumber}`;
}


export default function DashboardPaymentsPage() {
  const [payments, setPayments] = useState<DashboardPayment[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");

      getDashboardPayments(search, selectedStatus)
        .then((result) => {
          setPayments(result);
        })
        .catch((requestError) => {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar os pagamentos.";

          if (message.includes("Autenticação")) {
            window.location.href = "/acesso-terapeuta";
            return;
          }

          setError(message);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search, selectedStatus]);

  async function handleLogout() {
    try {
      await therapistLogout();
      window.location.href = "/acesso-terapeuta";
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível sair da conta.",
      );
    }
  }

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
          <a href="/painel">
            Visão geral
          </a>

          <a href="/painel/clientes">
            Clientes
          </a>

          <a className="active" href="/painel/pagamentos">
            Pagamentos
          </a>

          <a href="/painel/anamneses">
            Anamneses
          </a>
        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
          type="button"
        >
          Sair da conta
        </button>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p>Financeiro</p>
            <h1>Pagamentos</h1>

            <span>
              Acompanhe as cobranças realizadas pelo site.
            </span>
          </div>

          <a
            href="/pagamento"
            target="_blank"
            rel="noreferrer"
          >
            Abrir pagamento
          </a>
        </header>

        <section className="dashboard-filters">
          <input
            aria-label="Buscar cliente"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar pelo nome da cliente"
            type="search"
            value={search}
          />

          <select
            aria-label="Filtrar por status"
            onChange={(event) => {
              setSelectedStatus(event.target.value);
            }}
            value={selectedStatus}
          >
            <option value="">Todos os status</option>
            <option value="PAID">Pagos</option>
            <option value="PENDING">Aguardando</option>
            <option value="PROCESSING">Processando</option>
            <option value="EXPIRED">Expirados</option>
            <option value="REFUNDED">Estornados</option>
            <option value="CANCELLED">Cancelados</option>
            <option value="FAILED">Falharam</option>
          </select>
        </section>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <section className="recent-section payments-list-section">
          <div className="section-heading">
            <div>
              <p>Resultados</p>

              <h2>
                {payments.length} pagamento(s)
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="empty-dashboard">
              Carregando pagamentos...
            </div>
          ) : payments.length === 0 ? (
            <div className="empty-dashboard">
              Nenhum pagamento encontrado.
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Contato</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <strong>
                          {payment.customer.name}
                        </strong>

                        <small>
                          {payment.customer.email}
                        </small>
                      </td>

                      <td>
                        <a
                          className="table-contact"
                          href={whatsappUrl(
                            payment.customer.phone,
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {payment.customer.phone}
                        </a>
                      </td>

                      <td>
                        {formatDate(payment.created_at)}
                      </td>

                      <td>
                        {formatCurrency(payment.value)}
                      </td>

                      <td>
                        <span
                          className={[
                            "payment-status",
                            `status-${payment.status.toLowerCase()}`,
                          ].join(" ")}
                        >
                          {statusLabels[payment.status]
                            ?? payment.status}
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