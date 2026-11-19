import concurrent.futures, json, re, urllib.request, urllib.parse, xml.etree.ElementTree as ET
from pathlib import Path

catalog = json.loads(Path('static/data/freecad-addons.json').read_text(encoding='utf-8-sig'))
def metadata(entry):
    name, versions = entry
    if not isinstance(versions, list) or not versions:
        return None
    version = versions[0]
    repo = version.get('repository', '')
    url = urllib.parse.urlsplit(repo)
    if url.hostname != 'github.com' or not version.get('git_ref'):
        return None
    base = 'https://raw.githubusercontent.com' + url.path.rstrip('/').removesuffix('.git') + '/' + urllib.parse.quote(version['git_ref'], safe='') + '/'
    try:
        with urllib.request.urlopen(base + 'package.xml', timeout=8) as response:
            root = ET.fromstring(response.read(250000))
        for element in root.iter():
            element.tag = element.tag.rsplit('}', 1)[-1]
        description = root.find('.//description')
        summary = ' '.join(' '.join(description.itertext()).split())[:360] if description is not None else ''
        icon = (root.findtext('.//icon') or '').strip()
        image = base + urllib.parse.quote(icon.removeprefix('./'), safe='/') if re.fullmatch(r'[\w./ -]+\.(svg|png|webp|jpe?g)', icon, re.I) and '..' not in icon.split('/') else ''
        return name, {'repository': repo, 'description': summary, 'image': image}
    except (OSError, ValueError, ET.ParseError):
        return None

with concurrent.futures.ThreadPoolExecutor(max_workers=16) as pool:
    items = dict(item for item in pool.map(metadata, catalog.items()) if item)
Path('static/data/freecad-addon-metadata.json').write_text(json.dumps(items, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(len(items), 'metadata records;', sum(bool(p['image']) for p in items.values()), 'icons')

