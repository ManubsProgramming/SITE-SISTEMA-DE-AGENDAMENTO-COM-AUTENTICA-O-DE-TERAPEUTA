import type {
  IdentificationField,
  Question,
} from "../types/anamnesis";

type Field = IdentificationField | Question;
type FieldValue = string | string[];

type QuestionFieldProps = {
  field: Field;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  showNumber?: boolean;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-white bg-white/65 px-5 py-4 text-[#453d34] outline-none transition placeholder:text-[#b1a598] focus:border-[#8d7b64] focus:ring-2 focus:ring-[#8d7b64]/15";

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string) {
  return onlyNumbers(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCep(value: string) {
  return onlyNumbers(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatPhone(value: string) {
  const digits = onlyNumbers(value).slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatFieldValue(
  fieldId: string,
  value: string,
) {
  if (fieldId === "cpf") {
    return formatCpf(value);
  }

  if (fieldId === "postal_code") {
    return formatCep(value);
  }

  if (
    fieldId === "phone" ||
    fieldId === "mobile_phone"
  ) {
    return formatPhone(value);
  }

  return value;
}

function getStringValue(value: FieldValue) {
  return typeof value === "string"
    ? value
    : "";
}

function fieldLabel(
  field: Field,
  showNumber: boolean,
) {
  if (showNumber && "number" in field) {
    return `${field.number}. ${field.question}`;
  }

  if ("label" in field) {
    return field.label;
  }

  return field.question;
}

function fieldPlaceholder(field: Field) {
  const placeholders: Record<string, string> = {
    name: "Digite seu nome completo",
    birth_date: "Selecione a data",
    rg: "Digite seu RG",
    cpf: "000.000.000-00",
    address: "Rua, avenida e número",
    postal_code: "00000-000",
    city_state: "Bairro, cidade e estado",
    address_extra: "Apartamento ou complemento",
    phone: "(00) 0000-0000",
    mobile_phone: "(00) 00000-0000",
    email: "voce@email.com",
    religion: "Informe se desejar",
    occupation: "Sua profissão ou atividade",
    company_role: "Empresa e cargo",
  };

  return (
    placeholders[field.id] ||
    "Digite sua resposta"
  );
}

function isNumericField(fieldId: string) {
  return [
    "cpf",
    "postal_code",
    "phone",
    "mobile_phone",
  ].includes(fieldId);
}

export default function QuestionField({
  field,
  value,
  onChange,
  showNumber = false,
}: QuestionFieldProps) {
  const label = fieldLabel(
    field,
    showNumber,
  );

  const options =
    "options" in field
      ? field.options
      : undefined;

  if (field.type === "heading") {
    return (
      <div className="rounded-2xl border border-white bg-white/35 px-5 py-4">
        <h3 className="font-serif text-2xl text-[#4c4238]">
          {label}
        </h3>

        <p className="mt-1 text-sm text-[#92806f]">
          Responda separadamente sobre cada um abaixo.
        </p>
      </div>
    );
  }

  if (
    field.type === "checkbox" &&
    options
  ) {
    const selected = Array.isArray(value)
      ? value
      : [];

    function toggleOption(option: string) {
      if (selected.includes(option)) {
        onChange(
          selected.filter(
            (item) => item !== option,
          ),
        );
        return;
      }

      onChange([
        ...selected,
        option,
      ]);
    }

    return (
      <fieldset>
        <legend className="text-base leading-7 text-[#786b5e]">
          {label}

          {field.required && (
            <span className="ml-1 text-[#9f5f56]">
              *
            </span>
          )}
        </legend>

        <p className="mt-1 text-sm text-[#9a8978]">
          Você pode marcar mais de uma opção.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {options.map((option) => {
            const active =
              selected.includes(option);

            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  toggleOption(option)
                }
                className={`rounded-full border px-5 py-2.5 transition ${
                  active
                    ? "border-[#373128] bg-[#373128] text-white"
                    : "border-white bg-white/60 text-[#77695b] hover:border-[#a7957f]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (
    "label" in field &&
    field.type === "radio" &&
    options
  ) {
    return (
      <label className="block text-base leading-7 text-[#786b5e]">
        {label}

        {field.required && (
          <span className="ml-1 text-[#9f5f56]">
            *
          </span>
        )}

        <select
          required={field.required}
          value={getStringValue(value)}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={inputClass}
        >
          <option value="">
            Selecione uma opção
          </option>

          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (
    field.type === "radio" &&
    options
  ) {
    const selected =
      getStringValue(value);

    return (
      <fieldset>
        <legend className="text-base leading-7 text-[#786b5e]">
          {label}

          {field.required && (
            <span className="ml-1 text-[#9f5f56]">
              *
            </span>
          )}
        </legend>

        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((option) => {
            const active =
              selected === option;

            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange(option)
                }
                className={`rounded-full border px-5 py-2.5 transition ${
                  active
                    ? "border-[#373128] bg-[#373128] text-white"
                    : "border-white bg-white/60 text-[#77695b] hover:border-[#a7957f]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="block text-base leading-7 text-[#786b5e]">
        {label}

        {field.required && (
          <span className="ml-1 text-[#9f5f56]">
            *
          </span>
        )}

        <textarea
          required={field.required}
          rows={4}
          value={getStringValue(value)}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={inputClass}
          placeholder="Escreva no seu ritmo..."
        />
      </label>
    );
  }

  const htmlType =
    field.type === "number"
      ? "number"
      : field.type === "date"
        ? "date"
        : field.type === "email"
          ? "email"
          : field.type === "tel"
            ? "tel"
            : "text";

  return (
    <label className="block text-base leading-7 text-[#786b5e]">
      {label}

      {field.required && (
        <span className="ml-1 text-[#9f5f56]">
          *
        </span>
      )}

      <input
        required={field.required}
        type={htmlType}
        value={getStringValue(value)}
        inputMode={
          isNumericField(field.id)
            ? "numeric"
            : undefined
        }
        onChange={(event) =>
          onChange(
            formatFieldValue(
              field.id,
              event.target.value,
            ),
          )
        }
        className={inputClass}
        placeholder={fieldPlaceholder(field)}
      />
    </label>
  );
}