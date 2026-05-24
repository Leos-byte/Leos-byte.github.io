---
title: "用内容集合管理博客元数据"
description: "通过 Astro Content Collections 给文章标题、日期、标签和封面建立稳定的数据结构。"
pubDate: 2026-05-18
tags: ["Astro", "内容管理"]
cover: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
---

内容集合可以让博客文章不只是零散的 Markdown 文件。每篇文章都要通过统一的 schema 校验，字段缺失或类型错误会在构建时暴露。

当前博客使用这些字段：

- `title`：文章标题。
- `description`：列表页和 SEO 使用的摘要。
- `pubDate`：发布时间。
- `updatedDate`：可选的更新时间。
- `tags`：标签列表。
- `cover`：文章封面图地址。
- `draft`：草稿开关。

这让列表页、标签页、RSS 和文章页都能复用同一份结构化数据。

## 排序与过滤

`src/lib/posts.ts` 中的 `getPublishedPosts()` 会按发布时间倒序排序，并在生产构建时过滤草稿。页面层只关心如何展示文章，不需要重复处理这些规则。
