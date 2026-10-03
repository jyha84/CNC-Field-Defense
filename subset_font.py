# SPDX-License-Identifier: GPL-3.0-or-later
"""Usage: python subset_font.py /path/to/Galmuri11.woff2 (galmuri 2.40.3)."""
from pathlib import Path
import json, sys
from fontTools import subset
from fontTools.ttLib import TTFont
P=Path(__file__).resolve().parent
font=TTFont(sys.argv[1])
text=''.join((P/name).read_text() for name in ['web/template.html','web/app.js','web/engine.js','web/map.js'])
text+=''.join(u['ko']+u['name'] for u in json.loads((P/'assets.json').read_text())['units'])
options=subset.Options();options.flavor='woff2';options.name_IDs=['*'];options.name_legacy=True;options.name_languages=['*']
s=subset.Subsetter(options=options);s.populate(text=text,unicodes=list(range(32,127)));s.subset(font)
for record in font['name'].names:
 if record.nameID in (1,4,6,16): record.string=('FieldPixel' if record.nameID==6 else 'Field Pixel').encode(record.getEncoding())
font.flavor='woff2';font.save(P/'web/field-pixel.woff2')
