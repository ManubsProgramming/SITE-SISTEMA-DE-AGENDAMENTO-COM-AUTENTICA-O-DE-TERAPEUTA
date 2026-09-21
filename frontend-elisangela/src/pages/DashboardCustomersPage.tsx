import {
  ChevronRight,
  FileText,
  Mail,
  MessageCircle,
  Search,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  getDashboardCustomers,
  therapistLogout,
} from "../services/dashboardApi";

import type {
  DashboardCustomer,
} from "../services/dashboardApi";

import "./DashboardPage.css";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(
    "pt-BR",
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

export default function DashboardCustomersPage() {
  const [customers, setCustomers] =
    useState<DashboardCustomer[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

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

          <a
            className="active"
            href="/painel/clientes"
          >
            Clientes
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
              Consulte os clientes
              identificados pelo CPF.
            </span>
          </div>
        </header>

        <section className="dashboard-filters customers-filter">
          <div className="dashboard-search-field">
            <Search size={19} />

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
          </div>
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
                cliente(s)
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="empty-dashboard">
              Carregando clientes...
            </div>
          ) : customers.length === 0 ? (
            <div className="empty-dashboard">
              Nenhum cliente encontrado.
            </div>
          ) : (
            <div className="dashboard-customers-grid">
              {customers.map(
                (customer) => {
                  const whatsapp =
                    whatsappUrl(
                      customer.phone,
                    );

                  return (
                    <article
                      className="dashboard-customer-card"
                      key={customer.id}
                    >
                      <div className="customer-card-header">
                        <span className="customer-avatar">
                          {customer.name
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <div>
                          <h3>
                            {customer.name}
                          </h3>

                          <p>
                            CPF:{" "}
                            {formatCpf(
                              customer.cpf,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="customer-card-information">
                        <a
                          href={`mailto:${customer.email}`}
                        >
                          <Mail size={17} />

                          <span>
                            {customer.email}
                          </span>
                        </a>

                        {whatsapp ? (
                          <a
                            href={whatsapp}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <MessageCircle
                              size={17}
                            />

                            <span>
                              {customer.phone}
                            </span>
                          </a>
                        ) : (
                          <span>
                            <MessageCircle
                              size={17}
                            />
                            Telefone não informado
                          </span>
                        )}
                      </div>

                      <div className="customer-card-footer">
                        <div>
                          <FileText
                            size={18}
                          />

                          <span>
                            {
                              customer.anamnesis_count
                            }{" "}
                            {customer.anamnesis_count ===
                            1
                              ? "anamnese"
                              : "anamneses"}
                          </span>
                        </div>

                        <small>
                          Desde{" "}
                          {formatDate(
                            customer.created_at,
                          )}
                        </small>
                      </div>

                      <a
                        className="customer-anamneses-link"
                        href={`/painel/anamneses?search=${encodeURIComponent(
                          customer.cpf ||
                            customer.email,
                        )}`}
                      >
                        Ver anamneses

                        <ChevronRight
                          size={18}
                        />
                      </a>
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