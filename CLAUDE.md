# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command             | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Dev server at `localhost:4321`             |
| `npm run build`     | Production build to `./dist/`              |
| `npm run preview`   | Preview the production build locally       |
| `npm run check`     | Astro type-check + ESLint + Prettier       |
| `npm run fix`       | Auto-fix ESLint + Prettier issues          |

**Node.js >= 22.12.0** required. The site is deployed to `https://leoone.uk`.

After any code change, verify `npm run build` and `npm run check` both pass.

## Architecture

AstroWind is a static site built with **Astro v6**, **Tailwind CSS v4**, and **TypeScript**. No client-side JS framework — only minimal vanilla JS for interactivity (theme toggle, mobile menu). Output is fully static (`output: 'static'` in astro config).

### Configuration pipeline (critical to understand)

Site configuration flows through a custom integration chain:

1. **`src/config.yaml`** — human-editable YAML for site metadata, i18n, blog settings, analytics, UI theme
2. **`vendor/integration/index.ts`** — a custom Astro integration that reads `config.yaml`, builds typed config objects, and exposes them as the Vite virtual module `astrowind:config`
3. **Components import** `SITE`, `I18N`, `METADATA`, `APP_BLOG`, `UI`, `ANALYTICS` from `astrowind:config`

This means `config.yaml` changes are picked up as a watched file and hot-reloaded in dev. Never hardcode site config values in components — always source them from `astrowind:config`.

### Path aliases

Import from `src/` using `~/`:
```typescript
import Image from '~/components/common/Image.astro';
import { SITE } from 'astrowind:config';
```

Defined in both `tsconfig.json` (for type checking) and `astro.config.ts` `vite.resolve.alias` (for runtime).

### Directory layout

- **`src/pages/`** — file-based routing (Astro convention). `[...blog]/` is a dynamic rest-param route for the blog
- **`src/layouts/`** — `Layout.astro` (base), `PageLayout.astro` (standard pages), `MarkdownLayout.astro` (blog posts), `LandingLayout.astro` (landing pages with optional header/footer)
- **`src/components/`** — `common/` (Image, Metadata, Analytics), `ui/` (Button, Headline, WidgetWrapper), `widgets/` (Hero, Features, Header, Footer), `blog/`, plus `CustomStyles.astro` (CSS custom properties for colors/fonts)
- **`src/data/post/`** — blog content as `.md` / `.mdx` files
- **`src/content.config.ts`** — Content Collections schema using Astro v6 `glob()` loader
- **`src/utils/`** — `permalinks.ts`, `blog.ts`, `images.ts`, `frontmatter.ts`
- **`vendor/integration/`** — custom Astro integration (don't modify unless changing the config system itself)

### Tailwind CSS v4 (CSS-first config)

All Tailwind configuration is CSS-first in `src/assets/styles/tailwind.css`:
- **`@theme`** block maps design tokens (colors, fonts) from CSS custom properties
- **`@utility`** directives define custom utilities like `bg-page`
- **Dark mode:** class-based via `@variant dark (&:where(.dark, .dark *))`
- **Plugin:** `@plugin "@tailwindcss/typography"` for prose styling
- Tailwind is loaded as a Vite plugin (`@tailwindcss/vite`) in `astro.config.ts`, not as an Astro integration

CSS custom properties for colors/fonts are set in `src/components/CustomStyles.astro` with light/dark variants.

### Content Collections (Astro v6)

Defined in `src/content.config.ts` using the Content Layer API with `glob()` loader. Posts live in `src/data/post/`. Frontmatter schema includes: `title` (required), `publishDate`, `updateDate`, `draft`, `excerpt`, `image`, `category`, `tags`, `author`, `metadata`.

### Component patterns

- Props extend interfaces from `~/types` (defined in `src/types.d.ts`)
- Use Astro `class:list` for conditional classes
- Use `twMerge()` from `tailwind-merge` when a component accepts a `className` override prop
- Named slots for layout composition
- Widget components accept standardized props (see `~/types`)

### Image handling

`src/components/common/Image.astro` is the single image component:
- Local images → `astro:assets` (Sharp optimization)
- Remote images → Unpic CDN (URL rewriting, no Astro download)
- Fallback remote images (providers Unpic can't detect) → `astro:assets` domain allowlist (currently `cdn.pixabay.com`)

### i18n pattern

Navigation supports bilingual (English/Chinese) via `text`/`textZh` pairs in `src/navigation.ts`. The language toggle in the header switches `data-lang` attribute. Blog content is language-specific through the post frontmatter and `i18n.language` in `config.yaml`.

### Blog routing

Blog uses Astro's rest parameters (`[...blog]`). Routes like `/blog`, `/blog/2`, `/category/tutorials`, `/tag/astro` all resolve through `src/pages/[...blog]/`. The permalink pattern from `config.yaml` (`apps.blog.post.permalink`) controls individual post URLs.

For more detailed patterns (verification checklist, component examples), see [AGENTS.md](./AGENTS.md).
