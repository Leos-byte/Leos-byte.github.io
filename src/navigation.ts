import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: '服务',
      textZh: '服务',
      href: getPermalink('/services'),
    },
    {
      text: '工作方式',
      textZh: '工作方式',
      href: getPermalink('/#how-it-works'),
    },
    {
      text: '公开材料',
      textZh: '公开材料',
      href: getBlogPermalink(),
    },
    {
      text: '范围与边界',
      textZh: '范围与边界',
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
        { text: '公开材料', href: getBlogPermalink() },
        { text: '范围与边界', href: getPermalink('/safeguards') },
        { text: '项目联系状态', href: getPermalink('/contact') },
      ],
    },
    {
      title: '公开材料',
      links: [
        { text: '隐私说明', href: getPermalink('/privacy') },
        { text: '更正与来源政策', href: getPermalink('/corrections') },
      ],
    },
  ],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `项目联系状态：公开渠道尚未开放。 LeoOne 面向中国制造企业提供固定范围的 AI 工作流诊断与试点准备咨询。 © ${new Date().getFullYear()} LeoOne`,
};
