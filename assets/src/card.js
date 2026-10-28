import {spring,clamp,createQualityMonitor} from './motion/model.js';
import {drawPixelTitle,ditherOn} from './motion/pixels.js';

const en=document.body.dataset.lang==='en';
const card=document.querySelector('#contact-card');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const labels={copy:en?'Link copied.':'Link copiado.',fail:en?'Copy the address below.':'Copie o endereço abaixo.',qr:en?'Show QR':'Mostrar QR',back:en?'Back to card':'Voltar ao card',gyro:en?'Enable motion':'Ativar movimento',gyroOff:en?'Disable motion':'Desativar movimento',gyroDenied:en?'Motion unavailable. You can use all card actions.':'Movimento indisponível. Todas as ações do card continuam disponíveis.'};
const front=document.querySelector('#card-front'),back=document.querySelector('#card-back');
const deck=document.querySelector('.card-deck'),flip=document.querySelector('[data-flip]');
const stage=document.querySelector('.stage-view'),shareUrl=document.querySelector('.share-url');
const feedback=document.querySelector('[data-feedback]'),gyroButton=document.querySelector('[data-gyro]');
const canonical=shareUrl.value;
for(const button of document.querySelectorAll('[data-share],[data-flip],[data-stage]'))button.hidden=false;
let flipped=false,turn=null,flipVersion=0;
function showFace(value){front.hidden=value;front.inert=value;back.hidden=!value;back.inert=!value;flipped=value;flip.setAttribute('aria-expanded',String(value));flip.textContent=value?labels.back:labels.qr;}
showFace(false);
async function setFlipped(value,immediate=false){
 if(turn&&!immediate)return;
 const version=++flipVersion;turn?.cancel();turn=null;
 if(reduced.matches||immediate){showFace(value);flip.setAttribute('aria-disabled','false');return;}
 flip.setAttribute('aria-disabled','true');
 try{
 turn=deck.animate([{transform:'rotateY(0)'},{transform:'rotateY(90deg)'}],{duration:140,easing:'ease-in',fill:'forwards'});
 await turn.finished;if(version!==flipVersion)return;turn.cancel();showFace(value);
 turn=deck.animate([{transform:'rotateY(-90deg)'},{transform:'rotateY(0)'}],{duration:180,easing:'ease-out'});await turn.finished;
 }catch{if(version===flipVersion)showFace(value);}finally{if(version===flipVersion){turn?.cancel();turn=null;flip.setAttribute('aria-disabled','false');}}
}
flip.addEventListener('click',()=>setFlipped(!flipped));
function setStage(value,update=true){
 if(value)disableGyro();resetTilt();document.body.classList.toggle('is-stage',value);stage.hidden=!value;document.querySelector('.card-shell').inert=value;
 if(update){const url=new URL(location.href);value?url.searchParams.set('stage','1'):url.searchParams.delete('stage');history.replaceState(null,'',url);}
 if(value)stage.querySelector('button').focus();else if(update)document.querySelector('[data-stage]').focus();
}
document.querySelector('[data-stage]').addEventListener('click',()=>setStage(true));
document.querySelector('[data-exit-stage]').addEventListener('click',()=>setStage(false));
document.querySelector('.locale')?.addEventListener('click',event=>{if(!stage.hidden){const url=new URL(event.currentTarget.href);url.searchParams.set('stage','1');event.currentTarget.href=url.href;}});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'){if(!stage.hidden)setStage(false);else if(flipped||turn){setFlipped(false,true);flip.focus();}}
 if(event.key==='Tab'&&!stage.hidden){event.preventDefault();stage.querySelector('button').focus();}
});
window.addEventListener('popstate',()=>setStage(new URL(location.href).searchParams.get('stage')==='1',false));
document.querySelector('[data-share]').addEventListener('click',async()=>{
 feedback.textContent='';shareUrl.hidden=true;
 try{if(navigator.share){await navigator.share({title:'Vinicius Carvalho · Software Engineer',url:canonical});return;}}
 catch(error){if(error.name==='AbortError')return;}
 try{await navigator.clipboard.writeText(canonical);feedback.textContent=labels.copy;}
 catch{shareUrl.hidden=false;shareUrl.focus();shareUrl.select();feedback.textContent=labels.fail;}
});

