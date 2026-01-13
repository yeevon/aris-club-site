import {
  getAllPosts,
  getPostBySlug,
  getExcerpt,
  getReadingTime,
} from "@/lib/posts";

export interface BlogListItem {
  slug: string;
  title: string;
  date: string;
  author?: string;
  description?: string;
  excerpt?: string;
  readingTime?: number;
  tags?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  publishedAt?: string;
  author?: string;
  excerpt?: string;
  tags?: string[];
  readingTime?: number;
  content: string;
  contentHtml?: string;
  authorBio?: string;

  // Optional navigation (page already supports it)
  previousPost?: { slug: string; title: string };
  nextPost?: { slug: string; title: string };
}

/**
 * Return slugs for static generation.
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.id);
}

/**
 * Blog index data.
 */
export async function getAllBlogPosts(): Promise<BlogListItem[]> {
  const posts = await getAllPosts();

  // Map lib/posts.ts shape -> blog index shape
  return posts.map((p) => ({
    slug: p.id,
    title: p.metadata.title,
    date: p.metadata.date,
    author: p.metadata.author,
    description: p.metadata.description,
    tags: p.metadata.tags,
    readingTime: getReadingTime(p.content),
    excerpt: getExcerpt(p.content, 50),
  }));
}

/**
 * Single blog post data.
 * Adds previous/next links based on chronological ordering.
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const all = await getAllPosts();
    const idx = all.findIndex((p) => p.id === slug);

    if (idx === -1) return null;

    const current = await getPostBySlug(slug);

    const previous = all[idx + 1]; // because all is sorted newest->oldest
    const next = all[idx - 1];

    return {
      slug: current.id,
      title: current.metadata.title,
      publishedAt: current.metadata.date,
      author: current.metadata.author,
      tags: current.metadata.tags,
      excerpt: current.metadata.description ?? getExcerpt(current.content, 50),
      readingTime: getReadingTime(current.content),
      content: current.content,
      contentHtml: current.html,

      previousPost: previous
        ? { slug: previous.id, title: previous.metadata.title }
        : undefined,
      nextPost: next ? { slug: next.id, title: next.metadata.title } : undefined,
    };
  } catch {
    return null;
  }
}
