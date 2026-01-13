import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

export interface PostMetadata {
  title: string;
  description: string;
  author: string;
  date: string;
  tags?: string[];
  published?: boolean;
  [key: string]: any;
}

export interface Post {
  id: string;
  metadata: PostMetadata;
  content: string;
  html: string;
}

const POSTS_DIRECTORY = path.join(process.cwd(), 'posts');

/**
 * Get all blog posts from the posts directory
 */
export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }

  const fileNames = fs.readdirSync(POSTS_DIRECTORY);
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => getPostBySlug(fileName.replace(/\.md$/, '')))
  );

  // Sort posts by date in descending order
  return posts.sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
}

/**
 * Get a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post> {
  const filePath = path.join(POSTS_DIRECTORY, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Post not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const html = await marked(content);

  return {
    id: slug,
    metadata: data as PostMetadata,
    content,
    html,
  };
}

/**
 * Get all unique tags from all posts
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    if (post.metadata.tags && Array.isArray(post.metadata.tags)) {
      post.metadata.tags.forEach((tag) => tags.add(tag));
    }
  });

  return Array.from(tags).sort();
}

/**
 * Get all posts with a specific tag
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter(
    (post) => post.metadata.tags && post.metadata.tags.includes(tag)
  );
}

/**
 * Get published posts only (exclude drafts)
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.metadata.published !== false);
}

/**
 * Get posts by author
 */
export async function getPostsByAuthor(author: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.metadata.author.toLowerCase() === author.toLowerCase());
}

/**
 * Search posts by title or description
 */
export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await getAllPosts();
  const lowerQuery = query.toLowerCase();

  return posts.filter((post) => {
    const titleMatch = post.metadata.title.toLowerCase().includes(lowerQuery);
    const descriptionMatch = post.metadata.description?.toLowerCase().includes(lowerQuery);
    const contentMatch = post.content.toLowerCase().includes(lowerQuery);

    return titleMatch || descriptionMatch || contentMatch;
  });
}

/**
 * Get related posts based on shared tags
 */
export async function getRelatedPosts(
  postId: string,
  limit: number = 3
): Promise<Post[]> {
  const posts = await getAllPosts();
  const currentPost = posts.find((p) => p.id === postId);

  if (!currentPost || !currentPost.metadata.tags) {
    return [];
  }

  const related = posts
    .filter((post) => post.id !== postId)
    .map((post) => {
      const sharedTags = post.metadata.tags?.filter((tag) =>
        currentPost.metadata.tags?.includes(tag)
      ).length || 0;

      return { post, sharedTags };
    })
    .filter(({ sharedTags }) => sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, limit)
    .map(({ post }) => post);

  return related;
}

/**
 * Get the reading time in minutes for a post
 */
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate excerpt from post content
 */
export function getExcerpt(content: string, wordLimit: number = 50): string {
  const words = content.split(/\s+/).slice(0, wordLimit);
  return words.join(' ') + (words.length < content.split(/\s+/).length ? '...' : '');
}
