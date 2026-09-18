import {
  useCallback,
  useEffect,
  useState,
} from "react";
import type { FormEvent } from "react";

import {
  createAnamnesisInvitation,
  getDashboardCustomers,
  therapistLogout,
} from "../services/dashboardApi";
import type {
  AnamnesisInvitationResult,
  DashboardCustomer,
} from "../services/dashboardApi";

import "./DashboardPage.css";


function formatDate(value: string) {
  return new Date(value).toLocaleDateString(
    "pt-BR",
  );
}


function normalizePhone(phone: string) {
  const number = phone.replace(/\D/g, "");

  return number.startsWith("55")
    ? number
    : `55${number}`;
}


function whatsappUrl(phone: string) {
  return `https://wa.me/${normalizePhone(phone)}`;
}


function invitationWhatsappUrl(
  phone: string,
  customerName: string,
  formUrl: string,
) {
  const message = encodeURIComponent(
    `Olá, ${customerName}! Segue o seu link individual para preencher a anamnese: ${formUrl}`,
  );

  return (
    `https://wa.me/${normalizePhone(phone)}` +
    `?text=${message}`
  );
}


export default function DashboardCustomersPage() {
  const [customers, setCustomers] =
    useState<DashboardCustomer[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [generatedInvitation, setGeneratedInvitation] =
    useState<{
      customerName: string;
      customerPhone: string;
      invitation: AnamnesisInvitationResult;
    } | null>(null);


  const loadCustomers = useCallback(
    async (currentSearch = "") => {
      setLoading(true);
      setError("");

      try {
        const result =
          await getDashboardCustomers(
            currentSearch,
          );

        setCustomers(result);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar os clientes.";

        if (
          message.includes(
            "Autenticação",
          )
        ) {
          window.location.href =
            "/acesso-terapeuta";
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );


  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadCustomers(search);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search, loadCustomers]);


  async function generateInvitation(
    customerName: string,
    customerEmail: string,
    customerPhone: string,
  ) {
    setCreating(true);
    setError("");
    setGeneratedInvitation(null);

    try {
      const invitation =
        await createAnamnesisInvitation(
          customerName,
          customerEmail,
          customerPhone,
        );

      setGeneratedInvitation({
        customerName,
        customerPhone,
        invitation,
      });

      setName("");
      setEmail("");
      setPhone("");

      await loadCustomers(search);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível gerar o link.";

      if (
        message.includes(
          "Autenticação",
        )
      ) {
        window.location.href =
          "/acesso-terapeuta";
        return;
      }

      setError(message);
    } finally {
      setCreating(false);
    }
  }


  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await generateInvitation(
      name.trim(),
      email.trim(),
      phone.trim(),
    );
  }


  async function copyInvitationLink() {
    if (!generatedInvitation) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        generatedInvitation
          .invitation
          .form_url,
      );
    } catch {
      setError(
        "Não foi possível copiar o link automaticamente.",
      );
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
            <small>Área da terapeuta</small>
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
              Cadastre um cliente e gere
              o link individual da anamnese.
            </span>
          </div>
        </header>

        <section className="invitation-card">
          <div className="section-heading">
            <div>
              <p>Novo atendimento</p>
              <h2>Gerar link da anamnese</h2>
            </div>
          </div>

          <form
            className="invitation-form"
            onSubmit={handleCreate}
          >
            <label>
              Nome completo

              <input
                required
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
                placeholder="Nome do cliente"
              />
            </label>

            <label>
              E-mail

              <input
                required
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                placeholder="cliente@email.com"
              />
            </label>

            <label>
              WhatsApp

              <input
                required
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value,
                  )
                }
                placeholder="(92) 99999-9999"
              />
            </label>

            <button
              disabled={creating}
              type="submit"
            >
              {creating
                ? "Gerando..."
                : "Gerar link"}
            </button>
          </form>
        </section>

        {generatedInvitation && (
          <section className="generated-invitation">
            <div>
              <strong>
                Link criado para{" "}
                {
                  generatedInvitation
                    .customerName
                }
              </strong>

              <p>
                O link é individual,
                tem uso único e expira em
                sete dias.
              </p>

              <input
                readOnly
                value={
                  generatedInvitation
                    .invitation
                    .form_url
                }
              />
            </div>

            <div className="generated-actions">
              <button
                type="button"
                onClick={
                  copyInvitationLink
                }
              >
                Copiar link
              </button>

              <a
                href={invitationWhatsappUrl(
                  generatedInvitation
                    .customerPhone,
                  generatedInvitation
                    .customerName,
                  generatedInvitation
                    .invitation
                    .form_url,
                )}
                target="_blank"
                rel="noreferrer"
              >
                Enviar pelo WhatsApp
              </a>
            </div>
          </section>
        )}

        <section className="dashboard-filters customers-filter">
          <input
            aria-label="Buscar cliente"
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
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

              <h2>
                {customers.length} cliente(s)
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
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Telefone</th>
                    <th>Anamneses</th>
                    <th>Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map(
                    (customer) => (
                      <tr key={customer.id}>
                        <td>
                          <strong>
                            {customer.name}
                          </strong>

                          <small>
                            {customer.email}
                          </small>
                        </td>

                        <td>
                          {customer.phone}
                        </td>

                        <td>
                          {
                            customer
                              .anamnesis_count
                          }
                        </td>

                        <td>
                          {formatDate(
                            customer.created_at,
                          )}
                        </td>

                        <td>
                          <div className="customer-actions">
                            <button
                              type="button"
                              disabled={creating}
                              onClick={() =>
                                generateInvitation(
                                  customer.name,
                                  customer.email,
                                  customer.phone,
                                )
                              }
                            >
                              Gerar link
                            </button>

                            <a
                              href={whatsappUrl(
                                customer.phone,
                              )}
                              target="_blank"
                              rel="noreferrer"
                            >
                              WhatsApp
                            </a>

                            <a
                              href={
                                `mailto:${customer.email}`
                              }
                            >
                              E-mail
                            </a>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}