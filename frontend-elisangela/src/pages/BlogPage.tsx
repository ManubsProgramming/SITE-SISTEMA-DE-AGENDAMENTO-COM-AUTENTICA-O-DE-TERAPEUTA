import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";

import {
  getPublicBlogPosts,
} from "../services/blogApi";

import type {
  BlogPost,
} from "../services/blogApi";

const whatsapp =
  "https://wa.me/5592993578484?text=Olá%2C%20Elisângela!%20Gostaria%20de%20saber%20mais%20sobre%20o%20atendimento%20online.";

function formatDate(value: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );
}

export default function BlogPage() {
  const [posts, setPosts] =
    useState<BlogPost[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    getPublicBlogPosts()
      .then(setPosts)
      .catch((requestError) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível carregar o blog.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f3e9] text-[#382f27]">
      <header className="border-b border-[#dfd2c2] bg-[#f8f3e9]">
        <nav className="mx-auto flex max-w-[1300px] items-center justify-between px-5 py-5">
          <Link
            to="/"
            className="flex items-center gap-4"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#3a3329] font-serif text-xl text-[#f1dfbd]">
              EF
            </span>

            <span>
              <strong className="block font-serif text-2xl">
                Elisângela Fernandes
              </strong>

              <small className="uppercase tracking-[0.2em] text-[#92765d]">
                Terapeuta Emocional
              </small>
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              to="/"
              className="font-semibold"
            >
              Início
            </Link>

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full bg-[#67775f] px-6 py-3 font-bold text-white sm:inline-flex"
            >
              WhatsApp
            </a>
          </div>
        </nav>
      </header>

      <section className="bg-[#3a3329] px-5 py-20 text-center text-white">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#b8c8ae]">
          Conteúdo e informação
        </p>

        <h1 className="mt-5 font-serif text-5xl md:text-7xl">
          Blog
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#ddd2c4]">
          Conteúdos sobre terapia emocional,
          transformação e cuidado individual.
        </p>
      </section>

      <main className="mx-auto max-w-[1300px] px-5 py-20">
        {error && (
          <p className="rounded-2xl bg-red-50 p-5 text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-center">
            Carregando publicações...
          </p>
        ) : posts.length === 0 ? (
          <p className="rounded-3xl bg-white/60 p-10 text-center text-[#796a5b]">
            Nenhuma publicação disponível.
          </p>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-[2rem] border border-[#e2d6c7] bg-white shadow-[0_20px_50px_rgba(57,46,34,0.08)]"
              >
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt=""
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[16/10] bg-[#dfe7d9]" />
                )}

                <div className="p-7">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#8b725b]">
                    {post.category && (
                      <span className="rounded-full bg-[#eee3d5] px-3 py-1">
                        {post.category}
                      </span>
                    )}

                    <span className="flex items-center gap-2">
                      <CalendarDays size={15} />
                      {formatDate(
                        post.published_at,
                      )}
                    </span>
                  </div>

                  <h2 className="mt-5 font-serif text-3xl leading-tight">
                    {post.title}
                  </h2>

                  <p className="mt-4 leading-7 text-[#756657]">
                    {post.excerpt}
                  </p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-7 inline-flex items-center gap-2 font-bold text-[#586851]"
                  >
                    Ler publicação
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Conversar pelo WhatsApp"
        className="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-[#5d7656] text-white shadow-xl"
      >
        <MessageCircle size={25} />
      </a>
    </div>
  );
}