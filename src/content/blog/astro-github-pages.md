---
title: "用 Astro 发布到 GitHub Pages"
description: "从内容集合、静态构建到 GitHub Actions，搭好一个可长期维护的博客发布流程。"
pubDate: 2026-05-24
updatedDate: 2026-05-24
tags: ["Astro", "GitHub Pages", "部署"]
cover: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80"
featured: true
---

Astro 很适合做内容型站点。它默认输出静态文件，GitHub Pages 可以直接托管构建后的 `dist/` 目录。

这套博客把内容、路由和部署分成三层：

1. `src/content/blog/` 存放 Markdown 或 MDX 文章。
2. `src/pages/` 负责生成首页、归档页、标签页、文章页和 RSS。
3. `.github/workflows/deploy.yml` 在推送到 `main` 后自动构建并发布。

## 子路径处理

GitHub 项目页通常部署在 `https://用户名.github.io/仓库名/`，链接和静态资源都要带上仓库名。`astro.config.mjs` 会在 GitHub Actions 中读取 `GITHUB_REPOSITORY`，自动设置 `base` 和 `site`。

如果仓库名是 `用户名.github.io`，它会被视为用户站点，路径会使用根目录。

## 内容发布

新增文章只需要在 `src/content/blog/` 里创建文件，并填写 frontmatter。`draft: true` 的文章在生产环境不会发布，适合保存未完成的草稿。
