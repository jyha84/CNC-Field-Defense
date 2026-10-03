from pathlib import Path
import json,sys,random,base64,io,math
from PIL import Image
ROOT=Path(__file__).resolve().parent;SRC=ROOT.parent/'ca-atlas';sys.path.insert(0,str(SRC))
from decoder import decode_tmp,decode_any,rgba,S
atlas=json.loads((SRC/'output/CA_Unit_Atlas.html').read_text().split('const DATA=',1)[1].split(';\nconst $=',1)[0])
def uri(im):
 b=io.BytesIO();im.save(b,format='PNG');return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
W,H=768,480;rng=random.Random(1985);path=[[-24,108],[228,108],[228,348],[516,348],[516,180],[720,180]]
def dist(x,y):
 best=999
 for (ax,ay),(bx,by) in zip(path,path[1:]):
  dx,dy=bx-ax,by-ay;t=max(0,min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));best=min(best,math.hypot(x-ax-t*dx,y-ay-t*dy))
 return best
w,h,c,r,fs=decode_tmp(S/'jungle/clear1.jun');grass=[rgba(f,w,h,'temperat.pal') for f in fs];bg=Image.new('RGBA',(W,H))
for y in range(0,H,24):
 for x in range(0,W,24):bg.alpha_composite(rng.choice(grass),(x,y))
def tmp(name):
 w,h,c,r,fs=decode_tmp(S/('jungle/'+name+'.jun'));im=Image.new('RGBA',(w*c,h*r))
 for i,d in enumerate(fs[:c*r]):im.alpha_composite(rgba(d,w,h,'temperat.pal'),(i%c*w,i//c*h))
 return im
road=tmp('d03').crop((0,36,24,48));horizontal=road.transpose(Image.Transpose.ROTATE_90)
for (ax,ay),(bx,by) in zip(path,path[1:]):
 if ay==by:
  for x in range(int(min(ax,bx))-12,int(max(ax,bx)),12):bg.alpha_composite(horizontal,(x,ay-12))
 else:
  for y in range(min(ay,by)-12,max(ay,by),12):bg.alpha_composite(road,(ax-12,y))
# Make dirt continuous at bends using original road pixels, without painting new art.
center=tmp('d03').crop((5,34,19,48))
for x,y in path[1:-1]:bg.alpha_composite(center,(x-7,y-7))
for _ in range(45):
 x,y=rng.randrange(32)*24,rng.randrange(20)*24
 if dist(x+12,y+12)>45:bg.alpha_composite(tmp(rng.choice(['p01','p02','p03','p04'])),(x,y))
objects={}
for name in ['t01','t02','t03','tc01','tc02','tc03','rock1','rock2','rock3']:
 f=S/('temp/'+name+'.tem' if name.startswith('rock') else 'jungle/'+name+'.jun');w,h,fs=decode_any(f);objects[name]=rgba(fs[0],w,h,'temperat.pal')
placements=[]
for _ in range(90):
 x=rng.randrange(12,W-12);y=rng.choice([rng.randrange(30,65),rng.randrange(447,490)])
 if dist(x,y)>50:placements.append((rng.choice(['t01','t02','tc01','tc02','tc03']),x,y))
placements += [('tc03',83,242),('t01',59,270),('tc02',97,287),('rock1',115,379),('tc01',388,209),('rock2',384,237),('t03',426,235),('rock3',660,376),('tc02',710,380),('tc03',667,427),('t01',726,330)]
obstacles=[]
for name,x,y in sorted(placements,key=lambda p:p[2]):
 im=objects[name];bg.alpha_composite(im,(x-im.width//2,y-im.height+12));obstacles.append({'x':x,'y':y-7,'r':max(15,im.width*.36)})
bg.save(ROOT/'output/terrain.png')
# Enemy team-color preview: remap only colors in the TD player-color ramp.
pb=(S/'temperattd.pal').read_bytes();mapping={}
for i in range(176,192):
 col=tuple(v*4 for v in pb[i*3:i*3+3]);lum=max(col)/252;mapping[col]=(int(80+170*lum),int(16+55*lum),int(12+32*lum))
units=atlas['units']
for u in units:
 if u['id'] not in ['n1','bggy','bike','ltnk','htnk','orca']:continue
 u['enemyModes']={}
 for k,m in u['modes'].items():
  im=Image.open(io.BytesIO(base64.b64decode(m['src'].split(',')[1]))).convert('RGBA');im.putdata([mapping.get(p[:3],p[:3])+(p[3],) if p[3] else p for p in im.getdata()]);u['enemyModes'][k]={**m,'src':uri(im)}
selected={u['id']:u for u in json.loads((SRC/'selected.json').read_text())}
for u in units:
 seq=selected[u['id']]['sequence']
 if u['group']!='vehicles' or 'turret' not in seq:continue
 u['layers']={}
 for part in ['idle','turret']:
  q=seq[part];fn=q['Filename']['_v'];w,h,fs=decode_any(S/fn);start=int(q.get('Start',{'_v':'0'})['_v']);sheet=Image.new('RGBA',(w*8,h*4))
  for i in range(32):sheet.alpha_composite(rgba(fs[start+i],w,h,u['palette']),(i%8*w,i//8*h))
  u['layers'][part]={'src':uri(sheet),'w':w,'h':h,'cols':8}
data={'units':units,'terrain':uri(bg),'width':W,'height':H,'path':path,'obstacles':obstacles,'commit':atlas['commit']}
(ROOT/'assets.json').write_text(json.dumps(data,ensure_ascii=False));print('Generated terrain and assets:',len(units),'units')
