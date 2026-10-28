const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const controller=new AbortController(),{signal}=controller;
const filterGroup=document.querySelector('.filters');
if(filterGroup){
  filterGroup.hidden=false;
  filterGroup.addEventListener('click',event=>{
    const button=event.target.closest('[data-filter]');if(!button)return;
    filterGroup.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    let count=0;
    document.querySelectorAll('.project-card').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;if(!card.hidden)count++;});
    const feedback=document.querySelector('[data-filter-status]');feedback.textContent=document.body.dataset.lang==='en'?`${count} projects`:`${count} projetos`;
    window.dispatchEvent(new Event('pipeline:filter'));
  },{signal});
}
const skills=[...document.querySelectorAll('[data-skill]')];
function selectSkill(index){
  skills.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  document.querySelectorAll('[data-skill-copy]').forEach((p,i)=>p.hidden=i!==index);
  const number=document.querySelector('.skill-number');number.textContent=String(index+1).padStart(2,'0');
  if(!reduced.matches)number.animate([{opacity:.3,transform:'translateY(15px) scale(.9)'},{opacity:1,transform:'none'}],{duration:260,easing:'ease-out'});
}
skills.forEach((button,index)=>{
  button.addEventListener('click',()=>selectSkill(index),{signal});
  button.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?skills.length-1:(index+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1)+skills.length)%skills.length;selectSkill(next);skills[next].focus();}},{signal});
});
let cleanup=null,loading=false,generation=0;
async function start(){
  if(reduced.matches||loading||cleanup)return;
  loading=true;const current=++generation;
  try{const module=await import('./scenes.js');if(current===generation&&!reduced.matches){const result=await module.mount();if(current!==generation||reduced.matches)result?.();else cleanup=result;}}catch{/* Static HTML is the fallback. */}finally{loading=false;}
}
const schedule=()=>{'requestIdleCallback'in window?requestIdleCallback(start,{timeout:1600}):setTimeout(start,500);};
schedule();
reduced.addEventListener('change',()=>{if(reduced.matches){generation++;cleanup?.();cleanup=null;}else schedule();});
window.addEventListener('pagehide',()=>{generation++;cleanup?.();cleanup=null;});
window.addEventListener('pageshow',event=>{document.querySelectorAll('.iris').forEach(el=>el.remove());if(event.persisted)schedule();});

const compare=document.querySelector('[data-compare-photo]');
compare?.addEventListener('click',()=>{const photo=document.querySelector('[data-original-photo]');photo.hidden=!photo.hidden;compare.setAttribute('aria-pressed',String(!photo.hidden));});
