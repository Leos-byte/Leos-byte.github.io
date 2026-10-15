import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: '关于 LEO', textZh: '关于 LEO', textEn: 'About', href: getPermalink('/about') },
    { text: '专业服务', textZh: '专业服务', textEn: 'Services', href: getPermalink('/services') },
    { text: '培训课程', textZh: '培训课程', textEn: 'Training', href: getPermalink('/training') },
    { text: '专业文章', textZh: '专业文章', textEn: 'Insights', href: getBlogPermalink() },
    { text: '联系与合作', textZh: '联系与合作', textEn: 'Contact', href: getPermalink('/contact') },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: '探索 LEO',
      links: [
        { text: '关于 LEO', href: getPermalink('/about') },
        { text: '专业服务', href: getPermalink('/services') },
        { text: '企业培训', href: getPermalink('/training') },
        { text: '公开文章', href: getBlogPermalink() },
      ],
    },
    {
      title: '信任与透明',
      links: [
        { text: '联系状态', href: getPermalink('/contact') },
        { text: '服务边界', href: getPermalink('/safeguards') },
        { text: '隐私说明', href: getPermalink('/privacy') },
        { text: '更正与来源政策', href: getPermalink('/corrections') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `本站不接收项目申请或敏感信息。© ${new Date().getFullYear()} LEO Cybersecurity & AI`,
};
