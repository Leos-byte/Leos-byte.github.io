import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: '关于 LEO', textZh: '关于 LEO', textEn: 'About Leo', href: '/#about' },
    { text: '专业服务', textZh: '专业服务', textEn: 'Services', href: '/#services' },
    { text: '培训课程', textZh: '培训课程', textEn: 'Training', href: '/#training' },
    { text: '专业洞察', textZh: '专业洞察', textEn: 'Insights', href: getBlogPermalink() },
    { text: '联系与合作', textZh: '联系与合作', textEn: 'Contact', href: getPermalink('/contact') },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: '专业领域',
      links: [
        { text: '网络安全与 AI 安全服务', href: getPermalink('/services') },
        { text: '专业文章', href: getBlogPermalink() },
        { text: '联系状态', href: getPermalink('/contact') },
      ],
    },
    {
      title: '网站说明',
      links: [
        { text: '服务边界', href: getPermalink('/safeguards') },
        { text: '隐私说明', href: getPermalink('/privacy') },
        { text: '更正与来源政策', href: getPermalink('/corrections') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `本站不接收项目申请、联系方式或敏感信息。© ${new Date().getFullYear()} LEO Cybersecurity & AI`,
};
