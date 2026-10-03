const assert=require('assert'),fs=require('fs'),{Game,pathDistance,pathLength}=require('../web/engine.js');
const map=JSON.parse(fs.readFileSync(__dirname+'/../assets.json'));
const game=new Game(map);game.towers=[];game.wave=4;game.phase='wave';game.spawn({type:'air'});const orca=game.enemies[0];
assert.equal(orca.air,true);assert.deepEqual(orca.path,map.path);assert.equal(orca.total,pathLength(map.path));
const visited=new Set();let ticks=0;
while(game.phase==='wave'&&ticks++<2000){game.update(.05);assert(pathDistance(map.path,orca.x,orca.y)<.000001,'Orca left the shared route');if(orca.x<225)assert.equal(orca.y,108,'Incorrect entry lane');if(Math.abs(orca.x-228)<.001&&orca.y>120&&orca.y<330)visited.add('south');if(orca.y===348&&orca.x>260&&orca.x<490)visited.add('east');if(Math.abs(orca.x-516)<.001&&orca.y>195&&orca.y<330)visited.add('north')}
assert.deepEqual([...visited],['south','east','north']);assert.equal(game.lives,18);assert.equal(game.phase,'intermission');
for(const [type,shouldFire] of [['n1',false],['n3',true]]){const g=new Game(map);g.towers=[];const t=g.addTower(type,276,156,true).tower;t.cooldown=0;g.wave=4;g.phase='wave';g.spawn({type:'air'});g.enemies[0].d=300;g.update(.01);assert.equal(g.projectiles.length>0,shouldFire,'Air targeting changed')}
console.log('PASS: Orca enters with ground units, follows all bends, reaches shared exit; anti-air restriction preserved.');
