// SPDX-License-Identifier: GPL-3.0-or-later
(async()=>{
 const base=new URL('.',document.currentScript.src),version='?v=0.3.1';
 try{
  const packs=await Promise.all(['assets','terrain-pack','audio-pack'].map(async name=>{const response=await fetch(new URL('../'+name+'.json'+version,base));if(!response.ok)throw new Error('자료 응답 오류');return response.json()}));
  [window.ASSETS,window.TERRAIN,window.AUDIO]=packs;
  for(const name of ['engine','map','audio','app'])await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL(name+'.js'+version,base);script.onload=resolve;script.onerror=reject;document.body.append(script)});
 }catch(error){document.getElementById('loading').textContent='게임 자료를 불러오지 못했습니다. 인터넷 연결을 확인하고 새로고침해 주세요. 오프라인에서는 build.py로 만든 단일 HTML을 사용하세요.'}
})();
