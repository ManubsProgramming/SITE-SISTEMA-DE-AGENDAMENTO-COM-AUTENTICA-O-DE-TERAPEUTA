import { useEffect, useState } from "react";

import {
  getDashboardCustomers,
  therapistLogout,
} from "../services/dashboardApi";
import type { DashboardCustomer } from "../services/dashboardApi";
import "./DashboardPage.css";


function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}


function whatsappUrl(phone: string) {
  const number = phone.replace(/\D/g, "");

  return `https://wa.me/${
    number.startsWith("55") ? number : `55${number}`
  }`;
}


export default function DashboardCustomersPage() {
  const [customers, setCustomers] = useState<DashboardCustomer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");

      getDashboardCustomers(search)
        .then(setCustomers)
        .catch((requestError) => {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar os clientes.";

          if (message.includes("Autenticação")) {
            window.location.href = "/acesso-terapeuta";
            return;
          }

          setError(message);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

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
          <a href="/painel">Visão geral</a>

          <a className="active" href="/painel/clientes">
            Clientes
          </a>

          <a href="/painel/pagamentos">
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
            <p>Atendimentos</p>
            <h1>Clientes</h1>

            <span>
              Consulte os contatos cadastrados pelo site.
            </span>
          </div>
        </header>

        <section className="dashboard-filters customers-filter">
          <input
            aria-label="Buscar cliente"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone"
            type="search"
            value={search}
          />
        </section>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <section className="recent-section">
          <div className="section-heading">
            <div>
              <p>Cadastros</p>
              <h2>{customers.length} cliente(s)</h2>
            </div>
          </div>

          {loading ? (
            <div className="empty-dashboard">
              Carregando clientes...
            </div>
          ) : customers.length === 0 ? (
            <div className="empty-dashboard">
              Nenhuma cliente encontrada.
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Telefone</th>
                    <th>Pagamentos</th>
                    <th>Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <strong>{customer.name}</strong>
                        <small>{customer.email}</small>
                      </td>

                      <td>{customer.phone}</td>

                      <td>{customer.payment_count}</td>

                      <td>
                        {formatDate(customer.created_at)}
                      </td>

                      <td>
                        <div className="customer-actions">
                          <a
                            href={whatsappUrl(customer.phone)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            WhatsApp
                          </a>

                          <a href={`mailto:${customer.email}`}>
                            E-mail
                          </a>
                        </div>
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