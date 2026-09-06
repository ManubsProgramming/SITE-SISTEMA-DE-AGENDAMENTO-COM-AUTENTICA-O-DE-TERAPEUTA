import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import QuestionField from "../components/QuestionField";
import { apiRequest } from "../services/api";
import type {
  AccessData,
  FormAnswers,
  FormSchema,
  Question,

} from "../types/anamnesis";

type ResponseValue = string | string[];

type Step = {
  title: string;
  description: string;
  type:
    | "identification"
    | "questions"
    | "feelings"
    | "review";
  questions?: Question[];
};

const emptyAnswers: FormAnswers = {
  identification: {},
  responses: {},
  feelings_map: {},
  additional_notes: "",
  consent: {
    privacy_accepted: false,
    truthfulness_accepted: false,
    version: "1.0",
  },
};

function getStoredAccess(): AccessData | null {
  const stored = sessionStorage.getItem(
    "anamnesis_access",
  );

  if (!stored) return null;

  try {
    return JSON.parse(stored) as AccessData;
  } catch {
    return null;
  }
}

function getDraft(): FormAnswers {
  const stored = sessionStorage.getItem(
    "anamnesis_draft",
  );

  if (!stored) {
    return emptyAnswers;
  }

  try {
    const parsed = JSON.parse(
      stored,
    ) as Partial<FormAnswers>;

    return {
      ...emptyAnswers,
      ...parsed,
      identification: {
        ...emptyAnswers.identification,
        ...parsed.identification,
      },
      responses: {
        ...emptyAnswers.responses,
        ...parsed.responses,
      },
      feelings_map: {
        ...emptyAnswers.feelings_map,
        ...parsed.feelings_map,
      },
      consent: {
        ...emptyAnswers.consent,
        ...parsed.consent,
      },
    };
  } catch {
    return emptyAnswers;
  }
}

function hasAnswer(value: ResponseValue) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value.trim().length > 0;
}

