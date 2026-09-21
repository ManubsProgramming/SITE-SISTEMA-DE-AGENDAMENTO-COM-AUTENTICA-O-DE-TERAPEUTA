import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Leaf,
  LockKeyhole,
  Menu,
  MessageCircle,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const whatsapp =
  "https://wa.me/5592993578484?text=Olá%2C%20Elisângela!%20Gostaria%20de%20saber%20mais%20sobre%20o%20atendimento.";

const benefits = [
  {
    icon: Heart,
    title: "Escuta acolhedora",
    text: "Um espaço seguro para expressar o que você sente, sem julgamentos.",
  },
  {
    icon: Leaf,
    title: "Mais leveza",
    text: "Compreenda suas emoções e encontre caminhos mais saudáveis.",
  },
  {
    icon: Sparkles,
    title: "Autoconhecimento",
    text: "Reconheça padrões, fortaleça sua autoestima e cuide de si.",
  },
];

const steps = [
  {
    number: "01",
    title: "Primeiro contato",
    text: "Você chama pelo WhatsApp e conta brevemente o que está buscando.",
  },
  {
    number: "02",
    title: "Orientação inicial",
    text: "Conversamos sobre sua necessidade e combinamos o melhor caminho.",
  },
  {
    number: "03",
    title: "Anamnese",
    text: "Você recebe um link individual e protegido para preencher sua anamnese.",
  },
  {
    number: "04",
    title: "Atendimento",
    text: "A sessão acontece com privacidade, respeito e escuta cuidadosa.",
  },
];

const specialties = [
  "Ansiedade e pensamentos acelerados",
  "Sobrecarga emocional",
  "Baixa autoestima e insegurança",
  "Dificuldades nos relacionamentos",
  "Medos e bloqueios emocionais",
  "Padrões que se repetem",
];

