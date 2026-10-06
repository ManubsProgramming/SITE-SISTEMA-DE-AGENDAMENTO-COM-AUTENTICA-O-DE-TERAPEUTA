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
  "Ansiedade",
  "Depressão",
  "Estresse",
  "Abandono",
  "Dependência Emocional",
  "Baixa autoestima",
  "Medos e Fobias",
  "Perdas e luto",
];

const questions = [
  {
    title: "Como funciona a terapia online?",
    text: "Sim. O atendimento é realizado online, permitindo que você participe de onde estiver, em um ambiente reservado e confortável.",
  },
  {
    title: "Como funciona a primeira sessão?",
    text: "Clique no botão do WhatsApp para conversar diretamente com a Elisângela e receber as orientações necessárias.",
  },
  {
    title: "Qual a frequência das sessões?",
    text: "Os valores e as condições são informados diretamente pelo WhatsApp, de forma individual.",
  },
  {
    title:
      "Qual o valor da sessão e qual a forma de pagamento?",
    text: "Sim. As informações compartilhadas durante o atendimento são tratadas com cuidado, privacidade e confidencialidade.",
  },
  {
    title: "Aceita plano de saúde ou convênio?",
    text: "",
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
      className="flex items-center gap-2.5 sm:gap-4"
    >
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-[#3a3329] text-[#f1dfbd] shadow-[0_10px_25px_rgba(47,40,31,0.18)] ${
          footer
            ? "h-14 w-14"
            : "h-10 w-10 sm:h-14 sm:w-14 md:h-16 md:w-16"
        }`}
      >
        <span
          className="text-lg font-bold sm:text-2xl"
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
              : "text-[1.1rem] sm:text-2xl md:text-[2rem]"
          }`}
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          Elisângela Fernandes
        </strong>

        <small className="mt-1.5 block whitespace-nowrap text-[0.45rem] font-bold uppercase tracking-[0.18em] text-[#94775d] sm:mt-2 sm:text-[0.58rem] md:text-[0.65rem]">
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
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#d8cab9]/70 bg-[#f8f3e9]/95 shadow-[0_8px_25px_rgba(65,50,35,0.07)] backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-3 py-2.5 sm:px-5 sm:py-3 lg:px-8">
          <Brand />

          <div className="hidden items-center gap-7 font-semibold text-[#514536] lg:flex">
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
            className="hidden items-center gap-2 rounded-full bg-[#6c7c65] px-5 py-3 font-bold text-white shadow-[0_10px_25px_rgba(77,98,72,0.2)] transition hover:-translate-y-0.5 hover:bg-[#53634e] lg:inline-flex"
          >
            <MessageCircle size={18} />
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
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#3c3429] text-white sm:h-11 sm:w-11 lg:hidden"
          >
            {mobileMenuOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t border-[#ded1c1] bg-[#f8f3e9] px-4 py-4 lg:hidden">
            <div className="mx-auto grid max-w-[1400px] gap-1.5 font-semibold">
              <a
                href="#inicio"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-2.5 hover:bg-white/70"
              >
                Início
              </a>

              <a
                href="#sobre"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-2.5 hover:bg-white/70"
              >
                Sobre
              </a>

              <a
                href="#atendimento"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-2.5 hover:bg-white/70"
              >
                Atendimento
              </a>

              <a
                href="#duvidas"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-2.5 hover:bg-white/70"
              >
                Dúvidas
              </a>

              <a
                href="#blog"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-2.5 hover:bg-white/70"
              >
                Blog
              </a>

              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#6c7c65] px-5 py-3.5 text-white"
              >
                <MessageCircle size={18} />
                Iniciar sessão
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO */}
        <section
          id="inicio"
          className="relative overflow-hidden bg-[#3a3329]"
        >
          <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#788a70]/20 blur-3xl sm:h-80 sm:w-80" />

          <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#b88e68]/20 blur-3xl sm:h-96 sm:w-96" />

          <div className="absolute right-[12%] top-[12%] hidden h-20 w-20 rounded-full border border-[#83927c]/30 sm:block" />

          <div className="absolute right-[7%] top-[19%] hidden h-8 w-8 rounded-full bg-[#788a70]/25 sm:block" />

          <div className="relative mx-auto grid min-h-0 max-w-[1400px] items-center gap-8 px-5 py-10 sm:gap-10 sm:px-6 sm:py-14 lg:min-h-[760px] lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:px-8 lg:py-20">

            {/* FOTO PRIMEIRO NO CELULAR */}
            <div className="order-1 relative mx-auto w-full max-w-[350px] sm:max-w-[400px] lg:order-2 lg:max-w-[520px]">
              <div className="absolute -inset-3 rotate-3 rounded-[2.3rem] bg-[#718069]/45 sm:-inset-5 sm:rounded-[3rem]" />

              <div className="absolute -inset-2 -rotate-2 rounded-[2.3rem] border border-[#c9b391]/30 bg-white/5 sm:-inset-3 sm:rounded-[3rem]" />

              <img
                src="/elisangela.jpeg"
                alt="Elisângela Fernandes, terapeuta emocional"
                className="relative aspect-[4/5] w-full rounded-[2.1rem] object-cover object-top shadow-[0_25px_60px_rgba(0,0,0,0.28)] sm:rounded-[2.7rem] sm:shadow-[0_35px_80px_rgba(0,0,0,0.32)]"
              />

              <div className="absolute -bottom-5 -left-1 max-w-[235px] rounded-[1.3rem] border border-white/70 bg-[#fffaf2]/95 p-3.5 shadow-xl backdrop-blur-xl sm:-bottom-7 sm:-left-10 sm:max-w-[290px] sm:rounded-[1.7rem] sm:p-5">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#dfe7d9] text-[#586851] sm:h-11 sm:w-11">
                    <Video size={18} />
                  </span>

                  <div>
                    <p
                      className="text-xl font-semibold text-[#3a3329] sm:text-2xl"
                      style={{
                        fontFamily:
                          '"Cormorant Garamond", serif',
                      }}
                    >
                      Atendimento online
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-[#786958] sm:mt-1 sm:text-sm sm:leading-6">
                      Cuidado emocional onde você
                      estiver.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* TEXTO DEPOIS NO CELULAR */}
            <div className="order-2 lg:order-1">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#a9b89f]/40 bg-[#718069]/20 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.17em] text-[#dfe8d8] sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-[0.2em]">
                <Video size={14} />
                Atendimento terapêutico online
              </p>

              <h1
                className="mt-6 max-w-4xl text-[2.35rem] font-semibold leading-[1.04] tracking-[-0.03em] text-[#fff8ed] sm:mt-7 sm:text-[2.8rem] md:text-6xl lg:mt-8 lg:text-[5.4rem]"
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

              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#e4d8c8] sm:mt-6 sm:text-base sm:leading-7 md:text-lg md:leading-8">
                Atendimento online para quem busca
                transformação emocional, mais equilíbrio
                e uma abordagem direcionada às suas
                necessidades.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#74866c] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(25,31,22,0.25)] transition hover:-translate-y-1 hover:bg-[#899b81] sm:px-8 sm:py-4 sm:text-base"
                >
                  Iniciar sessão online
                  <ArrowRight size={18} />
                </a>

                <a
                  href="#sobre"
                  className="inline-flex items-center justify-center rounded-full border border-[#c7ac8b] bg-white/5 px-6 py-3.5 text-sm font-bold text-[#f5eadb] transition hover:bg-white/10 sm:px-8 sm:py-4 sm:text-base"
                >
                  Conhecer o atendimento
                </a>
              </div>

              <div className="mt-6 flex flex-col gap-3 text-xs font-semibold text-[#eee3d4] sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3 sm:text-sm">
                <span className="flex items-center gap-2">
                  <Video
                    size={16}
                    className="text-[#aebfa4]"
                  />
                  Atendimento 100% online
                </span>

                <span className="flex items-center gap-2">
                  <LockKeyhole
                    size={16}
                    className="text-[#aebfa4]"
                  />
                  Privacidade e segurança
                </span>

                <span className="flex items-center gap-2">
                  <Wifi
                    size={16}
                    className="text-[#aebfa4]"
                  />
                  De onde você estiver
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SOBRE */}
        <section
          id="sobre"
          className="relative overflow-hidden bg-[#f8f3e9]"
        >
          <div className="absolute -right-40 top-10 h-80 w-80 rounded-full bg-[#cbd6c4]/30 blur-3xl sm:h-96 sm:w-96" />

          <div className="relative mx-auto grid max-w-[1400px] gap-8 px-5 py-14 sm:gap-10 sm:px-6 sm:py-16 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:px-8 lg:py-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8e7157] sm:text-sm sm:tracking-[0.22em]">
                Sobre o atendimento
              </p>

              <h2
                className="mt-4 text-3xl font-semibold leading-tight text-[#382f27] sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Uma abordagem focada em resultados breves.
              </h2>
            </div>

            <div className="rounded-[2rem] border border-white bg-white/45 p-6 shadow-[0_20px_55px_rgba(61,49,35,0.07)] backdrop-blur-sm sm:rounded-[2.5rem] sm:p-8 md:p-10 lg:p-12">
              <Leaf
                size={26}
                className="text-[#6c7c65]"
              />

              <p className="mt-5 text-[15px] leading-7 text-[#716253] sm:mt-6 sm:text-base sm:leading-8">
                O atendimento é realizado de forma online com prévio agendamento.
              </p>

              <p className="mt-5 text-[15px] leading-7 text-[#716253] sm:mt-6 sm:text-base sm:leading-8">
                Abordagem TRG: É uma Terapia de Reprocessamento Generativo, uma abordagem terapêutica breve que visa encontrar e reprocessar a raiz de traumas, dores emocionais e problemas psicossomáticos.
              </p>

              <p className="mt-5 text-[15px] leading-7 text-[#716253] sm:mt-6 sm:text-base sm:leading-8">
                Foco em resultados: É uma metodologia com começo, meio e fim, estruturada para resolver questões emocionais em um número reduzido de sessões.
              </p>

              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#3a3329] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#6c7c65] sm:mt-8 sm:px-7 sm:py-4 sm:text-base"
              >
                Falar com Elisângela
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>

        {/* ATENDIMENTO */}
        <section
          id="atendimento"
          className="bg-[#ede3d5]"
        >
          <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d7158] sm:text-sm sm:tracking-[0.22em]">
                Atendimento terapêutico
              </p>

              <h2
                className="mt-4 text-3xl font-semibold leading-tight sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Cuidado emocional com direção e propósito.
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-[#756657] sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
                Atendimento individual, online e direcionado às necessidades de cada pessoa.
              </p>
            </div>

            <div className="mt-9 grid gap-4 sm:mt-12 md:grid-cols-3 md:gap-6">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article
                    key={benefit.title}
                    className="group rounded-[1.7rem] border border-white/90 bg-[#fffdf8] p-6 shadow-[0_18px_45px_rgba(62,49,35,0.07)] transition hover:-translate-y-2 hover:border-[#9daf99] sm:rounded-[2rem] sm:p-8"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#dde5d8] text-[#53634e] transition group-hover:bg-[#6c7c65] group-hover:text-white sm:h-14 sm:w-14">
                      <Icon size={22} />
                    </span>

                    <h3
                      className="mt-5 text-2xl font-semibold sm:mt-7 sm:text-3xl"
                      style={{
                        fontFamily:
                          '"Cormorant Garamond", serif',
                      }}
                    >
                      {benefit.title}
                    </h3>

                    <p className="mt-3 text-[15px] leading-7 text-[#7a6b5c] sm:mt-4 sm:text-base sm:leading-8">
                      {benefit.text}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 grid overflow-hidden rounded-[2.2rem] bg-[#3a3329] shadow-[0_25px_65px_rgba(51,42,32,0.16)] sm:mt-14 sm:rounded-[2.8rem] lg:grid-cols-2">
              <div className="p-6 text-white sm:p-9 md:p-12 lg:p-14">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#cbb494] sm:text-sm sm:tracking-[0.22em]">
                  Cuidado individual
                </p>

                <h3
                  className="mt-4 text-3xl font-semibold sm:mt-5 sm:text-4xl md:text-5xl"
                  style={{
                    fontFamily:
                      '"Cormorant Garamond", serif',
                  }}
                >
                  Quando as emoções começam a afetar sua rotina.
                </h3>

                <p className="mt-5 text-[15px] leading-7 text-[#ded3c4] sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
                  Buscar ajuda pode ser um passo importante para compreender e transformar questões emocionais que continuam interferindo na sua vida.
                </p>

                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#dfe7d9] px-6 py-3.5 text-sm font-bold text-[#394533] transition hover:bg-white sm:mt-9 sm:px-7 sm:py-4 sm:text-base"
                >
                  Conversar pelo WhatsApp
                  <MessageCircle size={17} />
                </a>
              </div>

              <div className="bg-[#6c7c65] p-6 text-white sm:p-9 md:p-12 lg:p-14">
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#e0eadb] sm:mb-7 sm:text-sm sm:tracking-[0.22em]">
                  Como posso ajudar:
                </p>

                <ul className="grid gap-3 sm:gap-5">
                  {specialties.map((specialty) => (
                    <li
                      key={specialty}
                      className="flex items-center gap-3 border-b border-white/20 pb-3 text-[15px] sm:pb-4 sm:text-base md:text-lg"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/15 sm:h-7 sm:w-7">
                        <Check size={14} />
                      </span>

                      {specialty}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ATENDIMENTO ONLINE */}
        <section className="bg-[#f8f3e9]">
          <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-5 py-14 sm:gap-10 sm:px-6 sm:py-16 md:py-20 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-24">
            <div className="rounded-[2.2rem] bg-[#dfe7d9] p-7 sm:rounded-[3rem] sm:p-10 md:p-14">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-[#6c7c65] text-white sm:h-16 sm:w-16">
                <Video size={25} />
              </span>

              <h2
                className="mt-6 text-3xl font-semibold leading-tight sm:mt-8 sm:text-4xl md:text-5xl lg:text-6xl"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Atendimento de onde você estiver.
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-[#65705f] sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
                Tenha acesso ao atendimento terapêutico sem precisar se deslocar, utilizando um ambiente reservado e uma conexão com a internet.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-5">
              <div className="flex gap-4 rounded-[1.7rem] border border-[#e2d6c7] bg-white/60 p-5 sm:gap-5 sm:rounded-[2rem] sm:p-7">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eee3d4] text-[#795f48] sm:h-12 sm:w-12">
                  <Wifi size={21} />
                </span>

                <div>
                  <h3
                    className="text-xl font-semibold sm:text-2xl"
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", serif',
                    }}
                  >
                    Comodidade
                  </h3>

                  <p className="mt-1.5 text-[15px] leading-6 text-[#796a5b] sm:mt-2 sm:leading-7">
                    Atendimento online realizado no local em que você se sentir mais confortável.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-[1.7rem] border border-[#e2d6c7] bg-white/60 p-5 sm:gap-5 sm:rounded-[2rem] sm:p-7">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#dfe7d9] text-[#586851] sm:h-12 sm:w-12">
                  <ShieldCheck size={21} />
                </span>

                <div>
                  <h3
                    className="text-xl font-semibold sm:text-2xl"
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", serif',
                    }}
                  >
                    Privacidade
                  </h3>

                  <p className="mt-1.5 text-[15px] leading-6 text-[#796a5b] sm:mt-2 sm:leading-7">
                    Um atendimento individual conduzido com segurança e confidencialidade.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-[1.7rem] border border-[#e2d6c7] bg-white/60 p-5 sm:gap-5 sm:rounded-[2rem] sm:p-7">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eee3d4] text-[#795f48] sm:h-12 sm:w-12">
                  <Leaf size={21} />
                </span>

                <div>
                  <h3
                    className="text-xl font-semibold sm:text-2xl"
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", serif',
                    }}
                  >
                    Flexibilidade
                  </h3>

                  <p className="mt-1.5 text-[15px] leading-6 text-[#796a5b] sm:mt-2 sm:leading-7">
                    Mais facilidade para incluir o cuidado emocional na sua rotina.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DÚVIDAS */}
        <section
          id="duvidas"
          className="border-y border-[#ded1c1] bg-[#eee4d6]"
        >
          <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-14 sm:gap-10 sm:px-6 sm:py-16 md:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12 lg:px-8 lg:py-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d7158] sm:text-sm sm:tracking-[0.22em]">
                Dúvidas frequentes
              </p>

              <h2
                className="mt-4 text-3xl font-semibold leading-tight sm:mt-5 sm:text-4xl md:text-5xl"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Informações para você se sentir mais segura.
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-[#79695a] sm:mt-6 sm:text-base sm:leading-8">
                Para outras informações, converse diretamente com a Elisângela pelo WhatsApp.
              </p>
            </div>

            <div className="divide-y divide-[#d5c6b4] border-y border-[#d5c6b4]">
              {questions.map((question, index) => {
                const open =
                  openQuestion === index;

                return (
                  <article
                    key={question.title}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenQuestion(
                          open ? null : index,
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 py-4 text-left sm:gap-5 sm:py-6"
                    >
                      <span
                        className="text-lg font-semibold sm:text-xl md:text-2xl"
                        style={{
                          fontFamily:
                            '"Cormorant Garamond", serif',
                        }}
                      >
                        {question.title}
                      </span>

                      <ChevronDown
                        size={20}
                        className={`shrink-0 transition sm:h-[22px] sm:w-[22px] ${
                          open
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>

                    {open && (
                      <p className="max-w-3xl pb-5 text-[15px] leading-7 text-[#79695a] sm:pb-7 sm:text-base sm:leading-8">
                        {question.text}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* BLOG */}
        <section
          id="blog"
          className="bg-[#dfe7d9]"
        >
          <div className="mx-auto max-w-[1400px] px-5 py-14 text-center sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#63715d] sm:text-sm sm:tracking-[0.22em]">
              Conteúdo e informação
            </p>

            <h2
              className="mt-4 text-3xl font-semibold sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl"
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              Conheça o blog da Elisângela
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#63705e] sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
              Conteúdos sobre terapia emocional, transformação e cuidado individual.
            </p>

            <Link
              to="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#3a3329] px-6 py-3.5 text-sm font-bold text-white sm:mt-8 sm:px-8 sm:py-4 sm:text-base"
            >
              Ver publicações
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#f8f3e9] px-5 py-12 sm:py-16 md:py-20">
          <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[2.2rem] bg-[#3a3329] px-6 py-12 text-center text-white shadow-[0_25px_65px_rgba(55,43,31,0.18)] sm:rounded-[3rem] sm:px-8 sm:py-14 md:px-14 md:py-16">
            <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#718069]/30 blur-2xl sm:h-52 sm:w-52" />

            <div className="absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-[#a67f5d]/20 blur-2xl sm:h-64 sm:w-64" />

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#cbb894] sm:text-sm sm:tracking-[0.22em]">
                Atendimento online
              </p>

              <h2
                className="mx-auto mt-4 max-w-4xl text-3xl font-semibold leading-tight sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Comece seu processo de transformação emocional.
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#ddd3c4] sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
                Entre em contato para receber informações sobre o atendimento, disponibilidade e valores.
              </p>

              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#dfe7d9] px-6 py-3.5 text-sm font-bold text-[#35402f] transition hover:-translate-y-1 hover:bg-white sm:mt-9 sm:px-8 sm:py-4 sm:text-base"
              >
                <MessageCircle size={18} />
                Falar pelo WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* WHATSAPP */}
      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Conversar pelo WhatsApp"
        className="fixed bottom-4 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#5d7656] text-white shadow-[0_12px_28px_rgba(53,81,48,0.3)] transition hover:scale-110 hover:bg-[#496344] sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
      >
        <MessageCircle
          size={25}
          className="sm:h-7 sm:w-7"
        />
      </a>

      {/* FOOTER */}
      <footer className="border-t border-[#d9ccbb] bg-[#eee4d6]">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 sm:gap-10 sm:px-6 sm:py-12 md:grid-cols-3 lg:px-8">
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

            <div className="mt-3 grid gap-2 text-sm text-[#716153] sm:mt-4 sm:text-base">
              <a href="#inicio">
                Início
              </a>

              <a href="#sobre">
                Sobre
              </a>

              <a href="#atendimento">
                Atendimento
              </a>

              <a href="#duvidas">
                Dúvidas
              </a>

              <Link to="/blog">
                Blog
              </Link>
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

            <p className="mt-3 text-sm leading-6 text-[#716153] sm:mt-4 sm:text-base sm:leading-7">
              Entre em contato para receber mais informações.
            </p>

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#566750] sm:mt-4 sm:text-base"
            >
              <MessageCircle size={17} />
              Conversar pelo WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-[#d9ccbb] px-5 py-5">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 text-center text-xs text-[#7f6e5e] sm:flex-row sm:text-sm">
            <p>
              © {new Date().getFullYear()} Elisângela
              Fernandes
            </p>

            <Link
              to="/acesso-terapeuta"
              className="inline-flex items-center gap-2 opacity-65 transition hover:opacity-100"
            >
              <LockKeyhole size={13} />
              Área da terapeuta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}