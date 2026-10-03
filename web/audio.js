// SPDX-License-Identifier: GPL-3.0-or-later
class CombatAudio {
 constructor(context,pack){this.context=context;this.pack=pack;this.buffers=new Map();this.voices=new Set();this.last=new Map();this.enabled=false;this.master=context.createGain();this.master.gain.value=.24;this.master.connect(context.destination)}
 async load(){await Promise.all(Object.entries(this.pack).map(async([key,sound])=>{const binary=atob(sound.src.split(',')[1]),data=Uint8Array.from(binary,c=>c.charCodeAt(0));this.buffers.set(key,await this.context.decodeAudioData(data.buffer))}))}
 setEnabled(enabled){this.enabled=enabled;if(!enabled){for(const voice of this.voices)voice.stop();this.voices.clear();this.last.clear()}}
 play(key,x=384){
  const buffer=this.buffers.get(key),now=this.context.currentTime;
  if(!this.enabled||!buffer||this.context.state!=='running'||this.voices.size>=12||now-(this.last.get(key)??-10)<(key==='destroy'?.18:.09))return;
  this.last.set(key,now);const source=this.context.createBufferSource(),gain=this.context.createGain();source.buffer=buffer;gain.gain.value=key==='destroy'?.65:key==='bullet'?.48:.7;source.connect(gain);
  let pan=null;if(this.context.createStereoPanner){pan=this.context.createStereoPanner();pan.pan.value=Math.max(-.65,Math.min(.65,(x/768-.5)*1.3));gain.connect(pan);pan.connect(this.master)}else gain.connect(this.master);
  this.voices.add(source);source.onended=()=>{this.voices.delete(source);source.disconnect();gain.disconnect();pan?.disconnect()};source.start();
 }
}