const questions = [
  {
    title: "Como faço para iniciar?",
    text: "Clique em um dos botões de WhatsApp. A Elisângela conversará com você e explicará os próximos passos.",
  },
  {
    title: "Qual é o valor do atendimento?",
    text: "Os valores e as condições são informados diretamente pelo WhatsApp, de forma individual.",
  },
  {
    title: "Como funciona a anamnese?",
    text: "Após o primeiro contato, você recebe um link individual para responder o formulário com segurança e tranquilidade.",
  },
  {
    title: "O atendimento é sigiloso?",
    text: "Sim. As informações compartilhadas são tratadas com cuidado, privacidade e confidencialidade.",
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [openQuestion, setOpenQuestion] =
    useState<number | null>(0);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#f8f3e9] text-[#332c24]">
      <header className="sticky top-0 z-50 border-b border-[#d8cab9]/70 bg-[#f8f3e9]/95 shadow-[0_10px_35px_rgba(65,50,35,0.08)] backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 lg:px-8">
          <a
            href="#inicio"
            className="flex items-center gap-3"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#3c3429] font-serif text-lg text-[#f6e7c7] shadow-lg">
              EF
            </span>

            <span>
              <strong className="block font-serif text-lg leading-tight md:text-xl">
                Elisângela Fernandes
              </strong>

              <small className="text-[#92775f]">
                Terapeuta Emocional
              </small>
            </span>
          </a>

          <div className="hidden items-center gap-8 font-semibold text-[#514536] lg:flex">
            <a
              href="#inicio"
              className="border-b-2 border-transparent py-2 transition hover:border-[#60735c] hover:text-[#60735c]"
            >
              Início
            </a>

            <a
              href="#sobre"
              className="border-b-2 border-transparent py-2 transition hover:border-[#60735c] hover:text-[#60735c]"
            >
              Sobre
            </a>

            <a
              href="#atendimento"
              className="border-b-2 border-transparent py-2 transition hover:border-[#60735c] hover:text-[#60735c]"
            >
              Atendimento
            </a>

            <a
              href="#como-funciona"
              className="border-b-2 border-transparent py-2 transition hover:border-[#60735c] hover:text-[#60735c]"
            >
              Como funciona
            </a>

            <a
              href="#duvidas"
              className="border-b-2 border-transparent py-2 transition hover:border-[#60735c] hover:text-[#60735c]"
            >
              Dúvidas
            </a>

            <a
              href="#blog"
              className="border-b-2 border-transparent py-2 transition hover:border-[#60735c] hover:text-[#60735c]"
            >
              Blog
            </a>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#6c7c65] px-6 py-3.5 font-bold text-white shadow-[0_12px_30px_rgba(77,98,72,0.23)] transition hover:-translate-y-0.5 hover:bg-[#53634e]"
            >
              <MessageCircle size={19} />
              Iniciar sessão
            </a>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((current) => !current)
            }
            aria-label="Abrir menu"
            className="grid h-11 w-11 place-items-center rounded-full bg-[#3c3429] text-white lg:hidden"
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t border-[#ded1c1] bg-[#f8f3e9] px-5 py-5 lg:hidden">
            <div className="mx-auto grid max-w-[1400px] gap-2 font-semibold">
              <a
                href="#inicio"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 hover:bg-white/70"
              >
                Início
              </a>

              <a
                href="#sobre"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 hover:bg-white/70"
              >
                Sobre
              </a>

              <a
                href="#atendimento"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 hover:bg-white/70"
              >
                Atendimento
              </a>

              <a
                href="#como-funciona"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 hover:bg-white/70"
              >
                Como funciona
              </a>

              <a
                href="#duvidas"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 hover:bg-white/70"
              >
                Dúvidas
              </a>

              <a
                href="#blog"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 hover:bg-white/70"
              >
                Blog
              </a>

              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#6c7c65] px-6 py-4 text-white"
              >
                <MessageCircle size={19} />
                Iniciar sessão
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        <section
          id="inicio"
          className="relative overflow-hidden"
        >
          <div className="absolute left-[-120px] top-20 h-80 w-80 rounded-full bg-[#b7c5ad]/25 blur-3xl" />
          <div className="absolute bottom-0 right-[-100px] h-96 w-96 rounded-full bg-[#b88e68]/20 blur-3xl" />

          <div className="relative mx-auto grid min-h-[760px] max-w-[1400px] items-center gap-14 px-6 py-20 lg:grid-cols-[1.12fr_0.88fr] lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#cdbba6] bg-white/60 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#80664f]">
                <Leaf size={15} />
                Acolhimento emocional
              </p>

              <h1 className="mt-8 max-w-3xl font-serif text-5xl leading-[1.03] tracking-[-0.035em] text-[#342d24] md:text-7xl lg:text-[5.4rem]">
                Um espaço seguro para cuidar de{" "}
                <span className="italic text-[#687960]">
                  você.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#756657] md:text-xl">
                Atendimento emocional individual para
                você compreender seus sentimentos,
                reconhecer padrões e construir uma vida
                com mais clareza e leveza.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#6c7c65] px-8 py-4 font-bold text-white shadow-[0_16px_35px_rgba(80,103,74,0.25)] transition hover:-translate-y-1 hover:bg-[#53634e]"
                >
                  Conversar pelo WhatsApp
                  <ArrowRight size={19} />
                </a>

                <a
                  href="#sobre"
                  className="inline-flex items-center justify-center rounded-full border border-[#a88b6d] bg-white/45 px-8 py-4 font-bold text-[#594938] transition hover:bg-white"
                >
                  Conhecer o atendimento
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-[#766757]">
                <span className="flex items-center gap-2">
                  <LockKeyhole
                    size={17}
                    className="text-[#687960]"
                  />
                  Sigilo e privacidade
                </span>

                <span className="flex items-center gap-2">
                  <Heart
                    size={17}
                    className="text-[#687960]"
                  />
                  Escuta individual
                </span>

                <span className="flex items-center gap-2">
                  <Video
                    size={17}
                    className="text-[#687960]"
                  />
                  Atendimento online
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[530px]">
              <div className="absolute -inset-4 rotate-3 rounded-[3rem] bg-[#9ead95]/35" />

              <div className="absolute -inset-3 -rotate-2 rounded-[3rem] border border-white/90 bg-white/30" />

              <img
                src="/elisangela.png"
                alt="Elisângela Fernandes, terapeuta emocional"
                className="relative aspect-[4/5] w-full rounded-[2.7rem] object-cover object-top shadow-[0_35px_80px_rgba(58,46,32,0.22)]"
              />

              <div className="absolute -bottom-6 -left-3 max-w-[280px] rounded-[1.6rem] border border-white bg-[#fffdf8]/90 p-5 shadow-xl backdrop-blur-xl md:-left-10">
                <p className="font-serif text-2xl">
                  Você não precisa enfrentar tudo
                  sozinha.
                </p>

                <p className="mt-2 text-sm leading-6 text-[#7b6958]">
                  Um atendimento construído no seu
                  ritmo.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="sobre"
          className="bg-[#3a3429] text-[#fffaf1]"
        >
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#c8b18e]">
                Sobre o atendimento
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
                Cuidado, presença e respeito pela sua
                história.
              </h2>
            </div>

            <div className="lg:pt-8">
              <p className="text-lg leading-9 text-[#ded4c5]">
                O atendimento oferece um espaço de
                acolhimento para você falar sobre suas
                emoções, compreender o que está vivendo
                e olhar com mais cuidado para experiências
                que ainda afetam sua rotina.
              </p>

              <p className="mt-6 text-lg leading-9 text-[#ded4c5]">
                Cada pessoa possui uma história única.
                Por isso, o processo respeita seu tempo,
                seus limites e aquilo que você se sente
                confortável para compartilhar.
              </p>

              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#f1e3ca] px-7 py-4 font-bold text-[#3a3429] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Falar com Elisângela
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section
          id="atendimento"
          className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d7158]">
              Para o seu momento
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
              Um acompanhamento que começa pela escuta.
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#7b6a5b]">
              Um processo individualizado para acolher
              suas necessidades emocionais.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="group rounded-[2rem] border border-[#e1d5c6] bg-[#fffdf8] p-8 shadow-[0_22px_60px_rgba(62,49,35,0.08)] transition hover:-translate-y-2 hover:border-[#9daf99]"
                >
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[#dde5d8] text-[#53634e] transition group-hover:bg-[#6c7c65] group-hover:text-white">
                    <Icon size={25} />
                  </span>

                  <h3 className="mt-7 font-serif text-3xl">
                    {benefit.title}
                  </h3>

                  <p className="mt-4 text-lg leading-8 text-[#7a6b5c]">
                    {benefit.text}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-16 grid overflow-hidden rounded-[2.8rem] bg-[#ded2c1] lg:grid-cols-2">
            <div className="p-9 md:p-14">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#785f48]">
                O acompanhamento pode ajudar
              </p>

              <h3 className="mt-5 font-serif text-4xl md:text-5xl">
                Quando as emoções começam a pesar.
              </h3>

              <p className="mt-5 text-lg leading-8 text-[#6d5e50]">
                Se algo tem afetado sua rotina, seus
                relacionamentos ou a forma como você
                enxerga a si mesma, buscar ajuda pode ser
                o primeiro passo.
              </p>
            </div>

            <div className="bg-[#6c7c65] p-9 text-white md:p-14">
              <ul className="grid gap-5">
                {specialties.map((specialty) => (
                  <li
                    key={specialty}
                    className="flex items-center gap-3 border-b border-white/20 pb-4 text-lg"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15">
                      <Check size={15} />
                    </span>

                    {specialty}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="como-funciona"
          className="bg-[#eee4d6]"
        >
          <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#876b52]">
                  Como funciona
                </p>

                <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
                  Seu atendimento começa com uma
                  conversa.
                </h2>
              </div>

              <p className="self-end text-lg leading-8 text-[#766657]">
                O contato é feito diretamente pelo
                WhatsApp. Depois disso, você recebe todas
                as orientações necessárias.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-[2rem] border border-white/80 bg-white/55 p-7 shadow-[0_20px_50px_rgba(67,52,37,0.07)]"
                >
                  <span className="font-serif text-5xl text-[#899981]">
                    {step.number}
                  </span>

                  <h3 className="mt-6 font-serif text-2xl">
                    {step.title}
                  </h3>

                  <p className="mt-4 leading-7 text-[#786858]">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#3a3429] px-8 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#6c7c65]"
              >
                Iniciar pelo WhatsApp
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section
          id="duvidas"
          className="mx-auto grid max-w-[1400px] gap-12 px-6 py-24 lg:grid-cols-[0.75fr_1.25fr] lg:px-8"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d7158]">
              Dúvidas frequentes
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              Informações para você se sentir mais
              segura.
            </h2>

            <p className="mt-6 leading-8 text-[#79695a]">
              Se ainda tiver alguma dúvida, envie uma
              mensagem diretamente pelo WhatsApp.
            </p>
          </div>

          <div className="divide-y divide-[#ded1c1] border-y border-[#ded1c1]">
            {questions.map((question, index) => {
              const open = openQuestion === index;

              return (
                <article key={question.title}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenQuestion(
                        open ? null : index,
                      )
                    }
                    className="flex w-full items-center justify-between gap-5 py-6 text-left"
                  >
                    <span className="font-serif text-xl font-semibold md:text-2xl">
                      {question.title}
                    </span>

                    <ChevronDown
                      size={22}
                      className={`shrink-0 transition ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open && (
                    <p className="max-w-3xl pb-7 text-lg leading-8 text-[#79695a]">
                      {question.text}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="blog"
          className="bg-[#dfe6da]"
        >
          <div className="mx-auto max-w-[1400px] px-6 py-24 text-center lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#63715d]">
              Conteúdo e acolhimento
            </p>

            <h2 className="mt-5 font-serif text-4xl md:text-6xl">
              Em breve, novos conteúdos no blog.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#63705e]">
              Reflexões sobre emoções,
              autoconhecimento, relacionamentos e
              cuidado emocional.
            </p>
          </div>
        </section>

        <section className="px-5 py-20">
          <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[3rem] bg-[#3a3429] px-7 py-16 text-center text-white shadow-[0_30px_80px_rgba(55,43,31,0.2)] md:px-14">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#cbb894]">
              Seu cuidado pode começar agora
            </p>

            <h2 className="mx-auto mt-6 max-w-4xl font-serif text-4xl leading-tight md:text-6xl">
              Vamos conversar sobre o que você está
              vivendo?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#ddd3c4]">
              Entre em contato para receber informações
              sobre atendimento, disponibilidade e
              valores.
            </p>

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#dfe6da] px-8 py-4 font-bold text-[#35402f] transition hover:-translate-y-1 hover:bg-white"
            >
              <MessageCircle size={19} />
              Falar pelo WhatsApp
            </a>
          </div>
        </section>
      </main>

      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Conversar pelo WhatsApp"
        className="fixed bottom-6 right-6 z-40 grid h-16 w-16 place-items-center rounded-full bg-[#5d7656] text-white shadow-[0_15px_35px_rgba(53,81,48,0.35)] transition hover:scale-110 hover:bg-[#496344]"
      >
        <MessageCircle size={28} />
      </a>

      <footer className="border-t border-[#d9ccbb] bg-[#eee4d6]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-12 md:grid-cols-3 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#3a3429] font-serif text-[#f4dfbd]">
                EF
              </span>

              <div>
                <strong className="font-serif text-lg">
                  Elisângela Fernandes
                </strong>

                <p className="text-sm text-[#8d7560]">
                  Terapeuta Emocional
                </p>
              </div>
            </div>
          </div>

          <div>
            <strong className="font-serif text-xl">
              Navegação
            </strong>

            <div className="mt-4 grid gap-2 text-[#716153]">
              <a href="#sobre">Sobre</a>
              <a href="#atendimento">Atendimento</a>
              <a href="#como-funciona">
                Como funciona
              </a>
              <a href="#duvidas">Dúvidas</a>
              <a href="#blog">Blog</a>
            </div>
          </div>

          <div>
            <strong className="font-serif text-xl">
              Contato
            </strong>

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-2 text-[#566750]"
            >
              <MessageCircle size={18} />
              Conversar pelo WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-[#d9ccbb] px-5 py-6">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 text-center text-sm text-[#7f6e5e] sm:flex-row">
            <p>
              © {new Date().getFullYear()} Elisângela
              Fernandes
            </p>

            <Link
              to="/acesso-terapeuta"
              className="inline-flex items-center gap-2 opacity-65 transition hover:opacity-100"
            >
              <LockKeyhole size={14} />
              Área da terapeuta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}