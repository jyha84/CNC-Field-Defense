# SPDX-License-Identifier: GPL-3.0-or-later
"""Convert selected CAmod Westwood AUD effects to browser-readable MP3."""
from pathlib import Path
import base64, hashlib, json, subprocess, tempfile, urllib.request

ROOT = Path(__file__).resolve().parent
REV = 'b67e287461c4e1086a3ba46d8c0dcb1bb4dd6748'
SOUNDS = {'bullet': 'mgun2.aud', 'rocket': 'bazook1.aud', 'shell': 'tnkfire3.aud',
          'laser': 'tnklaser.aud', 'impact': 'xplosml2.aud', 'destroy': 'xplobig4.aud'}

def build_audio_pack():
    pack = {}
    with tempfile.TemporaryDirectory() as directory:
        for key, filename in SOUNDS.items():
            source = 'mods/ca/bits/audio/' + filename
            data = urllib.request.urlopen('https://raw.githubusercontent.com/Inq8/CAmod/' + REV + '/' + source, timeout=30).read()
            aud, mp3 = Path(directory) / filename, Path(directory) / (key + '.mp3')
            aud.write_bytes(data)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(aud), '-ac', '1', '-ar', '22050', '-b:a', '48k', str(mp3)], check=True)
            pack[key] = {'src': 'data:audio/mpeg;base64,' + base64.b64encode(mp3.read_bytes()).decode(),
                         'source': source, 'revision': REV, 'sourceSha256': hashlib.sha256(data).hexdigest()}
    (ROOT / 'audio-pack.json').write_text(json.dumps(pack, separators=(',', ':')))
    return pack

if __name__ == '__main__':
    build_audio_pack()
