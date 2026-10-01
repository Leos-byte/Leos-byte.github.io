import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: '服务',
      textZh: '服务',
      href: getPermalink('/services'),
    },
    {
      text: '交付物',
      textZh: '交付物',
      href: getPermalink('/#deliverables'),
    },
    {
      text: '公开原型',
      textZh: '公开原型',
      href: getPermalink('/#proof'),
    },
    {
      text: '范围与边界',
      textZh: '范围与边界',
      href: getPermalink('/safeguards'),
    },
    {
      text: '洞见',
      textZh: '洞见',
      href: getBlogPermalink(),
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
        { text: '公开工程原型', href: getPermalink('/#proof') },
        { text: '范围与边界', href: getPermalink('/safeguards') },
        { text: '联系状态', href: getPermalink('/contact') },
      ],
    },
    {
      title: '公开材料',
      links: [
        { text: '洞见', href: getBlogPermalink() },
        { text: '隐私说明', href: getPermalink('/privacy') },
        { text: '更正与来源政策', href: getPermalink('/corrections') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `LeoOne 面向中国制造企业提供固定范围的 AI 工作流诊断与试点准备咨询。 © ${new Date().getFullYear()} LeoOne`,
};
