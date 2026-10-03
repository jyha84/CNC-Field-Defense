from pathlib import Path
from urllib.parse import quote
import random,math
P=Path(__file__).resolve().parent
rng=random.Random(1981);W,H=480,360
parts=['<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360"><defs><filter id="soft" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="1.8"/></filter></defs><rect width="480" height="360" fill="#666947"/><g filter="url(#soft)">']
# Closed cubic curves, wrapped at every edge, create a seamless organic woodland surface.
for color,count,rx,ry in [('#38482e',13,86,42),('#6b5035',9,66,32),('#202a20',12,59,19),('#4d5c38',6,38,18)]:
 for _ in range(count):
  cx,cy=rng.randrange(W),rng.randrange(H);rot=rng.random()*math.tau;pts=[]
  for k in range(14):
   a=k/14*math.tau;s=rng.uniform(.58,1.22);x=math.cos(a)*rx*s;y=math.sin(a)*ry*s;pts.append((x*math.cos(rot)-y*math.sin(rot)+cx,x*math.sin(rot)+y*math.cos(rot)+cy))
  d=f'M{pts[0][0]:.1f},{pts[0][1]:.1f}'
  for k in range(len(pts)):
   p0,p1,p2,p3=[pts[i%len(pts)] for i in [k-1,k,k+1,k+2]];c1=(p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6);c2=(p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6)
   d+=f'C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}'
  d+='Z'
  for dx in [-W,0,W]:
   for dy in [-H,0,H]:parts.append(f'<path fill="{color}" transform="translate({dx} {dy})" d="{d}"/>')
parts.append('</g></svg>');svg=''.join(parts);(P/'web/woodland-camo.svg').write_text(svg)
# SVG filter softens the texture only; foreground text and sprites stay sharp.
css='''
/* WOODLAND CAMO: a softly blurred, subdued background under the original metal bevels. */
:root{--woodland:url("data:image/svg+xml,__CAMO__")}
body{background-color:#151e15;background-image:linear-gradient(#0c160bc7,#0c160bc7),var(--woodland);background-size:auto,480px 360px}
.topbar{background-image:repeating-linear-gradient(0deg,#ffffff02 0 1px,transparent 1px 3px),linear-gradient(#17211555,#152015aa),var(--woodland);background-size:auto,auto,480px 360px;background-position:0 0,0 0,20px 30px}
.sidebar{background-image:linear-gradient(90deg,#17231172,#17231155),var(--woodland);background-size:auto,430px 323px;background-position:0 0,-70px 0}
.unitpanel{background-image:linear-gradient(#1a271675,#172413ac),var(--woodland);background-size:auto,520px 390px;background-position:0 0,0 -80px}
.statusbar,.missionstrip,.bottom{background-image:linear-gradient(#162214b0,#162214b0),var(--woodland);background-size:auto,500px 375px}
.modalbox{background-image:linear-gradient(#1c2918bd,#1c2918ce),var(--woodland);background-size:auto,520px 390px}
button{background-image:linear-gradient(#526044ab,#23301abf),var(--woodland);background-size:auto,340px 255px}
.productiontabs button.active,button[aria-pressed=true]{background-image:linear-gradient(#172514a8,#364b24b8),var(--woodland);background-size:auto,340px 255px}
.buildcard .unitart,.portrait{background-image:radial-gradient(ellipse,#82915b22,#16261485),linear-gradient(#28381b80,#28381b80),var(--woodland);background-size:auto,auto,300px 225px}
.buildcard:nth-child(2n) .unitart{background-position:0 0,0 0,-65px -50px}
.buildcard:nth-child(3n) .unitart{background-position:0 0,0 0,-150px -90px}
.wavebox{background:#152412e8;box-shadow:inset 0 0 16px #080e0766}
.wavebutton{background-image:linear-gradient(#857646ca,#554d29dc),var(--woodland);background-size:auto,320px 240px}
.counter{background:#0c1a0beb}.buildcard .caption{background:#142210ed}.buildcard .typehint{background:#1b2b17e8}
'''.replace('__CAMO__',quote(svg,safe=''))
f=P/'web/template.html';s=f.read_text();start=s.find('/* WOODLAND CAMO:')
if start!=-1:s=s[:start]+s[s.index('</style>',start):]
s=s.replace('</style>',css+'\n</style>');f.write_text(s)
print('Woodland texture applied')
