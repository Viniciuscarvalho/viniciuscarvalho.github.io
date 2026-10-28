const en = document.body.dataset.lang === 'en';
const card = document.querySelector('#contact-card');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const labels = {copy: en ? 'Link copied.' : 'Link copiado.', fail: en ? 'Copy the address below.' : 'Copie o endereço abaixo.', qr: en ? 'Show QR' : 'Mostrar QR', back: en ? 'Back to card' : 'Voltar ao card'};
const front = document.querySelector('#card-front'), back = document.querySelector('#card-back');
const flip = document.querySelector('[data-flip]');
const stage = document.querySelector('.stage-view');
const shareUrl = document.querySelector('.share-url');
const canonical = shareUrl.value;
for (const button of document.querySelectorAll('[data-share],[data-flip],[data-stage]')) button.hidden = false;
function setFlipped(value) {
  front.hidden = value; front.inert = value;
  back.hidden = !value; back.inert = !value;
  flip.setAttribute('aria-expanded', String(value)); flip.textContent = value ? labels.back : labels.qr;
  if (!reduced.matches) card.animate([{transform:'rotateY(-6deg)'},{transform:'rotateY(0)'}],{duration:300});
}
setFlipped(false);
flip.addEventListener('click', () => setFlipped(flip.getAttribute('aria-expanded') !== 'true'));
function setStage(value, update = true) {
  document.body.classList.toggle('is-stage', value); stage.hidden = !value;
  document.querySelector('.card-shell').inert = value;
  if (update) {const url = new URL(location.href);value ? url.searchParams.set('stage','1') : url.searchParams.delete('stage');history.replaceState(null,'',url);}
  if (value) stage.querySelector('button').focus(); else if(update) document.querySelector('[data-stage]').focus();
}
document.querySelector('[data-stage]').addEventListener('click',()=>setStage(true));
document.querySelector('[data-exit-stage]').addEventListener('click',()=>setStage(false));
setStage(new URL(location.href).searchParams.get('stage')==='1',false);
document.querySelector('.locale')?.addEventListener('click',e=>{if(document.body.classList.contains('is-stage')){const url=new URL(e.currentTarget.href);url.searchParams.set('stage','1');e.currentTarget.href=url.href;}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!stage.hidden)setStage(false);else if(!back.hidden){setFlipped(false);flip.focus();}}});
document.querySelector('[data-share]').addEventListener('click',async()=>{
  const feedback = document.querySelector('[data-feedback]');
  try {if(navigator.share){await navigator.share({title:'Vinicius Carvalho · Software Engineer',url:canonical});return;}}
  catch(error){if(error.name==='AbortError')return;}
  try {await navigator.clipboard.writeText(canonical);feedback.textContent=labels.copy;}
  catch {shareUrl.hidden=false;shareUrl.focus();shareUrl.select();feedback.textContent=labels.fail;}
});
let frame=0;
card.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse'||frame)return;frame=requestAnimationFrame(()=>{const box=card.getBoundingClientRect();const x=(e.clientX-box.left)/box.width-.5,y=(e.clientY-box.top)/box.height-.5;card.style.transform=`rotateX(${-y*5}deg) rotateY(${x*5}deg)`;frame=0;});});
card.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);frame=0;card.style.transform='';});
reduced.addEventListener('change',()=>{card.style.transform='';});
// Original 5×7 VC mark. Accessible identity remains in the DOM.
const canvas=document.querySelector('.pixel'),ctx=canvas?.getContext('2d');
if(ctx){canvas.hidden=false;ctx.fillStyle='#121216';ctx.fillRect(0,0,140,140);ctx.fillStyle='#ff5a1f';const letters=['10001100011000101010010100010000100','01110100001000010000100001000001110'];letters.forEach((bits,k)=>{for(let y=0;y<7;y++)for(let x=0;x<5;x++)if(bits[y*5+x]==='1')ctx.fillRect(15+k*58+x*9,38+y*9,7,7);});}
