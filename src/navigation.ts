import { getAsset, getBlogPermalink, getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: '首页',
      href: getPermalink('/'),
    },
    {
      text: '文章',
      href: getBlogPermalink(),
    },
    {
      text: '关于',
      href: getPermalink('/about'),
    },
  ],
  actions: [{ text: 'GitHub', href: 'https://github.com/Leos-byte/Leos-byte.github.io', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: '浏览',
      links: [
        { text: '首页', href: getPermalink('/') },
        { text: '文章', href: getBlogPermalink() },
        { text: '关于', href: getPermalink('/about') },
      ],
    },
    {
      title: '主题',
      links: [
        { text: 'Astro', href: getPermalink('astro', 'tag') },
        { text: 'GitHub Pages', href: getPermalink('github-pages', 'tag') },
        { text: 'MDX', href: getPermalink('mdx', 'tag') },
      ],
    },
  ],
  secondaryLinks: [{ text: 'RSS', href: getAsset('/rss.xml') }],
  socialLinks: [
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/Leos-byte' },
  ],
  footNote: `
    &copy; ${new Date().getFullYear()} Leo. Built with <a class="text-blue-600 underline dark:text-muted" href="https://github.com/arthelokyo/astrowind">AstroWind</a>.
  `,
};
