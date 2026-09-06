import { useEffect, useState } from "react";

import {
  getDashboardAnamneses,
  therapistLogout,
} from "../services/dashboardApi";
import type { DashboardAnamnesis } from "../services/dashboardApi";
import "./DashboardPage.css";


function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}


function whatsappUrl(phone: string) {
  const number = phone.replace(/\D/g, "");
  const completeNumber = number.startsWith("55")
    ? number
    : `55${number}`;

  return `https://wa.me/${completeNumber}`;
}


export default function DashboardAnamnesesPage() {
  const [anamneses, setAnamneses] = useState<DashboardAnamnesis[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");

      getDashboardAnamneses(search)
        .then(setAnamneses)
        .catch((requestError) => {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar as anamneses.";

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
          <a href="/painel/clientes">Clientes</a>
          <a href="/painel/pagamentos">Pagamentos</a>

          <a className="active" href="/painel/anamneses">
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
            <p>Formulários recebidos</p>
            <h1>Anamneses</h1>

            <span>
              Consulte os formulários enviados pelas clientes.
            </span>
          </div>
        </header>

        <section className="dashboard-filters customers-filter">
          <input
            aria-label="Buscar anamnese"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome ou e-mail"
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
              <p>Documentos</p>
              <h2>{anamneses.length} anamnese(s)</h2>
            </div>
          </div>

          {loading ? (
            <div className="empty-dashboard">
              Carregando anamneses...
            </div>
          ) : anamneses.length === 0 ? (
            <div className="empty-dashboard">
              Nenhuma anamnese encontrada.
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Telefone</th>
                    <th>Versão</th>
                    <th>Enviada em</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {anamneses.map((anamnesis) => (
                    <tr key={anamnesis.id}>
                      <td>
                        <strong>
                          {anamnesis.customer.name}
                        </strong>

                        <small>
                          {anamnesis.customer.email}
                        </small>
                      </td>

                      <td>{anamnesis.customer.phone}</td>

                      <td>{anamnesis.form_version}</td>

                      <td>
                        {formatDate(anamnesis.submitted_at)}
                      </td>

                      <td>
                        <div className="customer-actions">
                          <a
                            href={`/painel/anamneses/${anamnesis.id}`}
                          >
                            Visualizar
                          </a>

                          <a
                            href={whatsappUrl(
                              anamnesis.customer.phone,
                            )}
                            target="_blank"
                            rel="noreferrer"
                          >
                            WhatsApp
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