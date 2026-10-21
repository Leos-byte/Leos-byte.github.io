(() => {
  'use strict';
  const article = document.querySelector('main article');
  if (!article) return;
  const toc = document.querySelector('#reader-toc');
  const headings = [...article.querySelectorAll('h2')];
  headings.forEach((heading, index) => {
    heading.id = heading.id || 'section-' + (index + 1);
    const link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    toc?.append(link);
  });
  const progress = document.querySelector('#reading-progress');
  const update = () => {
    const bottom = article.offsetTop + article.offsetHeight - innerHeight;
    const ratio = Math.max(0, Math.min(1, scrollY / Math.max(1, bottom)));
    if (progress) progress.style.width = ratio * 100 + '%';
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
  const nav = document.querySelector('#reader-adjacent');
  fetch(new URL('manifest.json', document.currentScript.src)).then(r => {
    if (!r.ok) throw new Error('Article index unavailable');
    return r.json();
  }).then(data => {
    const items = (data.articles || []).filter(a => /^articles\/[a-zA-Z0-9_-]+\.html$/.test(a.path || ''));
    const index = items.findIndex(a => new URL('/' + a.path, location.origin).pathname === location.pathname);
    if (index < 0 || !nav) return;
    [[items[index - 1], '上一篇'], [items[index + 1], '下一篇']].forEach(([item, label]) => {
      if (!item) return;
      const link = document.createElement('a');
      link.href = '/' + item.path;
      const caption = document.createElement('span');
      caption.className = 'meta';
      caption.textContent = label;
      const title = document.createElement('strong');
      title.textContent = item.title + ' →';
      link.append(caption, title);
      nav.append(link);
    });
    nav.hidden = !nav.children.length;
  }).catch(() => {});
})();
