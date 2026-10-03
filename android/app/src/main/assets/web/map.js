// SPDX-License-Identifier: GPL-3.0-or-later
(function(root){'use strict';
const {pathLength,pathDistance,pointAt}=typeof module!=='undefined'&&module.exports?require('./engine.js'):root.FieldDefense;
function random(seed){let state=seed>>>0;return()=>{state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296}}
function create(seed,pack){
 const rng=random(seed),pick=a=>a[Math.floor(rng()*a.length)],integer=(a,b)=>a+Math.floor(rng()*(b-a+1));
 const high=[84,108,132,156],low=[300,324,348,372,396];
 let path;
 // Strictly increasing columns prevent crossings; bounded length keeps travel time comparable.
 for(let attempt=0;attempt<100;attempt++){
  const upper=rng()<.5,entry=pick(upper?high:low),lanes=rng()<.5?2:3;
  const columns=lanes===2?[pick([180,204,228,252,276]),pick([468,492,516,540,564])]:[pick([156,180,204]),pick([324,348,372]),pick([516,540,564])];
  path=[[-24,entry]];let y=entry;
  columns.forEach((x,i)=>{path.push([x,y]);y=i===columns.length-1?180:pick((upper===(i%2===0))?low:high);path.push([x,y])});
  path.push([720,180]);const length=pathLength(path);if(length>=1008&&length<=1296)break;
  path=null;
 }
 if(!path)path=[[-24,108],[228,108],[228,348],[516,348],[516,180],[720,180]];
 const map={seed:seed>>>0,theme:pack.id||'jungle',path,width:768,height:480,obstacles:[{x:716,y:266,r:28},{x:684,y:90,r:28}],objects:[],patches:[],grass:[],defenders:[]};
 for(let i=0;i<32*20;i++)map.grass.push(integer(0,pack.grass.length-1));
 for(let i=0;i<40;i++){const x=integer(0,31)*24,y=integer(0,19)*24;if(pathDistance(path,x+24,y+24)>65)map.patches.push({x,y,tile:integer(0,pack.patches.length-1)})}
 const free=(x,y,r)=>Math.hypot(x-710,y-180)>r+66&&map.obstacles.every(o=>Math.hypot(x-o.x,y-o.y)>r+o.r+12);
 for(let i=0;i<200;i++){
  const edge=i<120,name=pick(edge?['t01','t02','tc01','tc02','tc03']:Object.keys(pack.objects)),art=pack.objects[name];
  const x=integer(18,750),y=edge?pick([integer(25,59),integer(457,490)]):integer(96,420),cy=y-art.h/2+12,visualRadius=Math.hypot(art.w/2,art.h/2);
  // Reserve the whole sprite footprint, not only its trunk, around the road and base.
  if(pathDistance(path,x,cy)<visualRadius+24||!free(x,cy,visualRadius))continue;
  const o={name,x,y,r:Math.max(15,art.w*.36),cy,visualRadius};map.objects.push(o);map.obstacles.push({x,y:y-7,r:o.r});
  if(!edge&&map.objects.filter(o=>o.y>=96&&o.y<=420).length>=12)break;
 }
 map.objects.sort((a,b)=>a.y-b.y);
 for(const [type,fraction] of [['gtwr',.28],['n3',.68]]){
  const target=pointAt(path,pathLength(path)*fraction),spots=[];
  for(let y=84;y<=420;y+=24)for(let x=36;x<=732;x+=24){const distance=pathDistance(path,x,y);if(distance<36||distance>78||!free(x,y,10)||map.defenders.some(t=>Math.hypot(x-t.x,y-t.y)<40))continue;spots.push({x,y,score:Math.hypot(x-target.x,y-target.y)})}
  spots.sort((a,b)=>a.score-b.score);
  if(!spots.length)throw new Error('기본 수비대 배치 위치를 찾지 못했습니다.');
  map.defenders.push({type,x:spots[0].x,y:spots[0].y});
 }
 return map;
}
const api={create,random};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Battlefields=api;
})(typeof globalThis!=='undefined'?globalThis:this);
