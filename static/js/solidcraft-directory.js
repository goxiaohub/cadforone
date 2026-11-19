(async () => {
  const root = document.querySelector('[data-plugin-directory]');
  if (!root) return;
  const search = root.querySelector('input');
  const filter = root.querySelector('[data-filter]');
  const sort = root.querySelector('[data-sort]');
  const status = root.querySelector('[data-status]');
  const results = root.querySelector('[data-results]');
  const freecad = root.hasAttribute("data-freecad");
  const freecadFeed = "https://raw.githubusercontent.com/FreeCAD/FreeCAD-addons/master/AddonCatalog.json";
  const feed = freecad ? freecadFeed : "https://raw.githubusercontent.com/tharje/solidcraft-plugins/main/data/plugins.json";
  const snapshot = new URL(freecad ? "../data/freecad-addons.json" : "../data/solidcraft-plugins.json", document.currentScript.src);
  async function load(url) {
    const response = await fetch(url, { credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Directory unavailable');
    let data = await response.json();
    if (freecad) {
      const plugins = Object.entries(data).flatMap(([name, versions]) =>
        Array.isArray(versions) && versions[0]?.repository
          ? [{ name, url: versions[0].repository, version: versions[0].git_ref, minimum: versions[0].freecad_min }]
          : []);
      data = { plugins };
    }
    if (!Array.isArray(data.plugins) || !data.plugins.length) throw new Error('Invalid directory');
    return data;
  }
  function allowed(value, hosts) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && hosts.includes(url.hostname) && !url.username && !url.password ? url.href : null;
    } catch { return null; }
  }
  function element(tag, value) {
    const node = document.createElement(tag);
    if (value) node.textContent = value;
    return node;
  }
  function link(label, url) {
    const a = element('a', label);
    a.href = url;
    a.rel = 'noreferrer';
    return a;
  }
  let cached = false;
  const data = await load(feed).catch(() => { cached = true; return load(snapshot); }).catch(() => null);
  if (!data) {
    status.replaceChildren(link('Browse the community directory', freecad ? "https://github.com/FreeCAD/FreeCAD-addons/blob/master/AddonCatalog.json" : "https://tharje.github.io/solidcraft-plugins/"));
    return;
  }
  const plugins = data.plugins.filter(p => p && typeof p.name === 'string' && allowed(p.url, freecad ? ['github.com', 'gitlab.com', 'codeberg.org', 'framagit.org', 'git.freecad.org', 'salsa.debian.org'] : ['github.com']));
  const tags = p => [...(Array.isArray(p.topics) ? p.topics : []), p.category].filter(t => typeof t === 'string' && t !== 'solidcraft-plugin');
  if (filter) for (const tag of [...new Set(plugins.flatMap(tags))].sort()) filter.add(new Option(tag, tag));
  function card(p) {
    const item = element('article');
    const source = allowed(p.url, freecad ? ['github.com', 'gitlab.com', 'codeberg.org', 'framagit.org', 'git.freecad.org', 'salsa.debian.org'] : ['github.com']);
    const preview = allowed(p.image, ['raw.githubusercontent.com', 'github.com', 'user-images.githubusercontent.com']);
    if (preview) {
      const img = element('img');
      img.alt = '';
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.addEventListener('error', () => img.remove());
      img.src = preview;
      item.append(img);
    }
    item.append(element('h2', p.name), element('p', [p.owner, p.release?.tag || p.version, p.category].filter(Boolean).join(' · ')));
    item.append(element('p', p.minimum ? 'Minimum FreeCAD version for this branch: ' + p.minimum : (p.description || 'See the repository for details.')));
    const repo = link(freecad ? 'Add-on repository' : 'GitHub repository', source);
    const zip = allowed(p.release?.zip, ['github.com']);
    item.append(repo);
    if (zip && new URL(zip).pathname.startsWith('/' + p.repo + '/releases/download/') && new URL(zip).pathname.toLowerCase().endsWith('.zip')) {
      item.append(link('Download ZIP', zip));
    }
    return item;
  }
  function render() {
    const query = search.value.trim().toLowerCase();
    const matches = plugins.filter(p => (!filter?.value || tags(p).includes(filter.value)) &&
      [p.name, p.description, p.owner, p.url, ...tags(p)].join(' ').toLowerCase().includes(query));
    const date = p => Date.parse(p.release?.date || p.updated || '') || 0;
    matches.sort((a, b) => {
      if (freecad || sort.value === 'name') return a.name.localeCompare(b.name);
      if (sort.value === 'stars' || sort.value === 'downloads') return (Number(b[sort.value]) || 0) - (Number(a[sort.value]) || 0);
      return date(b) - date(a);
    });
    const updated = typeof data.generated === 'string' ? data.generated.slice(0, 10) : '';
    status.textContent = [matches.length + ' of ' + plugins.length + ' entries', updated && 'Index date: ' + updated, cached && 'Saved snapshot'].filter(Boolean).join(' · ');
    results.replaceChildren(...matches.map(card));
  }
  search.addEventListener('input', render);
  filter?.addEventListener('change', render);
  sort?.addEventListener('change', render);
  render();
})();
