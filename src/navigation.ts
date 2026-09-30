import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: '首页',
      textZh: '首页',
      href: getPermalink('/'),
    },
    {
      text: '方法与范围',
      textZh: '方法与范围',
      href: getPermalink('/services'),
    },
    {
      text: '安全与边界',
      textZh: '安全与边界',
      href: getPermalink('/safeguards'),
    },
    {
      text: '洞见',
      textZh: '洞见',
      href: getBlogPermalink(),
    },
    {
      text: '联系与关注',
      textZh: '联系与关注',
      href: getPermalink('/contact'),
    },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: '导航',
      links: [
        { text: '首页', href: getPermalink('/') },
        { text: '方法与范围', href: getPermalink('/services') },
        { text: '安全与边界', href: getPermalink('/safeguards') },
        { text: '洞见', href: getBlogPermalink() },
        { text: '联系与关注', href: getPermalink('/contact') },
      ],
    },
    {
      title: '站点说明',
      links: [
        { text: '隐私说明', href: getPermalink('/privacy') },
        { text: '更正与来源政策', href: getPermalink('/corrections') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `LeoOne 是中文优先的 AI 研究与 AI Agent 安全情报出版物。 © ${new Date().getFullYear()} LeoOne`,
};
