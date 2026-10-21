(() => {
  'use strict';
  const list = document.querySelector('[data-article-list]');
  if (!list) return;
  const mode = list.dataset.articleList;
  const search = document.querySelector('#article-search');
  const domain = document.querySelector('#article-domain');
  const sort = document.querySelector('#article-sort');
  const count = document.querySelector('#article-count');
  const empty = document.querySelector('#article-empty');
  const more = document.querySelector('#article-more');
  const script = document.currentScript;
  const base = new URL('.', script.src);
  let articles = [];
  let limit = 12;
  const node = (tag, className, value) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (value) el.textContent = value;
    return el;
  };
  const articleURL = item => {
    const path = String(item.path || '');
    if (!/^articles\/[a-zA-Z0-9_-]+\.html$/.test(path)) return null;
    return new URL(path.slice('articles/'.length), base).href;
  };
  const card = item => {
    const el = node('article', 'essay-card');
    const link = node('a', 'essay-link');
    link.href = articleURL(item);
    const meta = node('p', 'essay-meta', [item.domain, item.original_year && item.original_year + '年提出'].filter(Boolean).join(' · '));
    link.append(meta, node('h3', '', item.title));
    const summary = item.summary || item.description;
    if (summary) link.append(node('p', 'essay-summary', summary));
    const footer = node('div', 'essay-footer');
    footer.append(node('span', '', item.person || '思想与实践'), node('span', '', '阅读全文 →'));
    link.append(footer);
    el.append(link);
    return el;
  };
  function render() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    const selected = domain?.value || '';
    let items = articles.filter(a => (!selected || a.domain === selected) && [a.title, a.person, a.domain, a.summary, a.description].join(' ').toLocaleLowerCase().includes(query));
    items.sort((a, b) => {
      const result = String(b.published_at || '').localeCompare(String(a.published_at || '')) || a.title.localeCompare(b.title, 'zh-CN');
      return sort?.value === 'oldest' ? -result : result;
    });
    const shown = mode === 'home' ? items.slice(0, 3) : items.slice(0, limit);
    list.replaceChildren(...shown.map(card));
    if (count) count.textContent = mode === 'home' ? '已发布 ' + articles.length + ' 篇' : (query || selected ? '找到 ' + items.length + ' 篇 / 共 ' + articles.length + ' 篇' : '共 ' + articles.length + ' 篇文章');
    if (empty) empty.hidden = items.length !== 0;
    if (more) more.hidden = shown.length >= items.length;
  }
  fetch(new URL('manifest.json', base)).then(r => {
    if (!r.ok) throw new Error('Article index unavailable');
    return r.json();
  }).then(data => {
    if (!Array.isArray(data.articles)) throw new Error('Invalid article index');
    articles = data.articles.filter(a => a && a.title && articleURL(a));
    if (!articles.length) return;
    if (domain) {
      [...new Set(articles.map(a => a.domain).filter(Boolean))].sort().forEach(value => {
        const option = node('option', '', value);
        option.value = value;
        domain.append(option);
      });
    }
    const controls = document.querySelector('#article-controls');
    if (controls) controls.hidden = false;
    render();
    search?.addEventListener('input', () => { limit = 12; render(); });
    domain?.addEventListener('change', () => { limit = 12; render(); });
    sort?.addEventListener('change', () => { limit = 12; render(); });
    more?.addEventListener('click', () => { limit += 12; render(); });
    document.querySelector('#article-reset')?.addEventListener('click', () => {
      search.value = '';
      domain.value = '';
      limit = 12;
      render();
      search.focus();
    });
  }).catch(() => {
    if (count) count.textContent = '文章列表暂未刷新，仍可阅读下方文章。';
  });
})();
