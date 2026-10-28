import { clamp, spring, projectPose } from './model.js';

export function mountProjects({gsap,ScrollTrigger,register,signal}){
  const grid=document.querySelector('.project-grid'),section=document.querySelector('.projects-section');
  if(!grid||!section)return()=>{};
  const toggle=document.querySelector('[data-gallery-mode]');toggle.hidden=false;
  let animation=null,gridMode=false,previousIndex=-1;
  const media=matchMedia('(min-width:1100px) and (pointer:fine)');
  const cards=[...grid.querySelectorAll('.project-card')];
  const panel=document.querySelector('.project-caption');
  const top=panel.querySelector('[data-caption-old]'),bottom=panel.querySelector('[data-caption-new]');
  function caption(progress){
    const visible=cards.filter(card=>!card.hidden);const pose=projectPose(progress,visible.length);
    top.textContent=visible[pose.index]?.querySelector('h3')?.textContent||'';
    bottom.textContent=visible[pose.next]?.querySelector('h3')?.textContent||'';
    const cut=(1-pose.cut)*100;
    top.style.clipPath=`inset(0 0 ${100-cut}% 0)`;
    bottom.style.clipPath=`inset(${cut}% 0 0 0)`;
    panel.style.setProperty('--cut',`${cut}%`);
    if(previousIndex!==pose.index){previousIndex=pose.index;panel.dataset.index=String(pose.index);}
  }
  function kill(){animation?.scrollTrigger.kill();animation?.kill();animation=null;grid.classList.remove('is-pinned');gsap.set(grid,{clearProps:'transform'});panel.hidden=true;}
  function setup(){
    kill();
    const visible=cards.filter(card=>!card.hidden);
    const enabled=media.matches&&!gridMode&&visible.length>2;
    toggle.setAttribute('aria-pressed',String(gridMode));
    if(!enabled)return;
    grid.classList.add('is-pinned');panel.hidden=false;
    const distance=()=>Math.max(0,grid.scrollWidth-section.clientWidth+section.clientWidth*.12);
    animation=gsap.to(grid,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:grid,start:'top 100px',end:()=>'+='+distance(),scrub:.7,pin:true,invalidateOnRefresh:true,onUpdate:self=>caption(self.progress)}});
    caption(0);ScrollTrigger.refresh();
  }
  const focus=event=>{if(animation&&event.target.closest('a')){gridMode=true;setup();event.target.scrollIntoView({block:'nearest'});}};
  grid.addEventListener('focusin',focus,{signal});
  toggle.addEventListener('click',()=>{gridMode=!gridMode;setup();},{signal});
  media.addEventListener('change',setup);window.addEventListener('pipeline:filter',setup,{signal});setup();
  let dragging=null;
  grid.addEventListener('pointerdown',event=>{
    if(!animation||event.button!==0||event.target.closest('a,button'))return;
    dragging={x:event.clientX,scroll:scrollY};grid.setPointerCapture(event.pointerId);
  },{signal});
  grid.addEventListener('pointermove',event=>{if(dragging&&animation){window.scrollTo({top:dragging.scroll+dragging.x-event.clientX,behavior:'instant'});}},{signal});
  grid.addEventListener('pointerup',()=>dragging=null,{signal});grid.addEventListener('pointercancel',()=>dragging=null,{signal});
  const states=cards.map(()=>({x:0,velocity:0,target:0}));
  cards.forEach((card,index)=>{
    card.addEventListener('pointermove',event=>{if(event.pointerType!=='mouse')return;const box=card.getBoundingClientRect();states[index].target=clamp((event.clientX-box.left)/box.width-.5,-.5,.5)*5;},{signal,passive:true});
    card.addEventListener('pointerleave',()=>states[index].target=0,{signal});
  });
  const unregister=register(section,(dt,quality)=>{
    cards.forEach((card,index)=>{
      const art=card.querySelector('.project-art');const state=states[index];
      const next=spring(state,quality==='static'?0:state.target,dt,85,13);Object.assign(state,next);
      const parallax=animation?-(animation.progress()-.5)*14:0;
      art.style.transform=`translateY(${parallax}px) rotate(${state.x}deg)`;
    });
  });
  return()=>{unregister();kill();media.removeEventListener('change',setup);toggle.hidden=true;cards.forEach(c=>c.querySelector('.project-art').style.transform='');};
}