// A lazy spring loop runs only while the card is visible and settling.
let frame=0,last=0,visible=true,target={x:0,y:0},sx={x:0,velocity:0},sy={x:0,velocity:0},gyroActive=false,orientationBase=null,degraded=false;
const quality=createQualityMonitor();const sheen=document.querySelector('.card-sheen');
function resetTilt(){cancelAnimationFrame(frame);frame=0;last=0;target={x:0,y:0};sx={x:0,velocity:0};sy={x:0,velocity:0};card.style.transform='';sheen.style.transform='';quality.reset();}
function update(time){
 frame=0;if(reduced.matches||document.hidden||!visible||!stage.hidden||degraded)return;
 const ms=last?time-last:16;last=time;
 if(quality.sample(ms)){degraded=true;disableGyro();resetTilt();gyroButton.hidden=true;return;}
 const dt=Math.min(ms/1000,.05);sx=spring(sx,target.x,dt);sy=spring(sy,target.y,dt);
 card.style.transform=`rotateX(${sy.x}deg) rotateY(${sx.x}deg)`;
 sheen.style.transform=`translate(${sx.x*12}px,${sy.x*12}px)`;
 if(Math.abs(sx.x-target.x)+Math.abs(sy.x-target.y)+Math.abs(sx.velocity)+Math.abs(sy.velocity)>.01)frame=requestAnimationFrame(update);else last=0;
}
function schedule(){if(!frame&&!reduced.matches&&!degraded&&visible&&!document.hidden&&stage.hidden)frame=requestAnimationFrame(update);}
card.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse'||gyroActive)return;const box=card.getBoundingClientRect();target={x:((event.clientX-box.left)/box.width-.5)*7,y:-((event.clientY-box.top)/box.height-.5)*7};schedule();},{passive:true});
card.addEventListener('pointerleave',()=>{if(!gyroActive){target={x:0,y:0};schedule();}});
function orientation(event){
 if(!Number.isFinite(event.beta)||!Number.isFinite(event.gamma))return;
 if(!orientationBase)orientationBase={beta:event.beta,gamma:event.gamma};
 target={x:clamp(event.gamma-orientationBase.gamma,-15,15)*.35,y:clamp(orientationBase.beta-event.beta,-15,15)*.35};schedule();
}
function disableGyro(){window.removeEventListener('deviceorientation',orientation);gyroActive=false;orientationBase=null;gyroButton.setAttribute('aria-pressed','false');gyroButton.textContent=labels.gyro;}
const canOrient=()=>typeof DeviceOrientationEvent!=='undefined'&&!reduced.matches&&!degraded;
gyroButton.hidden=!canOrient();
gyroButton.addEventListener('click',async()=>{
 if(gyroActive){disableGyro();resetTilt();return;}
 if(!canOrient())return;
 try{
  if(typeof DeviceOrientationEvent.requestPermission==='function'&&await DeviceOrientationEvent.requestPermission()!=='granted')throw Error('denied');
  if(reduced.matches||document.hidden)return;
  gyroActive=true;orientationBase=null;gyroButton.setAttribute('aria-pressed','true');gyroButton.textContent=labels.gyroOff;
  window.addEventListener('deviceorientation',orientation,{passive:true});
 }catch{feedback.textContent=labels.gyroDenied;}
});
const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)resetTilt();});observer.observe(card);
document.addEventListener('visibilitychange',()=>{if(document.hidden){disableGyro();resetTilt();}});
reduced.addEventListener('change',()=>{if(reduced.matches){setFlipped(flipped,true);disableGyro();resetTilt();}gyroButton.hidden=!canOrient();});
window.addEventListener('pagehide',()=>{disableGyro();resetTilt();observer.disconnect();});
window.addEventListener('pageshow',event=>{if(event.persisted){observer.observe(card);setStage(new URL(location.href).searchParams.get('stage')==='1',false);}});
setStage(new URL(location.href).searchParams.get('stage')==='1',false);

const title=document.querySelector('[data-pixel-title]');
if(drawPixelTitle(title,title.dataset.text)){title.hidden=false;title.parentElement.classList.add('pixel-title-ready');}
const mark=document.querySelector('.pixel');
if(drawPixelTitle(mark,'VC','#ff5a1f')){mark.hidden=false;}
const background=document.querySelector('[data-card-dither]');
const ctx=background.getContext('2d');if(ctx){background.width=96;background.height=128;ctx.fillStyle='#9a9aa3';for(let y=0;y<128;y++)for(let x=0;x<96;x++)if(ditherOn(x,y,(x+y)/800))ctx.fillRect(x,y,1,1);background.hidden=false;}
