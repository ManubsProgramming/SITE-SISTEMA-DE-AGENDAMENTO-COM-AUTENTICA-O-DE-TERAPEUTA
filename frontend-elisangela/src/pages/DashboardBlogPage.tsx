import {
  Edit3,
  FilePlus2,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import {
  createBlogPost,
  deleteBlogPost,
  getDashboardBlogPosts,
  updateBlogPost,
  uploadBlogCoverImage,
} from "../services/blogApi";

import type {
  BlogPost,
  BlogPostInput,
} from "../services/blogApi";

import {
  therapistLogout,
} from "../services/dashboardApi";

import "./DashboardPage.css";

const emptyForm: BlogPostInput = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  cover_image_url: "",
  status: "DRAFT",
};

export default function DashboardBlogPage() {
  const [posts, setPosts] =
    useState<BlogPost[]>([]);

  const [form, setForm] =
    useState<BlogPostInput>(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editorOpen, setEditorOpen] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [error, setError] =
    useState("");

  function loadPosts() {
    getDashboardBlogPosts()
      .then(setPosts)
      .catch((requestError) => {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar o blog.";

        if (
          message.includes("Autenticação") ||
          message.includes("403")
        ) {
          window.location.href =
            "/acesso-terapeuta";

          return;
        }

        setError(message);
      });
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
    });
    setEditorOpen(true);
    setError("");
  }

  function startEdit(post: BlogPost) {
    setEditingId(post.id);

    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      cover_image_url:
        post.cover_image_url,
      status:
        post.status ?? "DRAFT",
    });

    setEditorOpen(true);
    setError("");
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Formato inválido. Escolha uma imagem JPG, PNG ou WEBP.",
      );

      event.target.value = "";
      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "A imagem deve ter no máximo 5 MB.",
      );

      event.target.value = "";
      return;
    }

    setUploadingImage(true);

    try {
      const result =
        await uploadBlogCoverImage(file);

      setForm((currentForm) => ({
        ...currentForm,
        cover_image_url:
          result.url,
      }));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível enviar a imagem.",
      );
    } finally {
      setUploadingImage(false);

      event.target.value = "";
    }
  }

  function removeCoverImage() {
    setForm((currentForm) => ({
      ...currentForm,
      cover_image_url: "",
    }));
  }

  async function savePost() {
    if (!form.title.trim()) {
      setError(
        "Informe o título da publicação.",
      );

      return;
    }

    if (!form.category.trim()) {
      setError(
        "Informe a categoria da publicação.",
      );

      return;
    }

    if (!form.excerpt.trim()) {
      setError(
        "Informe o resumo da publicação.",
      );

      return;
    }

    if (!form.content.trim()) {
      setError(
        "Informe o conteúdo da publicação.",
      );

      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingId === null) {
        await createBlogPost(form);
      } else {
        await updateBlogPost(
          editingId,
          form,
        );
      }

      setEditorOpen(false);
      setEditingId(null);
      setForm({
        ...emptyForm,
      });

      loadPosts();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removePost(
    post: BlogPost,
  ) {
    const confirmed =
      window.confirm(
        `Excluir a publicação "${post.title}"?`,
      );

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteBlogPost(post.id);

      loadPosts();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível excluir.",
      );
    }
  }

  async function handleLogout() {
    await therapistLogout();

    window.location.href =
      "/acesso-terapeuta";
  }

  return (
    <main className="dashboard">
      <aside className="dashboard-sidebar">
        <a
          className="dashboard-brand"
          href="/"
        >
          <span>EF</span>

          <div>
            <strong>
              Elisângela
            </strong>

            <small>
              Área da terapeuta
            </small>
          </div>
        </a>

        <nav>
          <a href="/painel">
            Visão geral
          </a>

          <a href="/painel/clientes">
            Clientes
          </a>

          <a href="/painel/anamneses">
            Anamneses
          </a>

          <a
            className="active"
            href="/painel/blog"
          >
            Blog
          </a>
        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
          type="button"
        >
          Sair da conta
        </button>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p>
              Conteúdo do site
            </p>

            <h1>
              Blog
            </h1>

            <span>
              Crie e edite publicações.
            </span>
          </div>

          <button
            type="button"
            onClick={startCreate}
            className="blog-new-button"
          >
            <FilePlus2 size={18} />
            Nova publicação
          </button>
        </header>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {editorOpen && (
          <section className="blog-editor">
            <div className="blog-editor-header">
              <div>
                <p>
                  Editor
                </p>

                <h2>
                  {editingId === null
                    ? "Nova publicação"
                    : "Editar publicação"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditorOpen(false);
                  setError("");
                }}
                aria-label="Fechar editor"
              >
                <X size={21} />
              </button>
            </div>

            <div className="blog-editor-grid">
              <label>
                Título

                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm(
                      (currentForm) => ({
                        ...currentForm,
                        title:
                          event.target.value,
                      }),
                    )
                  }
                  placeholder="Digite o título da publicação"
                />
              </label>

              <label>
                Categoria

                <input
                  value={form.category}
                  onChange={(event) =>
                    setForm(
                      (currentForm) => ({
                        ...currentForm,
                        category:
                          event.target.value,
                      }),
                    )
                  }
                  placeholder="Ex.: Ansiedade"
                />
              </label>

              <label className="blog-full-field">
                Resumo

                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(event) =>
                    setForm(
                      (currentForm) => ({
                        ...currentForm,
                        excerpt:
                          event.target.value,
                      }),
                    )
                  }
                  placeholder="Escreva um breve resumo da publicação..."
                />
              </label>

              <div className="blog-full-field">
                <span className="blog-field-label">
                  Imagem de capa
                </span>

                <div className="blog-image-upload-box">
                  {form.cover_image_url ? (
                    <div className="blog-image-preview">
                      <img
                        src={
                          form.cover_image_url
                        }
                        alt="Imagem de capa da publicação"
                      />

                      <button
                        type="button"
                        onClick={
                          removeCoverImage
                        }
                      >
                        <Trash2
                          size={16}
                        />

                        Remover imagem
                      </button>
                    </div>
                  ) : (
                    <label className="blog-image-picker">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={
                          handleImageUpload
                        }
                        disabled={
                          uploadingImage
                        }
                      />

                      {uploadingImage ? (
                        <>
                          <span>
                            Enviando imagem...
                          </span>

                          <small>
                            Aguarde um momento
                          </small>
                        </>
                      ) : (
                        <>
                          <span>
                            Escolher imagem
                          </span>

                          <small>
                            JPG, PNG ou WEBP · máximo 5 MB
                          </small>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>

              <label className="blog-full-field">
                Conteúdo

                <textarea
                  rows={14}
                  value={form.content}
                  onChange={(event) =>
                    setForm(
                      (currentForm) => ({
                        ...currentForm,
                        content:
                          event.target.value,
                      }),
                    )
                  }
                  placeholder="Escreva o conteúdo da publicação..."
                />
              </label>

              <label>
                Situação

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm(
                      (currentForm) => ({
                        ...currentForm,
                        status:
                          event.target
                            .value as BlogPostInput["status"],
                      }),
                    )
                  }
                >
                  <option value="DRAFT">
                    Rascunho
                  </option>

                  <option value="PUBLISHED">
                    Publicado
                  </option>
                </select>
              </label>
            </div>

            <button
              type="button"
              disabled={
                saving ||
                uploadingImage
              }
              onClick={savePost}
              className="blog-save-button"
            >
              {saving
                ? "Salvando..."
                : "Salvar publicação"}
            </button>
          </section>
        )}

        <section className="recent-section">
          <div className="section-heading">
            <div>
              <p>
                Publicações
              </p>

              <h2>
                {posts.length} post(s)
              </h2>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="empty-dashboard">
              Nenhuma publicação criada.
            </div>
          ) : (
            <div className="blog-dashboard-grid">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="blog-dashboard-card"
                >
                  {post.cover_image_url ? (
                    <img
                      src={
                        post.cover_image_url
                      }
                      alt=""
                    />
                  ) : (
                    <div className="blog-image-placeholder" />
                  )}

                  <div>
                    <span
                      className={`blog-status ${
                        post.status ===
                        "PUBLISHED"
                          ? "published"
                          : "draft"
                      }`}
                    >
                      {post.status ===
                      "PUBLISHED"
                        ? "Publicado"
                        : "Rascunho"}
                    </span>

                    <h3>
                      {post.title}
                    </h3>

                    <p>
                      {post.excerpt}
                    </p>

                    <div className="blog-card-actions">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(post)
                        }
                      >
                        <Edit3
                          size={16}
                        />

                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removePost(
                            post,
                          )
                        }
                      >
                        <Trash2
                          size={16}
                        />

                        Excluir
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}