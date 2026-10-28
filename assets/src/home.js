const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const filterGroup=document.querySelector('.filters');
if(filterGroup){filterGroup.hidden=false;filterGroup.addEventListener('click',e=>{const button=e.target.closest('[data-filter]');if(!button)return;for(const b of filterGroup.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b===button));for(const card of document.querySelectorAll('.project-card'))card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;window.dispatchEvent(new Event('pipeline:filter'));});}
const skills=[...document.querySelectorAll('[data-skill]')];
function selectSkill(index){skills.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));document.querySelectorAll('[data-skill-copy]').forEach((p,i)=>p.hidden=i!==index);document.querySelector('.skill-number').textContent=String(index+1).padStart(2,'0');}
skills.forEach((button,index)=>{button.addEventListener('click',()=>selectSkill(index));button.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const next=(index+(['ArrowDown','ArrowRight'].includes(e.key)?1:-1)+skills.length)%skills.length;selectSkill(next);skills[next].focus();}});});
// Let essential HTML and fonts settle before loading decorative scenes.
const start=()=>{if(!reduced.matches)import('./scenes.js').then(m=>m.mount()).catch(()=>{});};
if('requestIdleCallback'in window)requestIdleCallback(start,{timeout:2000});else setTimeout(start,600);
