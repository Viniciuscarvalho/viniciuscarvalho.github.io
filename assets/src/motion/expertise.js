import {clamp} from './model.js';

export function mountExpertise({ScrollTrigger,register,signal}) {
  const area=document.querySelector('.expertise');
  const buttons=[...area.querySelectorAll('[data-skill]')];
  let previous=-1;
  const scene=ScrollTrigger.create({trigger:area,start:'top 55%',end:'bottom 45%',onUpdate:self=>{
    if(area.contains(document.activeElement))return;
    const index=Math.min(buttons.length-1,Math.floor(clamp(self.progress)*buttons.length));
    if(index!==previous){previous=index;buttons[index].click();}
  }});
  const terminal=document.querySelector('.career-terminal');
  const originals=[];let elapsed=0;
  for(const line of terminal.querySelectorAll('[data-type]')){
    const original=line.textContent;originals.push([line,original]);
    const semantic=document.createElement('span');semantic.className='sr-only';semantic.textContent=original;
    const visual=document.createElement('span');visual.setAttribute('aria-hidden','true');line.replaceChildren(semantic,visual);
  }
  let complete=false;
  const unregister=register(terminal,dt=>{
    if(complete)return;elapsed+=dt;
    let offset=0;complete=true;
    for(const [line,text] of originals){const length=Math.max(0,Math.floor(elapsed*35)-offset);line.lastElementChild.textContent=text.slice(0,length);if(length<text.length)complete=false;offset+=text.length+12;}
  });
  const contact=document.querySelector('.contact'), email=contact.querySelector('.email');
  const glass=document.createElement('span');glass.className='contact-glass';glass.setAttribute('aria-hidden','true');email.append(glass);
  let point=null;email.addEventListener('pointermove',event=>{const box=email.getBoundingClientRect();point={x:event.clientX-box.left,y:event.clientY-box.top};},{signal,passive:true});email.addEventListener('pointerleave',()=>point=null,{signal});
  const stopGlass=register(contact,(_dt,quality)=>{glass.hidden=!point||quality==='static';if(point)glass.style.transform=`translate(${point.x-40}px,${point.y-40}px)`;});
  return()=>{stopGlass();glass.remove();scene.kill();unregister();for(const [line,text] of originals)line.textContent=text;};
}
