const API_URL =
  import.meta.env.VITE_API_URL;

function getErrorMessage(
  data: unknown,
): string {
  if (
    typeof data === "object" &&
    data !== null
  ) {
    const record =
      data as Record<string, unknown>;

    if (
      typeof record.detail ===
      "string"
    ) {
      return record.detail;
    }

    const messages = Object.entries(
      record,
    ).flatMap(([field, value]) => {
      if (Array.isArray(value)) {
        return value.map(
          (message) =>
            `${field}: ${String(message)}`,
        );
      }

      if (
        typeof value === "object" &&
        value !== null
      ) {
        return [
          `${field}: ${JSON.stringify(
            value,
          )}`,
        ];
      }

      return [
        `${field}: ${String(value)}`,
      ];
    });

    if (messages.length) {
      return messages.join(" ");
    }
  }

  return "Não foi possível concluir a solicitação.";
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers: {
        "Content-Type":
          "application/json",
        ...options.headers,
      },
    },
  );

  const data: unknown =
    await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data),
    );
  }

  return data as T;
}