import {
  ArrowLeft,
  Check,
  Copy,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

type PixPayment = {
  payment_id: string;
  status: string;
  value: string;
  pix_copy_paste: string;
  qr_code: string;
  display_expires_at: string;
};

type PaymentStatus = {
  status: string;
  anamnesis_released: boolean;
};

type Access = {
  access_token: string;
  expires_at: string;
  form_url: string;
};

const initialForm = {
  name: "",
  email: "",
  phone: "",
  cpf: "",
};

function qrSource(qrCode: string) {
  return qrCode.startsWith("data:")
    ? qrCode
    : `data:image/png;base64,${qrCode}`;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [payment, setPayment] = useState<PixPayment | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function updateCountdown(expiresAt: string) {
    const remaining = Math.max(
      0,
      Math.floor(
        (new Date(expiresAt).getTime() - Date.now()) / 1000,
      ),
    );
    setSeconds(remaining);
  }

  useEffect(() => {
    if (!payment) return;

    updateCountdown(payment.display_expires_at);

    const timer = window.setInterval(() => {
      updateCountdown(payment.display_expires_at);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [payment]);

  useEffect(() => {
    if (!payment) return;

    const interval = window.setInterval(async () => {
      try {
        const result = await apiRequest<PaymentStatus>(
          `/payments/${payment.payment_id}/status/`,
        );

        if (
          result.status === "PAID" &&
          result.anamnesis_released
        ) {
          window.clearInterval(interval);

          const access = await apiRequest<Access>(
            `/payments/${payment.payment_id}/anamnesis-access/`,
            { method: "POST" },
          );

          sessionStorage.setItem(
            "anamnesis_access",
            JSON.stringify({
              paymentId: payment.payment_id,
              ...access,
            }),
          );

          navigate("/anamnese");
        }
      } catch {
        // A próxima consulta tentará novamente.
      }
    }, 5000);

    return () => window.clearInterval(interval);
  }, [payment, navigate]);

  async function createPayment(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest<PixPayment>(
        "/payments/",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            phone: form.phone.replace(/\D/g, ""),
            cpf: form.cpf.replace(/\D/g, ""),
          }),
        },
      );

      setPayment(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível gerar o Pix.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function renewPayment() {
    if (!payment) return;

    setLoading(true);
    setError("");

    try {
      const renewed = await apiRequest<PixPayment>(
        `/payments/${payment.payment_id}/renew/`,
        { method: "POST" },
      );
      setPayment(renewed);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível renovar o Pix.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyPix() {
    if (!payment) return;

    await navigator.clipboard.writeText(
      payment.pix_copy_paste,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const minutes = String(
    Math.floor(seconds / 60),
  ).padStart(2, "0");

  const remainingSeconds = String(
    seconds % 60,
  ).padStart(2, "0");

  return (
    <main className="min-h-screen bg-[#faf8f5] px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#715747]"
        >
          <ArrowLeft size={17} />
          Voltar para o início
        </Link>

        <div className="mt-8 grid overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm md:grid-cols-2">
          <section className="bg-[#715747] p-8 text-white md:p-12">
            <p className="text-sm uppercase tracking-[0.2em] text-[#e8d9cc]">
              Sessão individual
            </p>

            <h1 className="mt-4 text-4xl font-semibold">
              Inicie seu atendimento
            </h1>

            <p className="mt-5 leading-7 text-stone-200">
              Após a confirmação do Pix, o formulário de
              anamnese será liberado automaticamente.
            </p>

            <div className="mt-10 border-t border-white/20 pt-7">
              <p className="text-sm text-stone-300">
                Valor da sessão
              </p>
              <p className="mt-1 text-4xl font-semibold">
                R$ 150,00
              </p>
            </div>
          </section>

          <section className="p-8 md:p-12">
            {!payment ? (
              <form onSubmit={createPayment}>
                <h2 className="text-2xl font-semibold text-[#5f493d]">
                  Seus dados
                </h2>

                <div className="mt-7 space-y-5">
                  {[
                    ["name", "Nome completo", "text"],
                    ["email", "E-mail", "email"],
                    ["phone", "Celular com DDD", "tel"],
                    ["cpf", "CPF", "text"],
                  ].map(([name, label, type]) => (
                    <label
                      key={name}
                      className="block text-sm font-medium text-stone-700"
                    >
                      {label}
                      <input
                        required
                        type={type}
                        value={
                          form[name as keyof typeof form]
                        }
                        onChange={(event) =>
                          setForm({
                            ...form,
                            [name]: event.target.value,
                          })
                        }
                        className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#8b6b57] focus:ring-2 focus:ring-[#8b6b57]/20"
                      />
                    </label>
                  ))}
                </div>

                {error && (
                  <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  disabled={loading}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#715747] px-6 py-3.5 font-semibold text-white disabled:opacity-60"
                >
                  {loading && (
                    <LoaderCircle
                      className="animate-spin"
                      size={19}
                    />
                  )}
                  Gerar Pix
                </button>
              </form>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-[#5f493d]">
                  Pague com Pix
                </h2>

                {seconds > 0 ? (
                  <>
                    <p className="mt-2 text-stone-600">
                      O formulário será liberado após a confirmação.
                    </p>

                    <img
                      src={qrSource(payment.qr_code)}
                      alt="QR Code para pagamento Pix"
                      className="mx-auto mt-6 h-52 w-52"
                    />

                    <p className="mt-4 text-sm text-stone-500">
                      Este código será renovado em
                    </p>
                    <p className="mt-1 text-xl font-semibold text-[#715747]">
                      {minutes}:{remainingSeconds}
                    </p>

                    <button
                      type="button"
                      onClick={copyPix}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-[#715747] px-5 py-3 font-semibold text-[#715747]"
                    >
                      {copied ? (
                        <Check size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                      {copied
                        ? "Código copiado"
                        : "Copiar Pix copia e cola"}
                    </button>

                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-stone-500">
                      <LoaderCircle
                        className="animate-spin"
                        size={17}
                      />
                      Aguardando confirmação
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-8 text-stone-600">
                      O tempo deste código terminou. Gere um
                      novo Pix para continuar.
                    </p>

                    {error && (
                      <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                        {error}
                      </p>
                    )}

                    <button
                      type="button"
                      disabled={loading}
                      onClick={renewPayment}
                      className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#715747] px-6 py-3.5 font-semibold text-white disabled:opacity-60"
                    >
                      <RefreshCw size={18} />
                      Gerar novo Pix
                    </button>
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}