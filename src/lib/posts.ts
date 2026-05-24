import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export async function getPublishedPosts() {
  const posts = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  return posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );
}

export function getPostUrl(post: BlogPost) {
  return `/blog/${post.id}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function slugifyTag(tag: string) {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function getTagGroups() {
  const posts = await getPublishedPosts();
  const groups = new Map<
    string,
    { name: string; slug: string; posts: BlogPost[]; count: number }
  >();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = slugifyTag(tag);
      const existing = groups.get(slug);

      if (existing) {
        existing.posts.push(post);
        existing.count += 1;
      } else {
        groups.set(slug, { name: tag, slug, posts: [post], count: 1 });
      }
    }
  }

  return Array.from(groups.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "zh-CN"),
  );
}
