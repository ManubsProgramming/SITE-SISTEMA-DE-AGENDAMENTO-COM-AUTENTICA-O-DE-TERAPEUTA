const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:8000/api";

export type BlogPostStatus =
  | "DRAFT"
  | "PUBLISHED";

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image_url: string;
  author_name?: string;
  status?: BlogPostStatus;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
};

export type BlogPostInput = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image_url: string;
  status: BlogPostStatus;
};

async function jsonRequest<T>(
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
      `O servidor respondeu ${response.status}.`,
    );
  }

  const data = await response.json();

  if (!response.ok) {
    const detail =
      typeof data.detail === "string"
        ? data.detail
        : Object.values(data)
            .flat()
            .join(" ");

    throw new Error(
      detail ||
        "Não foi possível concluir a solicitação.",
    );
  }

  return data as T;
}

async function getCsrfToken() {
  const data = await jsonRequest<{
    csrfToken: string;
  }>("/dashboard/csrf/");

  return data.csrfToken;
}

export async function getPublicBlogPosts(): Promise<
  BlogPost[]
> {
  const data = await jsonRequest<{
    posts: BlogPost[];
  }>("/blog/posts/");

  return data.posts;
}

export async function getPublicBlogPost(
  slug: string,
): Promise<BlogPost> {
  return jsonRequest<BlogPost>(
    `/blog/posts/${slug}/`,
  );
}

export async function getDashboardBlogPosts(): Promise<
  BlogPost[]
> {
  const data = await jsonRequest<{
    posts: BlogPost[];
  }>("/blog/dashboard/posts/");

  return data.posts;
}

export async function createBlogPost(
  input: BlogPostInput,
): Promise<BlogPost> {
  const csrfToken = await getCsrfToken();

  return jsonRequest<BlogPost>(
    "/blog/dashboard/posts/",
    {
      method: "POST",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(input),
    },
  );
}

export async function updateBlogPost(
  postId: number,
  input: BlogPostInput,
): Promise<BlogPost> {
  const csrfToken = await getCsrfToken();

  return jsonRequest<BlogPost>(
    `/blog/dashboard/posts/${postId}/`,
    {
      method: "PUT",
      headers: {
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(input),
    },
  );
}

export async function deleteBlogPost(
  postId: number,
): Promise<void> {
  const csrfToken = await getCsrfToken();

  const response = await fetch(
    `${API_URL}/blog/dashboard/posts/${postId}/`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRFToken": csrfToken,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      "Não foi possível excluir a publicação.",
    );
  }
}