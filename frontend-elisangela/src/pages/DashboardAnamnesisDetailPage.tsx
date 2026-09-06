import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ReactNode } from "react";

import {
  downloadDashboardAnamnesisPdf,
  getDashboardAnamnesisDetail,
  therapistLogout,
} from "../services/dashboardApi";
import type {
  DashboardAnamnesisDetail,
} from "../services/dashboardApi";
import "./DashboardPage.css";


const labels: Record<string, string> = {
  identification: "Identificação",
  responses: "Perguntas da anamnese",
  feelings_map: "Mapa de sentimentos",
  additional_notes: "Observações adicionais",
  consent: "Consentimento",
  name: "Nome completo",
  email: "E-mail",
  phone: "Telefone",
  age: "Idade",
  birth_date: "Data de nascimento",
  rg: "RG",
  cpf: "CPF",
  marital_status: "Estado civil",
  education: "Escolaridade",
  profession: "Profissão",
  address: "Endereço",
  address_extra: "Complemento",
  neighborhood: "Bairro",
  city: "Cidade",
  state: "Estado",
  cep: "CEP",
  anxiety: "Ansiedade",
  sadness: "Tristeza",
  fear: "Medo",
  anger: "Raiva",
  happiness: "Alegria",
  guilt: "Culpa",
};


function fieldLabel(key: string) {
  if (labels[key]) {
    return labels[key];
  }

  const text = key
    .replace(/_/g, " ")
    .replace(/^\d+[.-]?\s*/, "");

  return text.charAt(0).toUpperCase() + text.slice(1);
}


function renderValue(value: unknown): ReactNode {
  if (
    value === null
    || value === undefined
    || value === ""
  ) {
    return (
      <span className="empty-answer">
        Não informado
      </span>
    );
  }

  if (typeof value === "boolean") {
    return value ? "Sim" : "Não";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <span className="empty-answer">
          Não informado
        </span>
      );
    }

    return (
      <div className="answer-options">
        {value.map((item, index) => (
          <span key={`${String(item)}-${index}`}>
            {String(item)}
          </span>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="nested-answers">
        {Object.entries(value).map(([key, item]) => (
          <article className="answer-item" key={key}>
            <strong>{fieldLabel(key)}</strong>
            <div>{renderValue(item)}</div>
          </article>
        ))}
      </div>
    );
  }

  return String(value);
}


function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}


function formatCurrency(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}


export default function DashboardAnamnesisDetailPage() {
  const { anamnesisId } = useParams();

  const [data, setData] =
    useState<DashboardAnamnesisDetail | null>(null);

  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!anamnesisId) {
      setError("Anamnese não identificada.");
      return;
    }

    getDashboardAnamnesisDetail(anamnesisId)
      .then(setData)
      .catch((requestError) => {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar a anamnese.";

        if (message.includes("Autenticação")) {
          window.location.href = "/acesso-terapeuta";
          return;
        }

        setError(message);
      });
  }, [anamnesisId]);

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

  async function handleDownload() {
    if (!anamnesisId) {
      return;
    }

    setDownloading(true);
    setError("");

    try {
      await downloadDashboardAnamnesisPdf(anamnesisId);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível baixar o PDF.";

      if (message.includes("Autenticação")) {
        window.location.href = "/acesso-terapeuta";
        return;
      }

      setError(message);
    } finally {
      setDownloading(false);
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

          <a href="/painel/pagamentos">
            Pagamentos
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
            <p>Documento clínico</p>
            <h1>Anamnese</h1>

            {data && (
              <span>
                Enviada em {formatDate(data.submitted_at)}
              </span>
            )}
          </div>

          <div className="detail-header-actions">
            {data && (
              <button
                disabled={downloading}
                onClick={handleDownload}
                type="button"
              >
                {downloading
                  ? "Baixando..."
                  : "Baixar PDF"}
              </button>
            )}

            <a href="/painel/anamneses">
              Voltar à lista
            </a>
          </div>
        </header>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {!data && !error && (
          <div className="detail-loading">
            Carregando anamnese...
          </div>
        )}

        {data && (
          <>
            <section className="anamnesis-client-card">
              <div>
                <span>Cliente</span>
                <strong>{data.customer.name}</strong>
              </div>

              <div>
                <span>E-mail</span>
                <strong>{data.customer.email}</strong>
              </div>

              <div>
                <span>Telefone</span>
                <strong>{data.customer.phone}</strong>
              </div>

              <div>
                <span>Pagamento</span>

                <strong>
                  {formatCurrency(data.payment.value)}
                </strong>
              </div>
            </section>

            <section className="anamnesis-answers-card">
              <div className="section-heading">
                <div>
                  <p>Respostas recebidas</p>
                  <h2>Formulário de anamnese</h2>
                </div>
              </div>

              {renderValue(data.answers)}
            </section>
          </>
        )}
      </section>
    </main>
  );
}