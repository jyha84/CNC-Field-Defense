const assert=require('assert'),{create}=require('../web/map'),packs=require('../terrain-pack.json').themes,{Game,pathLength,pathDistance}=require('../web/engine');
for(const pack of Object.values(packs)){
const routes=new Set();
for(let seed=0;seed<2000;seed++){
 const m=create(seed,pack),g=new Game(m);assert.equal(m.theme,pack.id);routes.add(JSON.stringify(m.path));assert.deepStrictEqual(m,create(seed,pack));
 assert.deepStrictEqual(m.path.at(-1),[720,180]);assert.equal(m.path[0][0],-24);assert(pathLength(m.path)>=1008&&pathLength(m.path)<=1296);
 for(let i=1;i<m.path.length;i++){const a=m.path[i-1],b=m.path[i];assert((a[0]===b[0])!==(a[1]===b[1]));assert(b[0]>=a[0]);assert(b[1]>=84&&b[1]<=396)}
 for(const o of m.objects)assert(pathDistance(m.path,o.x,o.cy)>=o.visualRadius+24);
 for(const tower of [...g.towers]){g.towers=g.towers.filter(t=>t!==tower);assert.equal(g.validSpot(tower.x,tower.y),'');g.towers.push(tower)}
 const before=JSON.stringify(g.map.path);g.startWave();assert.equal(JSON.stringify(g.map.path),before);g.spawn({type:'air'});assert.strictEqual(g.enemies[0].path,g.map.path);
 if(seed<20){g.towers=[];g.enemies=[];g.queue=[];g.spawn({type:'air'});const e=g.enemies[0];let ticks=0;while(g.phase==='wave'&&ticks++<1500){g.update(.05);assert(pathDistance(m.path,e.x,e.y)<1e-6)}assert.equal(g.lives,18);assert.equal(g.phase,'intermission')}
}
assert(routes.size>1000);console.log('PASS 2000 seeds: varied, deterministic, bounded non-crossing routes, clear artwork, legal defenders; 20 full Orca paths.');

console.log("Theme:",pack.id);
}
