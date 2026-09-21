import {
  useEffect,
  useState,
} from "react";

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


export default function DashboardPage() {
  const [therapist, setTherapist] =
    useState<Therapist | null>(null);

  const [data, setData] =
    useState<DashboardSummary | null>(null);

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


  const cards = [
    [
      "Clientes cadastrados",
      data.summary.customers,
    ],
    [
      "Anamneses recebidas",
      data.summary.anamneses,
    ],
  ];


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
              Acompanhe clientes e anamneses
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

        <section className="summary-grid">
          {cards.map(([label, value]) => (
            <article
              className="summary-card"
              key={label}
            >
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </section>

        <section className="recent-section">
          <div className="section-heading">
            <div>
              <p>Acesso rápido</p>
              <h2>Gerenciar atendimentos</h2>
            </div>
          </div>

          <div className="dashboard-shortcuts">
            <a
              className="summary-card"
              href="/painel/clientes"
            >
              <span>Clientes</span>

              <strong>
                Gerar link da anamnese
              </strong>

              <small>
                Cadastre ou localize um cliente
                pelo CPF.
              </small>
            </a>

            <a
              className="summary-card"
              href="/painel/anamneses"
            >
              <span>Anamneses</span>

              <strong>
                Consultar respostas
              </strong>

              <small>
                Visualize as respostas e baixe
                o PDF.
              </small>
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}