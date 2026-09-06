import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  getCurrentTherapist,
  prepareCsrf,
  therapistLogin,
} from "../services/dashboardApi";
import "./TherapistLoginPage.css";


export default function TherapistLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    prepareCsrf();

    getCurrentTherapist()
      .then(() => {
        window.location.href = "/painel";
      })
      .catch(() => {
        // A visitante ainda não está autenticada.
      });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await therapistLogin(username, password);
      window.location.href = "/painel";
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível entrar.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="therapist-login">
      <section className="login-card">
        <a className="login-brand" href="/">
          <span>EF</span>

          <div>
            <strong>Elisângela Fernandes</strong>
            <small>Terapeuta Emocional</small>
          </div>
        </a>

        <div className="login-heading">
          <p>Área reservada</p>
          <h1>Acesso da terapeuta</h1>
          <span>Entre para acompanhar clientes e anamneses.</span>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Usuário
            <input
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Digite seu usuário"
              required
              type="text"
              value={username}
            />
          </label>

          <label>
            Senha
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              required
              type="password"
              value={password}
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button disabled={loading} type="submit">
            {loading ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>

        <a className="back-home" href="/">
          Voltar ao site
        </a>
      </section>
    </main>
  );
}