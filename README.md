# Astro GitHub Pages Blog

基于 Astro 的静态博客系统，内置文章列表、文章详情、标签页、RSS、站点地图和 GitHub Pages 自动部署。

## 本地开发

```bash
npm install
npm run dev
```

打开终端输出的本地地址即可预览。

## 写文章

文章放在 `src/content/blog/`，支持 Markdown 和 MDX。每篇文章使用 frontmatter：

```md
---
title: "文章标题"
description: "文章摘要"
pubDate: 2026-05-24
tags: ["Astro", "GitHub Pages"]
cover: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80"
featured: true
---
```

草稿文章可设置 `draft: true`，生产构建时不会发布。

## 部署到 GitHub Pages

1. 推送到 GitHub 仓库的 `main` 分支。
2. 在仓库 `Settings -> Pages` 中，将 Source 设为 `GitHub Actions`。
3. 每次推送后，`.github/workflows/deploy.yml` 会自动构建并发布 `dist/`。

项目页仓库会自动使用 `https://用户名.github.io/仓库名/` 子路径；如果仓库名是 `用户名.github.io`，则会自动使用根路径。

## 常用命令

```bash
npm run dev
npm run check
npm run build
npm run preview
```
