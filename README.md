# Leo 的技术札记

基于 [AstroWind](https://github.com/arthelokyo/astrowind) 的 Astro 静态博客，部署到 GitHub Pages 根域名：

<https://leoone.uk/>

## 本地开发

```bash
npm install
npm run dev
```

## 写文章

文章放在 `src/data/post/`，支持 Markdown 和 MDX。示例：

```md
---
publishDate: 2026-05-24T00:00:00Z
author: Leo
title: 用 Astro 发布到 GitHub Pages
excerpt: 文章摘要
image: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80
category: Deployment
tags:
  - astro
  - github-pages
---
```

## 部署

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会执行：

```bash
npm ci
npm run build
```

并把 `dist/` 发布到 GitHub Pages。
