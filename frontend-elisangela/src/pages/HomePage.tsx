import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Leaf,
  LockKeyhole,
  Menu,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Video,
  Wifi,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const whatsapp =
  "https://wa.me/5592993578484?text=Olá%2C%20Elisângela!%20Gostaria%20de%20saber%20mais%20sobre%20o%20atendimento%20online.";

const benefits = [
  {
    icon: Sparkles,
    title: "Foco em resultados",
    text: "Uma abordagem direcionada à transformação emocional e às suas necessidades.",
  },
  {
    icon: Video,
    title: "Atendimento online",
    text: "Realize o atendimento com comodidade, privacidade e segurança.",
  },
  {
    icon: Heart,
    title: "Cuidado individual",
    text: "Um processo conduzido com respeito pela sua história e pelo seu momento.",
  },
];

const specialties = [
  "Ansiedade e pensamentos acelerados",
  "Sobrecarga emocional",
  "Baixa autoestima e insegurança",
  "Dificuldades nos relacionamentos",
  "Medos e bloqueios emocionais",
  "Padrões emocionais que se repetem",
];

const questions = [
  {
    title: "O atendimento é online?",
    text: "Sim. O atendimento é realizado online, permitindo que você participe de onde estiver, em um ambiente reservado e confortável.",
  },
  {
    title: "Como faço para iniciar?",
    text: "Clique no botão do WhatsApp para conversar diretamente com a Elisângela e receber as orientações necessárias.",
  },
  {
    title: "Qual é o valor do atendimento?",
    text: "Os valores e as condições são informados diretamente pelo WhatsApp, de forma individual.",
  },
  {
    title: "O atendimento é sigiloso?",
    text: "Sim. As informações compartilhadas durante o atendimento são tratadas com cuidado, privacidade e confidencialidade.",
  },
];

