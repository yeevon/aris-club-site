import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata = {
  title: 'Blog | Aris Club',
  description: 'Read the latest articles and updates from Aris Club',
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Blog</h1>
          <p className="text-lg text-slate-600">
            Insights, updates, and stories from Aris Club
          </p>
        </div>

        {/* Blog Posts List */}
        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-slate-200"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  {post.author && (
                    <>
                      <span>•</span>
                      <span>By {post.author}</span>
                    </>
                  )}
                  {post.readingTime && (
                    <>
                      <span>•</span>
                      <span>{post.readingTime} min read</span>
                    </>
                  )}
                </div>

                <p className="text-slate-600 mb-4 line-clamp-3">
                  {post.excerpt || post.description}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Read More
                  <span className="ml-2">→</span>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600 mb-4">No blog posts yet.</p>
            <p className="text-slate-500">Check back soon for updates!</p>
          </div>
        )}
      </div>
    </main>
  );
}
