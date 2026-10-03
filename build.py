# SPDX-License-Identifier: GPL-3.0-or-later
from pathlib import Path
import base64, re, shutil
from urllib.parse import quote
P = Path(__file__).resolve().parent
template = (P / 'web/template.html').read_text()
font = '@font-face{font-family:"Field UI";src:url(data:font/woff;base64,' + base64.b64encode((P / 'web/field-ui.woff').read_bytes()).decode() + ') format("woff");font-display:swap;}'
pixel = '@font-face{font-family:"Field Pixel";src:url(data:font/woff2;base64,' + base64.b64encode((P / 'web/field-pixel.woff2').read_bytes()).decode() + ') format("woff2");font-display:swap;}'
parts = {'FONT': font + pixel, 'ASSETS': (P / 'assets.json').read_text(),
         'TERRAIN': (P / 'terrain-pack.json').read_text(), 'AUDIO': (P / 'audio-pack.json').read_text(),
         'ENGINE': (P / 'web/engine.js').read_text(), 'MAP': (P / 'web/map.js').read_text(),
         'SOUND': (P / 'web/audio.js').read_text(), 'APP': (P / 'web/app.js').read_text()}
offline = template.replace('url("woodland-camo.svg")', 'url("data:image/svg+xml,' + quote((P / 'web/woodland-camo.svg').read_text()) + '")')
for key, value in parts.items(): offline = offline.replace('__' + key + '__', value)
(P / 'output').mkdir(exist_ok=True)
(P / 'output/CA_Field_Defense.html').write_text(offline)
# Pages caches stable artwork independently from gameplay code.
css = re.search(r'<style>(.*?)</style>', template, re.S).group(1)
css = css.replace('__FONT__', '@font-face{font-family:"Field UI";src:url("field-ui.woff") format("woff");font-display:swap;}@font-face{font-family:"Field Pixel";src:url("field-pixel.woff2") format("woff2");font-display:swap;}')
css = re.sub(r'url\("data:image/svg\+xml,[^"]+"\)', 'url("woodland-camo.svg")', css)
(P / 'web/styles.css').write_text(css)
page = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="__BASE__styles.css?v=0.3.1">', template, flags=re.S)
page = re.sub(r'<script>const ASSETS=.*?</script><script>__ENGINE__</script><script>__MAP__</script><script>__SOUND__</script><script>__APP__</script>', '<script src="__BASE__bootstrap.js?v=0.3.1"></script>', page, flags=re.S)
(P / 'index.html').write_text(page.replace('__BASE__', 'web/'))
(P / 'web/index.html').write_text(page.replace('__BASE__', './'))
# WebViewAssetLoader serves the same static layout without a network connection.
android = P / 'android/app/src/main/assets'
if (P / 'android').exists():
    (android / 'web').mkdir(parents=True, exist_ok=True)
    for name in ['index.html', 'assets.json', 'terrain-pack.json', 'audio-pack.json']: shutil.copyfile(P / name, android / name)
    for name in ['styles.css', 'bootstrap.js', 'engine.js', 'map.js', 'audio.js', 'app.js', 'field-ui.woff', 'field-pixel.woff2', 'woodland-camo.svg']: shutil.copyfile(P / 'web' / name, android / 'web' / name)
print('Built Pages, Android assets and standalone HTML:', len(offline.encode()), 'bytes offline')
