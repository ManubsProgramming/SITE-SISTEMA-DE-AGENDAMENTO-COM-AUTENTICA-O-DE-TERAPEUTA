import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const whatsapp =
  "https://wa.me/5592993578484?text=Olá,%20Elisângela!%20Gostaria%20de%20saber%20mais%20sobre%20o%20atendimento.";

const steps = [
  {
    number: "01",
    title: "Encontro",
    text: "Após o pagamento, você recebe acesso ao formulário de anamnese para responder com calma.",
  },
  {
    number: "02",
    title: "Anamnese",
    text: "Um olhar cuidadoso sobre sua história, emoções e o que deseja transformar.",
  },
  {
    number: "03",
    title: "Sessão",
    text: "Uma conversa acolhedora, com escuta atenta e respeito ao seu momento.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_20%,#fffdf9_0%,#f3e9d8_48%,#e6e9df_100%)] text-[#332e27]">
      <header className="mx-auto max-w-[1400px] px-5 pt-5">
        <nav className="flex items-center justify-between rounded-[1.7rem] border border-white/90 bg-white/45 px-5 py-4 shadow-[0_18px_50px_rgba(68,57,43,0.08)] backdrop-blur-xl md:px-8">
          <Link to="/" className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#342f27] font-serif text-lg text-white">
              EF
            </span>

            <span>
              <strong className="block font-serif text-lg">
                Elisângela Fernandes
              </strong>
              <span className="text-sm text-[#947b64]">
                Terapeuta Emocional
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-10 text-[#655b50] md:flex">
            <a href="#sobre">Sobre</a>
            <a href="#metodo">Método</a>
            <a href="#sessao">Sessão</a>
          </div>

          <Link
            to="/pagamento"
            className="rounded-full bg-[#373128] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#211e19]"
          >
            <span className="hidden sm:inline">
              Agendar sessão
            </span>
            <span className="sm:hidden">Agendar</span>
          </Link>
        </nav>
      </header>

      <main>
        <section
          id="sobre"
          className="mx-auto grid min-h-[780px] max-w-[1400px] items-center gap-12 px-6 py-16 lg:grid-cols-[1.3fr_0.8fr] lg:px-8"
        >
          <div>
            <p className="inline-flex rounded-full border border-white/90 bg-white/40 px-5 py-2 text-xs uppercase tracking-[0.24em] text-[#927863]">
              Acolhimento · Escuta · Clareza
            </p>

            <h1 className="mt-9 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.03em] md:text-7xl lg:text-[5.5rem]">
              Um espaço para{" "}
              <em className="font-normal text-[#b5a081]">
                sentir
              </em>
              <br />
              com mais leveza.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#76695c] md:text-xl">
              Um atendimento emocional com abordagem
              acolhedora. Um encontro para você se escutar,
              compreender o que sente e olhar com cuidado para
              a própria história.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/pagamento"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#373128] px-7 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
              >
                Reservar por R$ 150
                <ArrowRight size={18} />
              </Link>

              <a
                href="#metodo"
                className="px-7 py-4 text-center font-medium text-[#655b50]"
              >
                Conhecer o método
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -inset-4 rounded-[3rem] border border-white bg-white/30 backdrop-blur-sm" />

            <img
              src="/elisangela.png"
              alt="Elisângela Fernandes, terapeuta emocional"
              className="relative aspect-[4/5] w-full rounded-[2.5rem] object-cover object-top shadow-[0_30px_80px_rgba(58,48,35,0.18)]"
            />

            <div className="absolute -bottom-5 -left-5 rounded-[1.5rem] border border-white bg-white/65 px-6 py-4 shadow-xl backdrop-blur-xl">
              <p className="font-serif text-2xl">
                Cuidado individual
              </p>
              <p className="mt-1 text-sm text-[#887361]">
                Um espaço para a sua história
              </p>
            </div>
          </div>
        </section>

        <section
          id="metodo"
          className="mx-auto max-w-[1400px] px-5 py-24"
        >
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <h2 className="max-w-4xl font-serif text-4xl leading-tight md:text-6xl">
              Uma sessão que começa pela escuta e segue com
              mais clareza.
            </h2>

            <p className="self-end text-lg leading-8 text-[#837568]">
              Um processo guiado, no seu ritmo, começando pela
              anamnese.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="min-h-72 rounded-[2rem] border border-white bg-white/35 p-8 shadow-[0_25px_60px_rgba(72,60,44,0.08)] backdrop-blur-lg"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#342f27] font-serif text-xl text-white">
                  {step.number}
                </span>

                <h3 className="mt-8 font-serif text-3xl">
                  {step.title}
                </h3>

                <p className="mt-4 text-lg leading-8 text-[#837568]">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="sessao"
          className="mx-auto max-w-[1400px] px-5 pb-24"
        >
          <div className="grid overflow-hidden rounded-[3rem] border border-white bg-white/35 shadow-[0_30px_80px_rgba(64,52,38,0.1)] backdrop-blur-xl lg:grid-cols-2">
            <div className="p-9 md:p-16">
              <p className="text-sm uppercase tracking-[0.24em] text-[#9c8169]">
                Sessão individual
              </p>

              <p className="mt-7 font-serif text-6xl md:text-7xl">
                R$ 150
                <span className="ml-3 font-sans text-base text-[#8a7867]">
                  / sessão
                </span>
              </p>

              <ul className="mt-9 space-y-4 text-lg text-[#776b5f]">
                <li>✦ Anamnese liberada após o pagamento</li>
                <li>✦ Atendimento individual e acolhedor</li>
                <li>✦ Confidencialidade e respeito</li>
              </ul>
            </div>

            <div className="m-5 flex flex-col justify-center rounded-[2.3rem] border border-white bg-white/55 p-9 md:m-8 md:p-12">
              <h2 className="font-serif text-4xl">
                Reserve seu momento de cuidado
              </h2>

              <p className="mt-4 text-lg leading-8 text-[#837568]">
                Após a confirmação do Pix, o acesso à anamnese
                será liberado automaticamente.
              </p>

              <Link
                to="/pagamento"
                className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-[#373128] px-7 py-4 font-semibold text-white"
              >
                Pagar R$ 150 e liberar acesso
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Conversar pelo WhatsApp"
        className="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-[#373128] text-white shadow-xl transition hover:scale-105"
      >
        <MessageCircle size={24} />
      </a>

      <footer className="border-t border-white/70 px-5 py-8 text-center text-sm text-[#837568]">
        © {new Date().getFullYear()} Elisângela Fernandes —
        Terapeuta Emocional
      </footer>
    </div>
  );
}