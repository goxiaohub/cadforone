(() => {
  const widget = document.querySelector('[data-view-counter]');
  if (!widget || !['cadforone.com', 'www.cadforone.com'].includes(location.hostname)) return;
  const show = () => {
    if (document.visibilityState !== 'visible') return;
    document.removeEventListener('visibilitychange', show);
    fetch('/api/views', {
      method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: location.pathname })
    }).then(response => response.ok ? response.json() : Promise.reject())
      .then(counts => {
        if (![counts.site, counts.page].every(n => Number.isSafeInteger(n) && n >= 0)) return;
        widget.querySelector('[data-site-views]').textContent = counts.site.toLocaleString();
        widget.querySelector('[data-page-views]').textContent = counts.page.toLocaleString();
        widget.hidden = false;
      }).catch(() => {});
  };
  if (document.visibilityState === 'visible') show();
  else document.addEventListener('visibilitychange', show);
})();
