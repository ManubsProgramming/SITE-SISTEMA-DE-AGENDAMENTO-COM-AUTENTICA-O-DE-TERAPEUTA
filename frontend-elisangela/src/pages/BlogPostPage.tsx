import {
  ArrowLeft,
  CalendarDays,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getPublicBlogPost,
} from "../services/blogApi";

import type {
  BlogPost,
} from "../services/blogApi";

export default function BlogPostPage() {
  const { slug = "" } = useParams();

  const [post, setPost] =
    useState<BlogPost | null>(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    getPublicBlogPost(slug)
      .then(setPost)
      .catch((requestError) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Publicação não encontrada.",
        );
      });
  }, [slug]);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f3e9] p-5">
        <div className="text-center">
          <p className="text-red-700">
            {error}
          </p>

          <Link
            to="/blog"
            className="mt-5 inline-block"
          >
            Voltar ao blog
          </Link>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8f3e9]">
        Carregando publicação...
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f3e9] text-[#382f27]">
      <header className="border-b border-[#ded2c3] px-5 py-5">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-semibold text-[#62705c]"
          >
            <ArrowLeft size={18} />
            Voltar ao blog
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-16">
        {post.category && (
          <span className="rounded-full bg-[#dfe7d9] px-4 py-2 text-sm font-bold text-[#596951]">
            {post.category}
          </span>
        )}

        <h1 className="mt-7 font-serif text-5xl leading-tight md:text-7xl">
          {post.title}
        </h1>

        <div className="mt-6 flex items-center gap-2 text-[#837262]">
          <CalendarDays size={17} />

          {post.published_at &&
            new Date(
              post.published_at,
            ).toLocaleDateString(
              "pt-BR",
              {
                dateStyle: "long",
              },
            )}
        </div>

        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt=""
            className="mt-10 max-h-[520px] w-full rounded-[2rem] object-cover"
          />
        )}

        <p className="mt-10 text-xl font-medium leading-9 text-[#66584b]">
          {post.excerpt}
        </p>

        <div className="mt-9 whitespace-pre-wrap text-lg leading-9 text-[#564b40]">
          {post.content}
        </div>
      </main>
    </div>
  );
}