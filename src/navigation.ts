import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: '服务',
      textZh: '服务',
      href: getPermalink('/services'),
    },
    {
      text: '怎么做',
      textZh: '怎么做',
      href: getPermalink('/#how-it-works'),
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
      title: '服务',
      links: [
        { text: '服务与交付物', href: getPermalink('/services') },
        { text: '公开文章', href: getBlogPermalink() },
        { text: '服务边界', href: getPermalink('/safeguards') },
        { text: '联系状态', href: getPermalink('/contact') },
      ],
    },
    {
      title: '公开内容',
      links: [
        { text: '隐私说明', href: getPermalink('/privacy') },
        { text: '更正与来源政策', href: getPermalink('/corrections') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `目前不开放项目咨询。LeoOne 面向中国制造企业，提供范围明确的 AI 工作流诊断与试点准备咨询。© ${new Date().getFullYear()} LeoOne`,
};
