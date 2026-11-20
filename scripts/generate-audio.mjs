// Original procedural audio, generated offline. No third-party samples.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const dir=fileURLToPath(new URL('../assets/audio/',import.meta.url));mkdirSync(dir,{recursive:true});
const rate=22050;
function wav(name,length,voices){
  const samples=new Float32Array(Math.ceil(length*rate));
  for(const v of voices){
    const {at=0,d=.2,f=440,a=.2,type='pluck'}=v;
    for(let i=0;i<d*rate;i++){
      const index=Math.floor(at*rate)+i;if(index>=samples.length)break;
      const t=i/rate,env=Math.min(1,t/.008)*Math.exp(-t/(d*.22));
      const phase=type==='drum'?2*Math.PI*f*(.035*(1-Math.exp(-t/.035))+.2*t):2*Math.PI*f*t;
      const tone=type==='noise'?Math.sin(i*127.1+at*7)*Math.cos(i*31.7):Math.sin(phase)+(type==='pluck'?.25*Math.sin(phase*2):0);
      samples[index]+=tone*env*a;
    }
  }
  const out=Buffer.alloc(44+samples.length*2);out.write('RIFF',0);out.writeUInt32LE(out.length-8,4);out.write('WAVEfmt ',8);out.writeUInt32LE(16,16);out.writeUInt16LE(1,20);out.writeUInt16LE(1,22);out.writeUInt32LE(rate,24);out.writeUInt32LE(rate*2,28);out.writeUInt16LE(2,32);out.writeUInt16LE(16,34);out.write('data',36);out.writeUInt32LE(samples.length*2,40);
  samples.forEach((n,i)=>out.writeInt16LE(Math.round(Math.max(-.95,Math.min(.95,n))*32767),44+i*2));writeFileSync(dir+name+'.wav',out);
}
const configs={
  pull:[180,.08,'pluck'],throw:[720,.18,'noise'],hit:[110,.22,'drum'],collect:[880,.25,'pluck'],
  chicken:[960,.2,'pluck'],bark:[170,.22,'noise'],shout:[280,.3,'noise'],warning:[660,.4,'pluck'],
  wave:[65,1,'noise'],raise:[90,.4,'drum'],ultimate:[55,.8,'drum'],elephant:[145,.8,'pluck'],
  perfect:[1046,.3,'pluck'],miss:[175,.18,'pluck'],click:[523,.12,'pluck']
};
for(const [name,[f,d,type]] of Object.entries(configs))wav(name,d+.05,[{f,d,type,a:.3}]);
wav('win',1.2,[523,587,659,784,880,1046].map((f,i)=>({f,at:i*.14,d:.4,a:.23})));
wav('lose',1.3,[392,349,330,262].map((f,i)=>({f,at:i*.22,d:.4,a:.22})));
const scale=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];
for(let stage=1;stage<=4;stage++){
  const voices=[];
  for(let beat=0;beat<8;beat++){
    voices.push({at:beat*.6,f:beat%2?150:95,d:.3,a:stage===4?.27:.19,type:'drum'});
    voices.push({at:beat*.6+.3,f:880,d:.055,a:.07,type:'noise'});
    voices.push({at:beat*.6,f:scale[(beat*(stage===3?3:1)+stage)%8],d:.5,a:stage===4?.09:.14});
    if(stage===3||stage===2)voices.push({at:beat*.6+.3,f:scale[(beat+3)%8],d:.22,a:.06});
  }
  wav('music-'+stage,4.8,voices);
}
console.log(`Generated ${Object.keys(configs).length+6} original WAV files in ${dir}`);
