import {
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  downloadDashboardAnamnesisPdf,
  getDashboardAnamneses,
  therapistLogout,
} from "../services/dashboardApi";

import type {
  CustomerAnamneses,
} from "../services/dashboardApi";

import "./DashboardPage.css";

function formatDate(value: string) {
  return new Date(value).toLocaleString(
    "pt-BR",
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  );
}

function formatCpf(value: string) {
  const cpf = value.replace(/\D/g, "");

  if (cpf.length !== 11) {
    return value || "Não informado";
  }

  return cpf.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4",
  );
}

function whatsappUrl(phone: string) {
  const number = phone.replace(/\D/g, "");

  if (!number) {
    return "";
  }

  const completeNumber = number.startsWith("55")
    ? number
    : `55${number}`;

  return `https://wa.me/${completeNumber}`;
}

export default function DashboardAnamnesesPage() {
  const [customers, setCustomers] =
    useState<CustomerAnamneses[]>([]);

  const [
    expandedCustomer,
    setExpandedCustomer,
  ] = useState<string | null>(null);

  const [
    downloadingId,
    setDownloadingId,
  ] = useState<string | null>(null);

  const [search, setSearch] = useState(
  () =>
    new URLSearchParams(
      window.location.search,
    ).get("search") ?? "",
);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError("");

      getDashboardAnamneses(search)
        .then(setCustomers)
        .catch((requestError) => {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível carregar as anamneses.";

          if (
            message.includes("Autenticação")
          ) {
            window.location.href =
              "/acesso-terapeuta";

            return;
          }

          setError(message);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () =>
      window.clearTimeout(timer);
  }, [search]);

  function toggleCustomer(
    customerId: string,
  ) {
    setExpandedCustomer((current) =>
      current === customerId
        ? null
        : customerId,
    );
  }

  async function handleDownload(
    anamnesisId: string,
  ) {
    setDownloadingId(anamnesisId);
    setError("");

    try {
      await downloadDashboardAnamnesisPdf(
        anamnesisId,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível baixar o PDF.",
      );
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleLogout() {
    try {
      await therapistLogout();

      window.location.href =
        "/acesso-terapeuta";
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível sair.",
      );
    }
  }

  const totalAnamneses =
    customers.reduce(
      (total, customer) =>
        total +
        customer.anamnesis_count,
      0,
    );

  return (
    <main className="dashboard">
      <aside className="dashboard-sidebar">
        <a
          className="dashboard-brand"
          href="/"
        >
          <span>EF</span>

          <div>
            <strong>Elisângela</strong>
            <small>
              Área da terapeuta
            </small>
          </div>
        </a>

        <nav>
          <a href="/painel">
            Visão geral
          </a>

          <a href="/painel/clientes">
            Clientes
          </a>

          <a
            className="active"
            href="/painel/anamneses"
          >
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
              Cada cliente aparece somente
              uma vez. Clique para acessar
              seu histórico.
            </span>
          </div>
        </header>

        <section className="dashboard-filters customers-filter">
          <input
            aria-label="Buscar cliente"
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Buscar por nome, CPF, e-mail ou telefone"
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
              <p>Prontuários</p>

              <h2>
                {customers.length}{" "}
                cliente(s) ·{" "}
                {totalAnamneses}{" "}
                anamnese(s)
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="empty-dashboard">
              Carregando anamneses...
            </div>
          ) : customers.length === 0 ? (
            <div className="empty-dashboard">
              Nenhuma anamnese
              encontrada.
            </div>
          ) : (
            <div className="anamnesis-customer-list">
              {customers.map(
                (customer) => {
                  const expanded =
                    expandedCustomer ===
                    customer.id;

                  const whatsapp =
                    whatsappUrl(
                      customer.phone,
                    );

                  return (
                    <article
                      className="anamnesis-customer-card"
                      key={customer.id}
                    >
                      <button
                        className="anamnesis-customer-header"
                        onClick={() =>
                          toggleCustomer(
                            customer.id,
                          )
                        }
                        type="button"
                        aria-expanded={
                          expanded
                        }
                      >
                        <div className="anamnesis-customer-main">
                          <strong>
                            {customer.name}
                          </strong>

                          <span>
                            CPF:{" "}
                            {formatCpf(
                              customer.cpf,
                            )}
                          </span>

                          <small>
                            {customer.email}
                          </small>
                        </div>

                        <div className="anamnesis-customer-summary">
                          <span className="anamnesis-count">
                            {
                              customer.anamnesis_count
                            }{" "}
                            {customer.anamnesis_count ===
                            1
                              ? "anamnese"
                              : "anamneses"}
                          </span>

                          {expanded ? (
                            <ChevronUp
                              size={22}
                            />
                          ) : (
                            <ChevronDown
                              size={22}
                            />
                          )}
                        </div>
                      </button>

                      {expanded && (
                        <div className="anamnesis-customer-details">
                          <div className="customer-contact-row">
                            <div>
                              <strong>
                                Contato
                              </strong>

                              <span>
                                {customer.phone ||
                                  "Telefone não informado"}
                              </span>
                            </div>

                            {whatsapp && (
                              <a
                                href={
                                  whatsapp
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                <MessageCircle
                                  size={
                                    17
                                  }
                                />

                                WhatsApp
                              </a>
                            )}
                          </div>

                          <div className="anamnesis-history">
                            {customer.anamneses.map(
                              (
                                anamnesis,
                                index,
                              ) => (
                                <div
                                  className="anamnesis-history-item"
                                  key={
                                    anamnesis.id
                                  }
                                >
                                  <div>
                                    <strong>
                                      Anamnese{" "}
                                      {customer
                                        .anamneses
                                        .length -
                                        index}
                                    </strong>

                                    <span>
                                      Enviada em{" "}
                                      {formatDate(
                                        anamnesis.submitted_at,
                                      )}
                                    </span>

                                    <small>
                                      Versão{" "}
                                      {
                                        anamnesis.form_version
                                      }
                                    </small>
                                  </div>

                                  <div className="anamnesis-history-actions">
                                    <a
                                      href={`/painel/anamneses/${anamnesis.id}`}
                                    >
                                      <ExternalLink
                                        size={
                                          16
                                        }
                                      />

                                      Visualizar
                                    </a>

                                    <button
                                      type="button"
                                      disabled={
                                        downloadingId ===
                                        anamnesis.id
                                      }
                                      onClick={() =>
                                        handleDownload(
                                          anamnesis.id,
                                        )
                                      }
                                    >
                                      <Download
                                        size={
                                          16
                                        }
                                      />

                                      {downloadingId ===
                                      anamnesis.id
                                        ? "Baixando..."
                                        : "PDF"}
                                    </button>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                },
              )}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}