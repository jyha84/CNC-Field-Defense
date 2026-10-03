// SPDX-License-Identifier: GPL-3.0-or-later
/* C&C Field Defense prototype. Original game logic; balance is specific to this prototype. */
(function(root){'use strict';
const TYPES={
 n1:{name:'소총병',cost:100,range:102,damage:11,interval:.5,kind:'bullet',power:1,unlock:0,air:false,desc:'초반 보병을 막는 저비용 수비대'},
 n2:{name:'수류탄병',cost:180,range:110,damage:28,interval:1.35,kind:'grenade',splash:29,power:1,unlock:0,air:false,desc:'폭발 범위 29 · 밀집 보병 대응'},
 n3:{name:'로켓 보병',cost:250,range:135,damage:42,interval:1.55,kind:'rocket',power:1,unlock:0,air:true,desc:'대전차 · 대공 / 4차 공습 대비'},
 hmmv:{name:'험비',cost:350,range:115,damage:16,interval:.29,kind:'bullet',power:2,unlock:0,air:false,desc:'빠른 연사로 보병·바이크 제압'},
 mtnk:{name:'배틀 탱크',cost:600,range:135,damage:85,interval:1.65,kind:'shell',splash:15,power:3,unlock:1,air:false,desc:'장갑 표적에 강한 주력 전차'},
 msam:{name:'다연장 로켓',cost:750,range:166,damage:61,interval:1.22,kind:'rocket',splash:26,power:3,unlock:2,air:true,desc:'장거리 범위 공격 · 대공 가능'},
 htnk:{name:'매머드 탱크',cost:1200,range:149,damage:130,interval:1.4,kind:'shell',splash:23,power:4,unlock:4,air:false,desc:'강한 장갑 관통 화력 · 중장갑 대응'},
 gtwr:{name:'가드 타워',cost:400,range:119,damage:22,interval:.34,kind:'bullet',power:2,unlock:0,air:false,desc:'보병에게 강한 고정 방어 시설'},
 atwr:{name:'고급 가드 타워',cost:900,range:175,damage:90,interval:1.2,kind:'rocket',splash:20,power:4,unlock:3,air:true,desc:'넓은 사거리 · 지상과 공중 대응'},
 obli:{name:'오벨리스크',cost:1400,range:181,damage:295,interval:2.5,kind:'laser',power:5,unlock:6,air:false,desc:'장갑을 무시하는 고위력 레이저'}
};
const ENEMIES={rifle:{sprite:'n1',hp:68,speed:37,bounty:19,armor:0,leak:1},buggy:{sprite:'bggy',hp:160,speed:49,bounty:34,armor:.18,leak:1},bike:{sprite:'bike',hp:120,speed:69,bounty:30,armor:.08,leak:1},tank:{sprite:'ltnk',hp:410,speed:29,bounty:60,armor:.6,leak:2},heavy:{sprite:'htnk',hp:680,speed:23,bounty:125,armor:.7,leak:3},air:{sprite:'orca',hp:190,speed:46,bounty:46,armor:.12,leak:2,air:true}};
const WAVE_TYPES=[['rifle'],['rifle','buggy'],['rifle','bike','buggy'],['rifle','air','bike'],['tank','rifle','buggy'],['bike','tank','air'],['tank','heavy','rifle'],['air','bike','tank'],['heavy','tank','air'],['bike','heavy','tank'],['air','heavy','tank'],['heavy','tank','air','bike']];
function pointAt(path,d){for(let i=1;i<path.length;i++){let [ax,ay]=path[i-1],[bx,by]=path[i],len=Math.hypot(bx-ax,by-ay);if(d<=len)return{x:ax+(bx-ax)*d/len,y:ay+(by-ay)*d/len,angle:Math.atan2(by-ay,bx-ax)};d-=len}const p=path.at(-1);return{x:p[0],y:p[1],angle:0}}
function pathLength(path){let s=0;for(let i=1;i<path.length;i++)s+=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]);return s}
function pathDistance(path,x,y){let min=Infinity;for(let i=1;i<path.length;i++){const [a,b]=[path[i-1],path[i]],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));min=Math.min(min,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t))}return min}
class Game{
 constructor(map){this.map=map;this.reset()}
 reset(){this.credits=1500;this.lives=20;this.maxLives=20;this.wave=0;this.cleared=0;this.phase='ready';this.paused=false;this.speed=1;this.capacity=28;this.towers=[];this.enemies=[];this.projectiles=[];this.effects=[];this.events=[];this.kills=0;this.time=0;this.uid=1;this.spawnTimer=0;this.queue=[];this.waveKills=0;this.powerPlants=0;this.maxWaves=12;for(const t of this.map.defenders||[{type:'gtwr',x:276,y:156},{type:'n3',x:468,y:300}])this.addTower(t.type,t.x,t.y,true);this.emit('status','기본 수비대 배치 완료. 추가 유닛을 배치하고 진격을 시작하세요.')}
 emit(type,text,extra={}){this.events.push({type,text,...extra});if(this.events.length>60)this.events.shift()}
 get power(){return this.towers.reduce((s,t)=>s+TYPES[t.type].power,0)}
 stats(t){const a=TYPES[t.type],l=t.level-1;return{...a,damage:Math.round(a.damage*(1+.58*l)),range:a.range+11*l,interval:a.interval/(1+.12*l)}}
 validSpot(x,y){if(x<36||x>732||y<72||y>432)return'전장 안쪽에 배치하세요.';if(pathDistance(this.map.path,x,y)<29)return'적 이동 경로에는 배치할 수 없습니다.';if(Math.hypot(x-710,y-180)<58)return'사령부 주변은 비워 두세요.';if(this.map.obstacles.some(o=>Math.hypot(x-o.x,y-o.y)<o.r+10))return'나무·바위가 있는 위치입니다.';if(this.towers.some(t=>Math.hypot(x-t.x,y-t.y)<28))return'다른 유닛과 너무 가깝습니다.';return''}
 canBuild(type,x,y){const a=TYPES[type];if(!a)return'알 수 없는 유닛입니다.';if(['lost','won'].includes(this.phase))return'작전이 종료되었습니다.';if(this.cleared<a.unlock)return`${a.unlock}차 웨이브를 막으면 해금됩니다.`;if(this.credits<a.cost)return'크레딧이 부족합니다.';if(this.power+a.power>this.capacity)return'전력이 부족합니다. 발전소를 증설하세요.';return this.validSpot(x,y)}
 addTower(type,x,y,free=false){if(!free){const error=this.canBuild(type,x,y);if(error)return{ok:false,error};this.credits-=TYPES[type].cost}const t={id:this.uid++,type,x,y,level:1,cooldown:.15,face:Math.PI,attack:0,spent:free?0:TYPES[type].cost,kills:0};this.towers.push(t);if(!free)this.emit('build',TYPES[type].name+' 배치 완료');return{ok:true,tower:t}}
 upgradeCost(t){return Math.round(TYPES[t.type].cost*.65*t.level)}
 upgrade(id){const t=this.towers.find(t=>t.id===id);if(!t||t.level>=3||['lost','won'].includes(this.phase))return false;const c=this.upgradeCost(t);if(this.credits<c){this.emit('error','업그레이드 크레딧이 부족합니다.');return false}this.credits-=c;t.spent+=c;t.level++;this.emit('build',TYPES[t.type].name+' 강화 Lv.'+t.level);return true}
 sell(id){const i=this.towers.findIndex(t=>t.id===id);if(i<0||['lost','won'].includes(this.phase))return false;const t=this.towers[i],refund=Math.floor(t.spent*.7);this.credits+=refund;this.towers.splice(i,1);this.emit('build',`철수 완료 · $${refund} 회수`);return true}
 addPower(){if(this.credits<250||['lost','won'].includes(this.phase))return false;this.credits-=250;this.capacity+=8;this.powerPlants++;this.emit('build','발전소 증설 · 전력 +8');return true}
 repair(){if(this.credits<220||this.lives>=20||['lost','won'].includes(this.phase))return false;this.credits-=220;this.lives=Math.min(20,this.lives+4);this.emit('build','사령부 수리 · 내구도 +4');return true}
 preview(){return WAVE_TYPES[Math.min(this.wave,11)]}
 startWave(){if(this.paused||!['ready','intermission'].includes(this.phase))return false;this.wave++;this.phase='wave';this.waveKills=0;this.spawnTimer=.6;const choices=WAVE_TYPES[this.wave-1];this.queue=Array.from({length:9+this.wave*2},(_,i)=>({type:choices[i%choices.length],boss:this.wave===12&&i===0}));if(this.wave===12)this.queue[0]={type:'heavy',boss:true};this.emit('wave',`${this.wave}차 웨이브 진입`);return true}
 spawn(item){const def=ENEMIES[item.type],hp=Math.round(def.hp*(1+.16*(this.wave-1))*(item.boss?2:1)),path=this.map.path;const e={...def,id:this.uid++,type:item.type,hp,maxHp:hp,d:0,path,total:pathLength(path),...pointAt(path,0),boss:item.boss,flash:0};this.enemies.push(e)}
 hurt(e,amount,kind,owner){if(e.hp<=0)return;const armor=kind==='laser'?0:kind==='bullet'?e.armor: e.armor*.28;e.hp-=Math.max(1,amount*(1-armor));e.flash=.09;if(e.hp<=0){this.credits+=e.bounty;this.kills++;this.waveKills++;if(owner)owner.kills++;this.effects.push({kind:'explosion',x:e.x,y:e.y,age:0,duration:.45,r:e.boss?30:15});this.emit('kill','',{x:e.x,y:e.y,bounty:e.bounty,enemyType:e.type})}}
 impact(p){if(p.kind!=='bullet')this.emit('impact','',{x:p.tx});const alive=this.enemies.filter(e=>e.hp>0);if(p.splash){for(const e of alive)if(!!e.air===!!p.air&&Math.hypot(e.x-p.tx,e.y-p.ty)<=p.splash)this.hurt(e,p.damage*(e.id===p.target?1:.7),p.kind,p.owner)}else{const target=alive.find(e=>e.id===p.target);if(target)this.hurt(target,p.damage,p.kind,p.owner)}this.effects.push({kind:p.kind==='bullet'?'spark':'explosion',x:p.tx,y:p.ty,age:0,duration:.28,r:p.splash||6})}
 update(dt){if(this.paused||['won','lost'].includes(this.phase))return;dt=Math.min(dt,.05)*this.speed;this.time+=dt;for(const t of this.towers)t.attack=Math.max(0,t.attack-dt);for(const f of this.effects)f.age+=dt;this.effects=this.effects.filter(f=>f.age<f.duration);if(this.phase!=='wave')return;
 this.spawnTimer-=dt;if(this.queue.length&&this.spawnTimer<=0){this.spawn(this.queue.shift());this.spawnTimer= Math.max(.5,1.05-this.wave*.027)}
 for(const e of this.enemies){if(e.hp<=0)continue;e.d+=e.speed*dt;e.flash=Math.max(0,e.flash-dt);Object.assign(e,pointAt(e.path,e.d));if(e.d>=e.total){e.hp=0;e.escaped=true;this.lives=Math.max(0,this.lives-e.leak);this.emit('leak','사령부 피격 · 내구도 -'+e.leak);this.effects.push({kind:'explosion',x:715,y:180,age:0,duration:.7,r:40})}}
 if(this.lives<=0){this.phase='lost';this.emit('end','사령부가 함락되었습니다.');return}
 for(const t of this.towers){t.cooldown-=dt;if(t.cooldown>0)continue;const a=this.stats(t);let target=null,best=-1;for(const e of this.enemies){if(e.hp<=0||e.air&&!a.air||Math.hypot(e.x-t.x,e.y-t.y)>a.range)continue;const score=e.d/e.total;if(score>best){target=e;best=score}}if(!target)continue;t.face=Math.atan2(target.y-t.y,target.x-t.x);t.cooldown=a.interval;t.attack=.28;const p={kind:a.kind,owner:t,x:t.x,y:t.y-6,sx:t.x,sy:t.y-6,tx:target.x,ty:target.y,target:target.id,damage:a.damage,splash:a.splash||0,air:target.air,speed:a.kind==='bullet'?620:a.kind==='rocket'?235:300,age:0};if(a.kind==='laser'){this.hurt(target,a.damage,a.kind,t);this.effects.push({...p,kind:'laser',age:0,duration:.19})}else this.projectiles.push(p);this.emit('shot','',{kind:a.kind,x:t.x})}
 for(const p of this.projectiles){p.age+=dt;const target=this.enemies.find(e=>e.id===p.target&&e.hp>0);if(target&&p.kind==='rocket'){p.tx=target.x;p.ty=target.y}const dx=p.tx-p.x,dy=p.ty-p.y,d=Math.hypot(dx,dy),step=p.speed*dt;if(d<=step||p.age>3){this.impact(p);p.done=true}else{p.x+=dx/d*step;p.y+=dy/d*step}}
 this.projectiles=this.projectiles.filter(p=>!p.done);this.enemies=this.enemies.filter(e=>e.hp>0);
 if(!this.queue.length&&!this.enemies.length&&!this.projectiles.length){this.cleared=this.wave;const bonus=200+this.wave*50;this.credits+=bonus;this.phase=this.wave===this.maxWaves?'won':'intermission';this.emit('clear',`${this.wave}차 방어 성공 · 보급 $${bonus}`);if(this.phase==='won')this.emit('end','12차 웨이브 방어 성공!')}
 }
}
const api={Game,TYPES,ENEMIES,WAVE_TYPES,pointAt,pathLength,pathDistance};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FieldDefense=api;
})(typeof globalThis!=='undefined'?globalThis:this);
