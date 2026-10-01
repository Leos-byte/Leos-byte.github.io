import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'AI 转型咨询',
      textZh: 'AI 转型咨询',
      href: getPermalink('/services'),
    },
    {
      text: '制造业重点',
      textZh: '制造业重点',
      href: getPermalink('/services#manufacturing'),
    },
    {
      text: '公开文章',
      textZh: '公开文章',
      href: getBlogPermalink(),
    },
    {
      text: '服务边界',
      textZh: '服务边界',
      href: getPermalink('/safeguards'),
    },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: '网站导航',
      links: [
        { text: 'AI 转型咨询', href: getPermalink('/services') },
        { text: '制造业重点', href: getPermalink('/services#manufacturing') },
        { text: '公开文章', href: getBlogPermalink() },
        { text: '服务边界', href: getPermalink('/safeguards') },
        { text: '联系状态', href: getPermalink('/contact') },
      ],
    },
    {
      title: '公开说明',
      links: [
        { text: '隐私说明', href: getPermalink('/privacy') },
        { text: '更正与来源政策', href: getPermalink('/corrections') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `本站当前用于说明公开信息，不接收项目申请、联系方式、项目资料或敏感信息。© ${new Date().getFullYear()} LeoOne`,
};
