# SPDX-License-Identifier: GPL-3.0-or-later
"""Extract reusable CAmod tiles using the same decoder/source as make_assets.py."""
from pathlib import Path
import base64, io, json, sys
from PIL import Image

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT.parent / 'ca-atlas'))
from decoder import decode_tmp, decode_any, rgba, S

def uri(im):
    data = io.BytesIO()
    im.save(data, format='PNG')
    return 'data:image/png;base64,' + base64.b64encode(data.getvalue()).decode()

REVISION = 'b67e287461c4e1086a3ba46d8c0dcb1bb4dd6748'

def tile(name, folder, ext, palette):
    w, h, cols, rows, frames = decode_tmp(S / f'{folder}/{name}.{ext}')
    im = Image.new('RGBA', (w * cols, h * rows))
    for i, frame in enumerate(frames[:cols * rows]):
        im.alpha_composite(rgba(frame, w, h, palette), (i % cols * w, i // cols * h))
    return im

def theme(folder, ext, palette, label):
    w, h, _, _, frames = decode_tmp(S / f'{folder}/clear1.{ext}')
    road = tile('d03', folder, ext, palette).crop((0, 36, 24, 48))
    objects = {}
    names = ['t01', 't02', 't03', 'tc01', 'tc02', 'tc03']
    if folder == 'jungle': names += ['rock1', 'rock2', 'rock3']
    for name in names:
        file = S / ('temp/' + name + '.tem' if name.startswith('rock') else f'{folder}/{name}.{ext}')
        w1, h1, fs = decode_any(file)
        objects[name] = {'src': uri(rgba(fs[0], w1, h1, palette)), 'w': w1, 'h': h1}
    return {'id': folder, 'label': label, 'revision': REVISION,
            'source': f'mods/ca/bits/{folder}', 'palette': f'mods/ca/bits/{palette}',
            'grass': [uri(rgba(f, w, h, palette)) for f in frames],
            'roadV': uri(road), 'roadH': uri(road.transpose(Image.Transpose.ROTATE_90)),
            'bend': uri(tile('d03', folder, ext, palette).crop((5, 34, 19, 48))),
            'patches': [uri(tile(n, folder, ext, palette)) for n in ['p01', 'p02', 'p03', 'p04']], 'objects': objects}

def build_terrain_pack():
    pack = {'themes': {'jungle': theme('jungle', 'jun', 'temperat.pal', '정글'),
                       'winter': theme('winter', 'win', 'winter/winter.pal', '겨울')}}
    (ROOT / 'terrain-pack.json').write_text(json.dumps(pack, separators=(',', ':')))
    return pack

if __name__ == '__main__':
    build_terrain_pack()
