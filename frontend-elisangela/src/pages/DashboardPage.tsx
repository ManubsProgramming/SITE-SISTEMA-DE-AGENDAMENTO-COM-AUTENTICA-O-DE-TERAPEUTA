import {
  Check,
  Clipboard,
  ExternalLink,
  FilePlus2,
  FileText,
  Link2,
  Users,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  createAnamnesisInvitation,
  getCurrentTherapist,
  getDashboardSummary,
  therapistLogout,
} from "../services/dashboardApi";

import type {
  DashboardSummary,
  Therapist,
} from "../services/dashboardApi";

import "./DashboardPage.css";

function dateTime(value: string) {
  return new Date(value).toLocaleString(
    "pt-BR",
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  );
}

export default function DashboardPage() {
  const [therapist, setTherapist] =
    useState<Therapist | null>(null);

  const [data, setData] =
    useState<DashboardSummary | null>(
      null,
    );

  const [generatedLink, setGeneratedLink] =
    useState("");

  const [generating, setGenerating] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [error, setError] =
    useState("");

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
        window.location.href =
          "/acesso-terapeuta";
      });
  }, []);

  async function handleGenerateLink() {
    setGenerating(true);
    setCopied(false);
    setError("");

    try {
      const invitation =
        await createAnamnesisInvitation();

      setGeneratedLink(
        invitation.form_url,
      );

      if (data) {
        setData({
          ...data,
          summary: {
            ...data.summary,
            active_invitations:
              data.summary
                .active_invitations + 1,
          },
        });
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível gerar o link.",
      );
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopyLink() {
    if (!generatedLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        generatedLink,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      setError(
        "Não foi possível copiar o link.",
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

  if (!data) {
    return (
      <main className="dashboard-loading">
        <span className="loading-logo">
          EF
        </span>

        <p>Carregando painel...</p>
      </main>
    );
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
          <a
            className="active"
            href="/painel"
          >
            Visão geral
          </a>

          <a href="/painel/clientes">
            Clientes
          </a>

          <a href="/painel/anamneses">
            Anamneses
          </a>
          <a href="/painel/blog">
  Blog
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
            <p>Painel administrativo</p>

            <h1>
              Olá,{" "}
              {therapist?.name ||
                "Elisângela"}
            </h1>

            <span>
              Gerencie clientes e anamneses
              em um só lugar.
            </span>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            Abrir site
          </a>
        </header>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        <section className="dashboard-invitation-card">
          <div className="dashboard-invitation-icon">
            <FilePlus2 size={28} />
          </div>

          <div className="dashboard-invitation-content">
            <p>Nova anamnese</p>

            <h2>
              Gerar link para uma cliente
            </h2>

            <span>
              Gere um link individual e envie
              pelo WhatsApp. Os dados da
              cliente serão cadastrados quando
              ela enviar a anamnese.
            </span>
          </div>

          <button
            type="button"
            disabled={generating}
            onClick={handleGenerateLink}
            className="generate-invitation-button"
          >
            <Link2 size={18} />

            {generating
              ? "Gerando..."
              : "Gerar novo link"}
          </button>
        </section>

        {generatedLink && (
          <section className="generated-link-card">
            <div>
              <strong>
                Link gerado com sucesso
              </strong>

              <span>
                Este link é individual e
                poderá ser usado uma vez.
              </span>
            </div>

            <div className="generated-link-field">
              <input
                type="text"
                value={generatedLink}
                readOnly
                aria-label="Link da anamnese"
              />

              <button
                type="button"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check size={18} />
                ) : (
                  <Clipboard size={18} />
                )}

                {copied
                  ? "Copiado"
                  : "Copiar"}
              </button>
            </div>

            <a
              href={generatedLink}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={17} />
              Abrir link
            </a>
          </section>
        )}

        <section className="summary-grid dashboard-summary-simple">
          <a
            href="/painel/clientes"
            className="summary-card summary-card-link"
          >
            <span className="summary-card-icon">
              <Users size={23} />
            </span>

            <span>Clientes</span>

            <strong>
              {data.summary.customers}
            </strong>

            <small>
              Clientes com anamnese
            </small>
          </a>

          <a
            href="/painel/anamneses"
            className="summary-card summary-card-link"
          >
            <span className="summary-card-icon">
              <FileText size={23} />
            </span>

            <span>Anamneses</span>

            <strong>
              {data.summary.anamneses}
            </strong>

            <small>
              Formulários recebidos
            </small>
          </a>

          <article className="summary-card">
            <span className="summary-card-icon">
              <Link2 size={23} />
            </span>

            <span>Links ativos</span>

            <strong>
              {
                data.summary
                  .active_invitations
              }
            </strong>

            <small>
              Aguardando preenchimento
            </small>
          </article>
        </section>

        <section className="recent-section">
          <div className="section-heading">
            <div>
              <p>Atividade recente</p>

              <h2>
                Anamneses recebidas
              </h2>
            </div>

            <a href="/painel/anamneses">
              Ver todas
            </a>
          </div>

          {data.recent_anamneses
            .length === 0 ? (
            <div className="empty-dashboard">
              Nenhuma anamnese recebida.
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>CPF</th>
                    <th>Data</th>
                    <th>Ação</th>
                  </tr>
                </thead>

                <tbody>
                  {data.recent_anamneses.map(
                    (anamnesis) => (
                      <tr
                        key={anamnesis.id}
                      >
                        <td>
                          <strong>
                            {
                              anamnesis
                                .customer
                                .name
                            }
                          </strong>

                          <small>
                            {
                              anamnesis
                                .customer
                                .email
                            }
                          </small>
                        </td>

                        <td>
                          {anamnesis
                            .customer.cpf ||
                            "Não informado"}
                        </td>

                        <td>
                          {dateTime(
                            anamnesis
                              .submitted_at,
                          )}
                        </td>

                        <td>
                          <a
                            className="dashboard-table-link"
                            href={`/painel/anamneses/${anamnesis.id}`}
                          >
                            Visualizar
                          </a>
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