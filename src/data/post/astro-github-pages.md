---
publishDate: 2026-05-24T00:00:00Z
updateDate: 2026-05-24T00:00:00Z
author: Leo
title: 用 Astro 发布到 GitHub Pages
excerpt: 从内容集合、静态构建到 GitHub Actions，搭好一个可长期维护的博客发布流程。
image: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80
category: Deployment
tags:
  - astro
  - github-pages
  - deployment
---

Astro 很适合做内容型站点。它默认输出静态文件，GitHub Pages 可以直接托管构建后的 `dist/` 目录。

这套博客把内容、路由和部署分成三层：

1. `src/data/post/` 存放 Markdown 或 MDX 文章。
2. `src/pages/` 负责生成首页、归档页、标签页、文章页和 RSS。
3. `.github/workflows/deploy.yml` 在推送到 `main` 后自动构建并发布。

## 根域名部署

如果仓库名是 `Leos-byte.github.io`，GitHub Pages 会把站点发布到 `https://leos-byte.github.io/`。

Astro 配置里仍然保留了对项目页子路径的兼容：当仓库不是 `*.github.io` 时，构建会自动把仓库名作为 `base`。

## 内容发布

新增文章只需要在 `src/data/post/` 里创建文件，并填写 frontmatter。`draft: true` 的文章不会进入博客列表，适合保存未完成的草稿。
