import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      textZh: '首页',
      href: getPermalink('/'),
    },
    {
      text: 'Product',
      textZh: '产品',
      links: [
        {
          text: 'Features (Anchor Link)',
          textZh: '功能锚点',
          href: getPermalink('/#features'),
        },
        {
          text: 'Services',
          textZh: '服务',
          href: getPermalink('/services'),
        },
        {
          text: 'Pricing',
          textZh: '价格',
          href: getPermalink('/pricing'),
        },
        {
          text: 'Contact',
          textZh: '联系',
          href: getPermalink('/contact'),
        },
        {
          text: 'Terms',
          textZh: '条款',
          href: getPermalink('/terms'),
        },
        {
          text: 'Privacy policy',
          textZh: '隐私政策',
          href: getPermalink('/privacy'),
        },
      ],
    },
    {
      text: 'Blog',
      textZh: '博客',
      links: [
        {
          text: 'Blog List',
          textZh: '博客列表',
          href: getBlogPermalink(),
        },
        {
          text: 'Article',
          textZh: '文章',
          href: getPermalink('get-started-website-with-astro-tailwind-css', 'post'),
        },
        {
          text: 'Article (with MDX)',
          textZh: 'MDX 文章',
          href: getPermalink('markdown-elements-demo-post', 'post'),
        },
        {
          text: 'Category Page',
          textZh: '分类页',
          href: getPermalink('tutorials', 'category'),
        },
        {
          text: 'Tag Page',
          textZh: '标签页',
          href: getPermalink('astro', 'tag'),
        },
      ],
    },
    {
      text: 'About',
      textZh: '关于',
      links: [
        {
          text: 'About us',
          textZh: '关于我们',
          href: getPermalink('/about'),
        },
        {
          text: 'Personal',
          textZh: '个人主页',
          href: getPermalink('/homes/personal'),
        },
      ],
    },
    {
      text: 'Search',
      textZh: '搜索',
      href: getPermalink('/search'),
      icon: 'tabler:search',
    },
    {
      text: 'Widgets',
      textZh: '组件',
      href: '#',
    },
  ],
  actions: [{ text: 'Download', textZh: '下载', href: 'https://github.com/arthelokyo/astrowind', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '#' },
        { text: 'Security', href: '#' },
        { text: 'Team', href: '#' },
        { text: 'Enterprise', href: '#' },
        { text: 'Customer stories', href: '#' },
        { text: 'Pricing', href: '#' },
        { text: 'Resources', href: '#' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { text: 'Developer API', href: '#' },
        { text: 'Partners', href: '#' },
        { text: 'Atom', href: '#' },
        { text: 'Electron', href: '#' },
        { text: 'AstroWind Desktop', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Docs', href: '#' },
        { text: 'Community Forum', href: '#' },
        { text: 'Professional Services', href: '#' },
        { text: 'Skills', href: '#' },
        { text: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Blog', href: '#' },
        { text: 'Careers', href: '#' },
        { text: 'Press', href: '#' },
        { text: 'Inclusion', href: '#' },
        { text: 'Social Impact', href: '#' },
        { text: 'Shop', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/arthelokyo/astrowind' },
  ],
  footNote: `
    Made by <a class="text-blue-600 underline dark:text-muted" href="https://github.com/arthelokyo"> Arthelokyo</a> · All rights reserved.
  `,
};
