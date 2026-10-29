(function () {
  function initSearch() {
    const input = document.getElementById('searchbar');
    const results = document.getElementById('search-results');
    if (!input || !results) return;
    let posts = [];
    let loaded = false;
    const english = document.body.dataset.lang === 'en';
    results.setAttribute('aria-live', 'polite');
    function render() {
      results.replaceChildren();
      const words = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
      results.hidden = words.length === 0;
      results.classList.toggle('hidden', words.length === 0);
      if (!words.length || !loaded) return;
      const matches = posts.filter(post => {
        const text = `${post.title} ${post.content}`.toLocaleLowerCase();
        return words.every(word => text.includes(word));
      }).sort((a, b) => {
        const score = post => (post.title.toLocaleLowerCase().includes(input.value.trim().toLocaleLowerCase()) ? 10 : 0) + words.reduce((total, word) => total + Number(post.title.toLocaleLowerCase().includes(word)), 0);
        return score(b) - score(a);
      }).slice(0, 10);
      if (!matches.length) {
        const message = document.createElement('p');
        message.className = 'text-sm text-text-muted';
        message.textContent = english ? 'No matching articles.' : 'Nenhum artigo encontrado.';
        results.append(message);
      }
      for (const post of matches) {
        const link = document.createElement('a');
        link.className = 'block rounded-xl border border-border bg-surface px-4 py-3 no-underline';
        link.href = post.url;
        const title = document.createElement('div');
        title.className = 'text-sm text-text';
        title.textContent = post.title;
        const date = document.createElement('div');
        date.className = 'mt-1 text-xs text-text-muted';
        date.textContent = post.date;
        link.append(title, date);
        results.append(link);
      }
    }
    input.addEventListener('input', render);
    render();
    fetch(input.dataset.searchIndex || '/search.json')
      .then(response => { if (!response.ok) throw Error('Search unavailable'); return response.json(); })
      .then(data => { posts = data; loaded = true; render(); })
      .catch(() => {
        // The complete article list remains usable when search is unavailable.
        input.hidden = true;
        results.hidden = true;
      });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSearch, {once: true});
  else initSearch();
})();
