---
publishDate: 2026-05-18T00:00:00Z
author: Leo
title: 用内容集合管理博客元数据
excerpt: 通过 Astro Content Collections 给文章标题、日期、标签和封面建立稳定的数据结构。
image: https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80
category: Astro
tags:
  - astro
  - content
---

内容集合可以让博客文章不只是零散的 Markdown 文件。每篇文章都要通过统一的 schema 校验，字段缺失或类型错误会在构建时暴露。

当前博客使用这些字段：

- `title`：文章标题。
- `excerpt`：列表页和 SEO 使用的摘要。
- `publishDate`：发布时间。
- `updateDate`：可选的更新时间。
- `tags`：标签列表。
- `image`：文章封面图地址。
- `draft`：草稿开关。

这让列表页、标签页、RSS 和文章页都能复用同一份结构化数据。

## 排序与过滤

Astrowind 的 `src/utils/blog.ts` 会把内容集合标准化为统一的 `Post` 对象，并按发布时间倒序排序。页面层只关心展示，不需要重复处理这些规则。
