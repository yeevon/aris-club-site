import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

import { getBlogPost, getAllBlogSlugs } from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}


export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: BlogPostPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlogPost(slug);

  if (!post) return { title: "Post Not Found" };

  const desc = post.excerpt || post.content.substring(0, 160);

  return {
    title: post.title,
    description: desc,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: post.title,
      description: desc,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { slug } = await props.params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  return (
    <article className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <span className="mr-2">←</span>
            Back to Blog
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-8 border-b border-gray-200 pb-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mb-4 text-lg text-gray-600">{post.excerpt}</p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {post.author && (
              <div className="flex items-center gap-2">
                <span className="font-medium">By {post.author}</span>
              </div>
            )}

            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}

            {post.readingTime && <span>{post.readingTime} min read</span>}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.contentHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              className="mb-8"
            />
          ) : (
            <p className="mb-8 whitespace-pre-wrap text-gray-700">
              {post.content}
            </p>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 pt-8">
          {post.author && (
            <div className="mb-6">
              <p className="font-semibold text-gray-900">About {post.author}</p>
              <p className="text-sm text-gray-600">
                {post.authorBio || "Aris Club contributor."}
              </p>
            </div>
          )}

          {/* Related Posts Navigation */}
          <nav className="mt-8 flex justify-between">
            {post.previousPost && (
              <Link
                href={`/blog/${post.previousPost.slug}`}
                className="flex flex-col text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <span className="mb-1 text-xs text-gray-600">← Previous</span>
                <span>{post.previousPost.title}</span>
              </Link>
            )}

            {post.nextPost && (
              <Link
                href={`/blog/${post.nextPost.slug}`}
                className="flex flex-col text-right text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <span className="mb-1 text-xs text-gray-600">Next →</span>
                <span>{post.nextPost.title}</span>
              </Link>
            )}
          </nav>
        </footer>
      </div>
    </article>
  );
}