function Brand({
  footer = false,
}: {
  footer?: boolean;
}) {
  return (
    <a
      href="#inicio"
      aria-label="Elisângela Fernandes — início"
      className="flex items-center gap-3 sm:gap-4"
    >
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-[#3a3329] text-[#f1dfbd] shadow-[0_12px_30px_rgba(47,40,31,0.22)] ${
          footer
            ? "h-14 w-14"
            : "h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16"
        }`}
      >
        <span
          className="text-xl font-bold sm:text-2xl"
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          EF
        </span>
      </span>

      <span className="min-w-0">
        <strong
          className={`block whitespace-nowrap font-semibold leading-none text-[#382f27] ${
            footer
              ? "text-2xl"
              : "text-lg sm:text-2xl md:text-[2rem]"
          }`}
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          Elisângela Fernandes
        </strong>

        <small className="mt-2 block whitespace-nowrap text-[0.5rem] font-bold uppercase tracking-[0.22em] text-[#94775d] sm:text-[0.58rem] md:text-[0.65rem]">
          Terapeuta Emocional
        </small>
      </span>
    </a>
  );
}

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
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-3 py-3 sm:px-5 lg:px-8">
          <Brand />

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

          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[#6c7c65] px-6 py-3.5 font-bold text-white shadow-[0_12px_30px_rgba(77,98,72,0.23)] transition hover:-translate-y-0.5 hover:bg-[#53634e] lg:inline-flex"
          >
            <MessageCircle size={19} />
            Iniciar sessão
          </a>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (current) => !current,
              )
            }
            aria-label="Abrir menu"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#3c3429] text-white lg:hidden"
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
          className="relative overflow-hidden bg-[#3a3329]"
        >
          <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#788a70]/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#b88e68]/20 blur-3xl" />

          <div className="absolute right-[12%] top-[12%] h-20 w-20 rounded-full border border-[#83927c]/30" />
          <div className="absolute right-[7%] top-[19%] h-8 w-8 rounded-full bg-[#788a70]/25" />

          <div className="relative mx-auto grid min-h-[760px] max-w-[1400px] items-center gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#a9b89f]/40 bg-[#718069]/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-[#dfe8d8]">
                <Video size={16} />
                Atendimento terapêutico online
              </p>

              <h1
                className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.03em] text-[#fff8ed] md:text-7xl lg:text-[5.4rem]"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Terapia emocional{" "}
                <span className="text-[#b8c8ae]">
                  focada em resultados.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#e4d8c8] md:text-xl">
                Atendimento online para quem busca
                transformação emocional, mais equilíbrio
                e uma abordagem direcionada às suas
                necessidades.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#74866c] px-8 py-4 font-bold text-white shadow-[0_16px_35px_rgba(25,31,22,0.3)] transition hover:-translate-y-1 hover:bg-[#899b81]"
                >
                  Iniciar sessão online
                  <ArrowRight size={19} />
                </a>

                <a
                  href="#sobre"
                  className="inline-flex items-center justify-center rounded-full border border-[#c7ac8b] bg-white/5 px-8 py-4 font-bold text-[#f5eadb] transition hover:bg-white/10"
                >
                  Conhecer o atendimento
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-4 text-sm font-semibold text-[#eee3d4]">
                <span className="flex items-center gap-2">
                  <Video
                    size={18}
                    className="text-[#aebfa4]"
                  />
                  Atendimento 100% online
                </span>

                <span className="flex items-center gap-2">
                  <LockKeyhole
                    size={18}
                    className="text-[#aebfa4]"
                  />
                  Privacidade e segurança
                </span>

                <span className="flex items-center gap-2">
                  <Wifi
                    size={18}
                    className="text-[#aebfa4]"
                  />
                  De onde você estiver
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="absolute -inset-5 rotate-3 rounded-[3rem] bg-[#718069]/45" />

              <div className="absolute -inset-3 -rotate-2 rounded-[3rem] border border-[#c9b391]/30 bg-white/5" />

              <img
                src="/elisangela.png"
                alt="Elisângela Fernandes, terapeuta emocional"
                className="relative aspect-[4/5] w-full rounded-[2.7rem] object-cover object-top shadow-[0_35px_80px_rgba(0,0,0,0.32)]"
              />

              <div className="absolute -bottom-7 -left-3 max-w-[290px] rounded-[1.7rem] border border-white/70 bg-[#fffaf2]/95 p-5 shadow-2xl backdrop-blur-xl md:-left-10">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#dfe7d9] text-[#586851]">
                    <Video size={21} />
                  </span>

                  <div>
                    <p
                      className="text-2xl font-semibold text-[#3a3329]"
                      style={{
                        fontFamily:
                          '"Cormorant Garamond", serif',
                      }}
                    >
                      Atendimento online
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[#786958]">
                      Cuidado emocional onde você
                      estiver.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="sobre"
          className="relative overflow-hidden bg-[#f8f3e9]"
        >
          <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#cbd6c4]/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1400px] gap-12 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8e7157]">
                Sobre o atendimento
              </p>

              <h2
                className="mt-5 text-4xl font-semibold leading-tight text-[#382f27] md:text-6xl"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Uma abordagem direcionada à
                transformação emocional.
              </h2>
            </div>

            <div className="rounded-[2.5rem] border border-white bg-white/45 p-8 shadow-[0_25px_70px_rgba(61,49,35,0.08)] backdrop-blur-sm md:p-12">
              <Leaf
                size={30}
                className="text-[#6c7c65]"
              />

              <p className="mt-6 text-lg leading-9 text-[#716253]">
                O atendimento é realizado online e possui
                uma abordagem focada em resultados,
                respeitando a história, as necessidades e
                os objetivos de cada pessoa.
              </p>

              <p className="mt-6 text-lg leading-9 text-[#716253]">
                Este espaço será atualizado com a
                apresentação completa do método e dos
                princípios utilizados pela Elisângela.
              </p>

              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#3a3329] px-7 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#6c7c65]"
              >
                Falar com Elisângela
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </section>

        <section
          id="atendimento"
          className="bg-[#ede3d5]"
        >
          <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d7158]">
                Atendimento terapêutico
              </p>

              <h2
                className="mt-5 text-4xl font-semibold leading-tight md:text-6xl"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Cuidado emocional com direção e
                propósito.
              </h2>

              <p className="mt-6 text-lg leading-8 text-[#756657]">
                Atendimento individual, online e
                direcionado às necessidades de cada
                pessoa.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article
                    key={benefit.title}
                    className="group rounded-[2rem] border border-white/90 bg-[#fffdf8] p-8 shadow-[0_22px_60px_rgba(62,49,35,0.09)] transition hover:-translate-y-2 hover:border-[#9daf99]"
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-[#dde5d8] text-[#53634e] transition group-hover:bg-[#6c7c65] group-hover:text-white">
                      <Icon size={25} />
                    </span>

                    <h3
                      className="mt-7 text-3xl font-semibold"
                      style={{
                        fontFamily:
                          '"Cormorant Garamond", serif',
                      }}
                    >
                      {benefit.title}
                    </h3>

                    <p className="mt-4 text-lg leading-8 text-[#7a6b5c]">
                      {benefit.text}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-16 grid overflow-hidden rounded-[2.8rem] bg-[#3a3329] shadow-[0_30px_80px_rgba(51,42,32,0.18)] lg:grid-cols-2">
              <div className="p-9 text-white md:p-14">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#cbb494]">
                  Cuidado individual
                </p>

                <h3
                  className="mt-5 text-4xl font-semibold md:text-5xl"
                  style={{
                    fontFamily:
                      '"Cormorant Garamond", serif',
                  }}
                >
                  Quando as emoções começam a afetar sua
                  rotina.
                </h3>

                <p className="mt-6 text-lg leading-8 text-[#ded3c4]">
                  Buscar ajuda pode ser um passo
                  importante para compreender e
                  transformar questões emocionais que
                  continuam interferindo na sua vida.
                </p>

                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#dfe7d9] px-7 py-4 font-bold text-[#394533] transition hover:bg-white"
                >
                  Conversar pelo WhatsApp
                  <MessageCircle size={18} />
                </a>
              </div>

              <div className="bg-[#6c7c65] p-9 text-white md:p-14">
                <p className="mb-7 text-sm font-bold uppercase tracking-[0.22em] text-[#e0eadb]">
                  O atendimento pode auxiliar em
                </p>

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
          </div>
        </section>

        <section className="bg-[#f8f3e9]">
          <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:px-8">
            <div className="rounded-[3rem] bg-[#dfe7d9] p-10 md:p-14">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-[#6c7c65] text-white">
                <Video size={29} />
              </span>

              <h2
                className="mt-8 text-4xl font-semibold leading-tight md:text-6xl"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Atendimento de onde você estiver.
              </h2>

              <p className="mt-6 text-lg leading-8 text-[#65705f]">
                Tenha acesso ao atendimento terapêutico
                sem precisar se deslocar, utilizando um
                ambiente reservado e uma conexão com a
                internet.
              </p>
            </div>

            <div className="grid gap-5">
              <div className="flex gap-5 rounded-[2rem] border border-[#e2d6c7] bg-white/60 p-7">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#eee3d4] text-[#795f48]">
                  <Wifi size={23} />
                </span>

                <div>
                  <h3
                    className="text-2xl font-semibold"
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", serif',
                    }}
                  >
                    Comodidade
                  </h3>

                  <p className="mt-2 leading-7 text-[#796a5b]">
                    Atendimento online realizado no local
                    em que você se sentir mais
                    confortável.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 rounded-[2rem] border border-[#e2d6c7] bg-white/60 p-7">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#dfe7d9] text-[#586851]">
                  <ShieldCheck size={23} />
                </span>

                <div>
                  <h3
                    className="text-2xl font-semibold"
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", serif',
                    }}
                  >
                    Privacidade
                  </h3>

                  <p className="mt-2 leading-7 text-[#796a5b]">
                    Um atendimento individual conduzido
                    com segurança e confidencialidade.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 rounded-[2rem] border border-[#e2d6c7] bg-white/60 p-7">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#eee3d4] text-[#795f48]">
                  <Leaf size={23} />
                </span>

                <div>
                  <h3
                    className="text-2xl font-semibold"
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", serif',
                    }}
                  >
                    Flexibilidade
                  </h3>

                  <p className="mt-2 leading-7 text-[#796a5b]">
                    Mais facilidade para incluir o
                    cuidado emocional na sua rotina.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="duvidas"
          className="border-y border-[#ded1c1] bg-[#eee4d6]"
        >
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-24 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d7158]">
                Dúvidas frequentes
              </p>

              <h2
                className="mt-5 text-4xl font-semibold leading-tight md:text-5xl"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Informações para você se sentir mais
                segura.
              </h2>

              <p className="mt-6 leading-8 text-[#79695a]">
                Para outras informações, converse
                diretamente com a Elisângela pelo
                WhatsApp.
              </p>
            </div>

            <div className="divide-y divide-[#d5c6b4] border-y border-[#d5c6b4]">
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
                      <span
                        className="text-xl font-semibold md:text-2xl"
                        style={{
                          fontFamily:
                            '"Cormorant Garamond", serif',
                        }}
                      >
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
          </div>
        </section>

        <section
          id="blog"
          className="bg-[#dfe7d9]"
        >
          <div className="mx-auto max-w-[1400px] px-6 py-24 text-center lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#63715d]">
              Conteúdo e informação
            </p>

            <h2
              className="mt-5 text-4xl font-semibold md:text-6xl"
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              Em breve, novos conteúdos no blog.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#63705e]">
              Um espaço para conteúdos escritos pela
              Elisângela sobre sua abordagem terapêutica
              e cuidado emocional.
            </p>
          </div>
        </section>

        <section className="bg-[#f8f3e9] px-5 py-20">
          <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[3rem] bg-[#3a3329] px-7 py-16 text-center text-white shadow-[0_30px_80px_rgba(55,43,31,0.22)] md:px-14">
            <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-[#718069]/30 blur-2xl" />
            <div className="absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-[#a67f5d]/20 blur-2xl" />

            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#cbb894]">
                Atendimento online
              </p>

              <h2
                className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Comece seu processo de transformação
                emocional.
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#ddd3c4]">
                Entre em contato para receber
                informações sobre o atendimento,
                disponibilidade e valores.
              </p>

              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#dfe7d9] px-8 py-4 font-bold text-[#35402f] transition hover:-translate-y-1 hover:bg-white"
              >
                <MessageCircle size={19} />
                Falar pelo WhatsApp
              </a>
            </div>
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
          <Brand footer />

          <div>
            <strong
              className="text-xl font-semibold"
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              Navegação
            </strong>

            <div className="mt-4 grid gap-2 text-[#716153]">
              <a href="#inicio">Início</a>
              <a href="#sobre">Sobre</a>
              <a href="#atendimento">
                Atendimento
              </a>
              <a href="#duvidas">Dúvidas</a>
              <a href="#blog">Blog</a>
            </div>
          </div>

          <div>
            <strong
              className="text-xl font-semibold"
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              Atendimento online
            </strong>

            <p className="mt-4 leading-7 text-[#716153]">
              Entre em contato para receber mais
              informações.
            </p>

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-2 font-semibold text-[#566750]"
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