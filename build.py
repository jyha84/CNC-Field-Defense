from pathlib import Path
import base64,json
P=Path(__file__).resolve().parent
html=(P/'web/template.html').read_text();font=P/'web/field-ui.woff';fontcss="@font-face{font-family:'Field UI';src:url(data:font/woff;base64,"+base64.b64encode(font.read_bytes()).decode()+") format('woff');font-display:swap;}" if font.exists() else ''
for key,data in [('FONT',fontcss),('ASSETS',(P/'assets.json').read_text()),('ENGINE',(P/'web/engine.js').read_text()),('APP',(P/'web/app.js').read_text())]:html=html.replace('__'+key+'__',data)
(P/'index.html').write_text(html);(P/'web/index.html').write_text(html);(P/'output/CA_Field_Defense.html').write_text(html)
print('Built',len(html.encode()),'bytes')

android_asset=P/'android/app/src/main/assets/index.html'
if (P/'android').exists():
 android_asset.parent.mkdir(parents=True,exist_ok=True)
 android_asset.write_text(html)