export default function AnamnesisPage() {
  const formRef =
    useRef<HTMLFormElement>(null);

  const preview =
    import.meta.env.DEV &&
    new URLSearchParams(
      window.location.search,
    ).get("preview") === "1";

  const [access] =
    useState<AccessData | null>(
      getStoredAccess,
    );

  const [schema, setSchema] =
    useState<FormSchema | null>(null);

  const [answers, setAnswers] =
    useState<FormAnswers>(getDraft);

  const [stepIndex, setStepIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    apiRequest<FormSchema>(
      "/anamnesis/schema/",
    )
      .then(setSchema)
      .catch((requestError: Error) => {
        setError(requestError.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      "anamnesis_draft",
      JSON.stringify(answers),
    );
  }, [answers]);

  const steps = useMemo<Step[]>(() => {
  if (!schema) return [];

  const questions =
    schema.questions;

  function questionsFrom(
    ...sections: string[]
  ) {
    return questions.filter(
      (question) =>
        !question.hidden &&
        sections.some((section) =>
          question.section.includes(
            section,
          ),
        ),
    );
  }

    return [
      {
        title: "Identificação",
        description:
          "Primeiro, conte-nos quem é você.",
        type: "identification",
      },
      {
        title: "Vida pessoal",
        description:
          "Fale sobre seu momento, relações e rotina.",
        type: "questions",
        questions: questionsFrom(
          "Queixa principal",
          "Vida Pessoal",
        ),
      },
      {
        title: "Mental",
        description:
          "Um olhar sobre seus pensamentos e percepções.",
        type: "questions",
        questions: questionsFrom(
          "Mental",
        ),
      },
      {
        title: "Infância",
        description:
          "Responda somente o que se sentir confortável.",
        type: "questions",
        questions: questionsFrom(
          "Infância",
        ),
      },
      {
        title: "Emocional",
        description:
          "Fale sobre sentimentos, medos e escolhas.",
        type: "questions",
        questions: questionsFrom(
          "Emocional",
        ),
      },
      {
        title: "Sentimentos",
        description:
          "Indique a intensidade do que sente atualmente.",
        type: "feelings",
      },
      {
        title: "Revisão",
        description:
          "Confira e confirme antes do envio definitivo.",
        type: "review",
      },
    ];
  }, [schema]);

  function shouldShow(
    question: Question,
  ) {
    if (!question.show_when) {
      return true;
    }

    const dependency =
      answers.responses[
        question.show_when.question_id
      ];

    if (!dependency) {
      return false;
    }

    const values = Array.isArray(
      dependency,
    )
      ? dependency
      : [dependency];

    if (
      question.show_when.operator ===
      "equals"
    ) {
      return values.includes(
        question.show_when.value,
      );
    }

    return values.some((value) =>
      value
        .toLowerCase()
        .includes(
          question.show_when!.value.toLowerCase(),
        ),
    );
  }

  function updateIdentification(
    fieldId: string,
    value: string,
  ) {
    setAnswers((current) => ({
      ...current,
      identification: {
        ...current.identification,
        [fieldId]: value,
      },
    }));
  }

  function updateResponse(
    questionId: string,
    value: ResponseValue,
  ) {
    setAnswers((current) => ({
      ...current,
      responses: {
        ...current.responses,
        [questionId]: value,
      },
    }));
  }

  function updateFeeling(
    feelingId: string,
    value: string,
  ) {
    setAnswers((current) => ({
      ...current,
      feelings_map: {
        ...current.feelings_map,
        [feelingId]: value,
      },
    }));
  }

  function goToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function nextStep() {
    if (
      !formRef.current?.reportValidity()
    ) {
      return;
    }

    setStepIndex((current) =>
      Math.min(
        current + 1,
        steps.length - 1,
      ),
    );

    goToTop();
  }

  function previousStep() {
    setStepIndex((current) =>
      Math.max(
        current - 1,
        0,
      ),
    );

    goToTop();
  }

  async function submitForm(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    if (
      !answers.consent
        .privacy_accepted ||
      !answers.consent
        .truthfulness_accepted
    ) {
      setError(
        "Aceite os dois termos para enviar a anamnese.",
      );
      return;
    }

    if (preview) {
      setSuccess(true);
      return;
    }

    if (!access) {
      setError(
        "O acesso à anamnese não está disponível.",
      );
      return;
    }

    setSubmitting(true);

    try {
      await apiRequest(
        "/anamnesis/submit/",
        {
          method: "POST",
          body: JSON.stringify({
            payment_id:
              access.paymentId,
            access_token:
              access.access_token,
            form_version:
              schema?.version ||
              "1.0",
            answers,
          }),
        },
      );

      sessionStorage.removeItem(
        "anamnesis_access",
      );
      sessionStorage.removeItem(
        "anamnesis_draft",
      );

      setSuccess(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível enviar a anamnese.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!preview && !access) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5eee2] p-5">
        <section className="max-w-md rounded-[2rem] border border-white bg-white/60 p-9 text-center shadow-xl">
          <LockKeyhole
            className="mx-auto text-[#443b31]"
            size={35}
          />

          <h1 className="mt-5 font-serif text-3xl">
            Formulário protegido
          </h1>

          <p className="mt-4 leading-7 text-[#7e7062]">
            A anamnese é liberada após a
            confirmação do pagamento.
          </p>

          <Link
            to="/pagamento"
            className="mt-7 inline-flex rounded-full bg-[#373128] px-7 py-3.5 font-semibold text-white"
          >
            Ir para o pagamento
          </Link>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5eee2]">
        <LoaderCircle
          className="animate-spin text-[#443b31]"
          size={34}
        />
      </main>
    );
  }

  if (!schema || !steps.length) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5eee2] p-5">
        <p className="rounded-2xl bg-red-50 p-5 text-red-700">
          {error ||
            "Não foi possível carregar o formulário."}
        </p>
      </main>
    );
  }

  if (success) {
    return (
      <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_15%_15%,#fffefa_0%,#f2e8d7_55%,#e4e9df_100%)] p-5">
        <section className="max-w-lg rounded-[2.5rem] border border-white bg-white/50 p-10 text-center shadow-xl backdrop-blur-xl">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#dfe7d8] text-[#41523b]">
            <Check size={30} />
          </span>

          <h1 className="mt-6 font-serif text-4xl">
            Anamnese enviada
          </h1>

          <p className="mt-4 leading-7 text-[#7e7062]">
            Suas respostas foram recebidas com
            sucesso. Uma cópia será enviada por
            e-mail.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-[#373128] px-7 py-3.5 font-semibold text-white"
          >
            Voltar ao início
          </Link>
        </section>
      </main>
    );
  }

  const currentStep =
    steps[stepIndex];

  const progress =
    ((stepIndex + 1) /
      steps.length) *
    100;

  const answeredCount =
    Object.values(
      answers.responses,
    ).filter(hasAnswer).length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_15%,#fffefa_0%,#f2e8d7_52%,#e4e9df_100%)] px-4 py-7 text-[#393229]">
      <header className="mx-auto flex max-w-5xl items-center justify-between rounded-[1.7rem] border border-white bg-white/45 px-5 py-4 shadow-lg backdrop-blur-xl md:px-8">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#373128] font-serif text-lg text-white">
            EF
          </span>

          <div>
            <p className="font-serif text-lg font-semibold">
              Elisângela Fernandes
            </p>

            <p className="text-sm text-[#9a826d]">
              Terapeuta Emocional
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#ece7dc] px-4 py-2 text-sm">
          Anamnese
        </span>
      </header>

      <main className="mx-auto max-w-5xl pb-20">
        <section className="mx-auto max-w-3xl py-14 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-[#9c826b]">
            Etapa {stepIndex + 1} de{" "}
            {steps.length}
          </p>

          <h1 className="mt-4 font-serif text-5xl">
            {currentStep.title}
          </h1>

          <p className="mt-4 text-lg text-[#8a7969]">
            {currentStep.description}
          </p>

          <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/70">
            <div
              className="h-full rounded-full bg-[#373128] transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </section>

        <form
          ref={formRef}
          onSubmit={submitForm}
          className="rounded-[2.6rem] border border-white bg-white/35 p-6 shadow-xl backdrop-blur-xl md:p-12"
        >
          {currentStep.type ===
            "identification" && (
            <div className="grid gap-7 md:grid-cols-2">
              {schema.identification.map(
                (field) => (
                  <div
                    key={field.id}
                    className={
                      field.type ===
                      "radio"
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <QuestionField
                      field={field}
                      value={
                        answers
                          .identification[
                          field.id
                        ] || ""
                      }
                      onChange={(value) =>
                        updateIdentification(
                          field.id,
                          typeof value ===
                            "string"
                            ? value
                            : "",
                        )
                      }
                    />
                  </div>
                ),
              )}
            </div>
          )}

          {currentStep.type ===
            "questions" && (
            <div className="space-y-10">
              {currentStep.questions
                ?.filter(shouldShow)
                .map((question) => (
                  <QuestionField
                    key={question.id}
                    field={question}
                    showNumber
                    value={
                      answers.responses[
                        question.id
                      ] || ""
                    }
                    onChange={(value) =>
                      updateResponse(
                        question.id,
                        value,
                      )
                    }
                  />
                ))}
            </div>
          )}

          {currentStep.type ===
            "feelings" && (
            <div className="grid gap-5 md:grid-cols-2">
              {schema.feelings_map.feelings.map(
                (feeling) => (
                  <label
                    key={feeling.id}
                    className="rounded-2xl border border-white bg-white/40 p-4 text-[#716458]"
                  >
                    {feeling.label}

                    <select
                      value={
                        answers
                          .feelings_map[
                          feeling.id
                        ] || ""
                      }
                      onChange={(event) =>
                        updateFeeling(
                          feeling.id,
                          event.target
                            .value,
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-white bg-white/70 px-4 py-3 outline-none"
                    >
                      <option value="">
                        Não informado
                      </option>

                      {schema.feelings_map.options.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                ),
              )}

              <label className="text-[#716458] md:col-span-2">
                Observações adicionais

                <textarea
                  rows={5}
                  value={
                    answers.additional_notes
                  }
                  onChange={(event) =>
                    setAnswers(
                      (current) => ({
                        ...current,
                        additional_notes:
                          event.target
                            .value,
                      }),
                    )
                  }
                  className="mt-2 w-full rounded-2xl border border-white bg-white/65 px-5 py-4 outline-none"
                  placeholder="Escreva se desejar..."
                />
              </label>
            </div>
          )}

          {currentStep.type ===
            "review" && (
            <div>
              <FileText
                className="text-[#716253]"
                size={30}
              />

              <h2 className="mt-5 font-serif text-3xl">
                Revise antes de enviar
              </h2>

              <p className="mt-3 text-[#7e7062]">
                {answeredCount} perguntas
                respondidas. Você pode voltar
                para alterar qualquer resposta.
              </p>

              <div className="mt-8 space-y-4">
                <label className="flex gap-3 rounded-2xl bg-white/45 p-5">
                  <input
                    required
                    type="checkbox"
                    checked={
                      answers.consent
                        .privacy_accepted
                    }
                    onChange={(event) =>
                      setAnswers(
                        (current) => ({
                          ...current,
                          consent: {
                            ...current.consent,
                            privacy_accepted:
                              event.target
                                .checked,
                          },
                        }),
                      )
                    }
                  />

                  <span>
                    Autorizo o tratamento das
                    informações para a preparação
                    e realização do atendimento.
                  </span>
                </label>

                <label className="flex gap-3 rounded-2xl bg-white/45 p-5">
                  <input
                    required
                    type="checkbox"
                    checked={
                      answers.consent
                        .truthfulness_accepted
                    }
                    onChange={(event) =>
                      setAnswers(
                        (current) => ({
                          ...current,
                          consent: {
                            ...current.consent,
                            truthfulness_accepted:
                              event.target
                                .checked,
                          },
                        }),
                      )
                    }
                  />

                  <span>
                    Confirmo que respondi de forma
                    livre e de acordo com o que
                    desejo compartilhar.
                  </span>
                </label>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-7 rounded-2xl bg-red-50 p-4 text-red-700">
              {error}
            </p>
          )}

          <div className="mt-12 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              disabled={
                stepIndex === 0
              }
              onClick={previousStep}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7d6c5b] px-7 py-3.5 disabled:opacity-30"
            >
              <ArrowLeft size={18} />
              Anterior
            </button>

            {stepIndex <
            steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#373128] px-8 py-3.5 font-semibold text-white"
              >
                Continuar
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#373128] px-8 py-3.5 font-semibold text-white disabled:opacity-60"
              >
                {submitting && (
                  <LoaderCircle
                    className="animate-spin"
                    size={18}
                  />
                )}

                Enviar anamnese
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}