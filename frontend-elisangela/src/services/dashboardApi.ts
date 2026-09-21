const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:8000/api";

export type Therapist = {
  username: string;
  name: string;
  email: string;
};

type AuthResponse = {
  authenticated: boolean;
  user: Therapist;
};

export type DashboardSummary = {
  summary: {
    customers: number;
    anamneses: number;
    active_invitations: number;
  };
  recent_anamneses: Array<{
    id: string;
    customer: {
      id: string;
      name: string;
      cpf: string;
      email: string;
      phone: string;
    };
    form_version: string;
    submitted_at: string;
  }>;
};

export type DashboardCustomer = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  anamnesis_count: number;
  created_at: string;
};

export type CustomerAnamnesisItem = {
  id: string;
  payment_id: string | null;
  invitation_id: string | null;
  form_version: string;
  submitted_at: string;
};

export type CustomerAnamneses = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  anamnesis_count: number;
  last_submitted_at: string;
  anamneses: CustomerAnamnesisItem[];
};

export type DashboardAnamnesisDetail = {
  id: string;
  payment_id: string | null;
  invitation_id: string | null;
  form_version: string;
  submitted_at: string;
  answers: Record<string, unknown>;
  customer: {
    id: string;
    name: string;
    cpf: string;
    email: string;
    phone: string;
  };
  payment: {
    value: string;
    status: string;
    paid_at: string | null;
  } | null;
};

export type AnamnesisInvitation = {
  invitation_id: string;
  expires_at: string;
  form_url: string;
};

/*
 * Tipos antigos mantidos temporariamente para que
 * DashboardPaymentsPage não quebre durante o build.
 * A página de pagamentos será removida na próxima etapa.
 */


let csrfToken = "";

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    },
  );

  const contentType =
    response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `O servidor respondeu ${response.status} em ${response.url}.`,
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ??
        "Não foi possível concluir a solicitação.",
    );
  }

  return data as T;
}

export async function prepareCsrf(): Promise<string> {
  const data = await request<{
    csrfToken: string;
  }>("/dashboard/csrf/");

  csrfToken = data.csrfToken;

  return csrfToken;
}

export async function therapistLogin(
  username: string,
  password: string,
): Promise<AuthResponse> {
  if (!csrfToken) {
    await prepareCsrf();
  }

  return request<AuthResponse>(
    "/dashboard/login/",
    {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        username,
        password,
      }),
    },
  );
}

export async function therapistLogout(): Promise<void> {
  if (!csrfToken) {
    await prepareCsrf();
  }

  await request<{
    authenticated: boolean;
  }>("/dashboard/logout/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
}

export async function getCurrentTherapist(): Promise<AuthResponse> {
  return request<AuthResponse>(
    "/dashboard/me/",
  );
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>(
    "/dashboard/summary/",
  );
}

export async function getDashboardCustomers(
  search = "",
): Promise<DashboardCustomer[]> {
  const parameters = new URLSearchParams();

  if (search.trim()) {
    parameters.set(
      "search",
      search.trim(),
    );
  }

  const query = parameters.toString();

  const path = query
    ? `/dashboard/customers/?${query}`
    : "/dashboard/customers/";

  const data = await request<{
    customers: DashboardCustomer[];
  }>(path);

  return data.customers;
}

export async function getDashboardAnamneses(
  search = "",
): Promise<CustomerAnamneses[]> {
  const parameters = new URLSearchParams();

  if (search.trim()) {
    parameters.set(
      "search",
      search.trim(),
    );
  }

  const query = parameters.toString();

  const path = query
    ? `/dashboard/anamneses/?${query}`
    : "/dashboard/anamneses/";

  const data = await request<{
    customers: CustomerAnamneses[];
  }>(path);

  return data.customers;
}

export async function getDashboardAnamnesisDetail(
  anamnesisId: string,
): Promise<DashboardAnamnesisDetail> {
  return request<DashboardAnamnesisDetail>(
    `/dashboard/anamneses/${anamnesisId}/`,
  );
}

export async function createAnamnesisInvitation(): Promise<AnamnesisInvitation> {
  if (!csrfToken) {
    await prepareCsrf();
  }

  return request<AnamnesisInvitation>(
    "/dashboard/anamnesis-invitations/",
    {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({}),
    },
  );
}

export async function downloadDashboardAnamnesisPdf(
  anamnesisId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/dashboard/anamneses/${anamnesisId}/pdf/`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const contentType =
      response.headers.get("content-type") ?? "";

    if (
      contentType.includes("application/json")
    ) {
      const data = await response.json();

      throw new Error(
        data.detail ??
          "Não foi possível baixar o PDF.",
      );
    }

    throw new Error(
      "Não foi possível baixar o PDF.",
    );
  }

  const blob = await response.blob();
  const downloadUrl =
    URL.createObjectURL(blob);

  const disposition =
    response.headers.get(
      "content-disposition",
    ) ?? "";

  const filenameMatch = disposition.match(
    /filename="?([^"]+)"?/,
  );

  const filename =
    filenameMatch?.[1] ??
    `anamnese-${anamnesisId}.pdf`;

  const link =
    document.createElement("a");

  link.href = downloadUrl;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(downloadUrl);
}

/*
 * Compatibilidade temporária com a página antiga.
 * Essa função pode ser apagada quando removermos
 * DashboardPaymentsPage das rotas.
 */
