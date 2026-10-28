import {createQualityMonitor} from './motion/model.js';
import {mountHero,mountAscii} from './motion/hero.js';
import {mountExpertise} from './motion/expertise.js';
import {mountProjects} from './motion/projects.js';

export async function mount(){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches)return()=>{};
  const {gsap}=await import('gsap');const {ScrollTrigger}=await import('gsap/ScrollTrigger');gsap.registerPlugin(ScrollTrigger);if(reduced.matches)return()=>{};
  const controller=new AbortController(),{signal}=controller;
  const entries=new Map(),quality=createQualityMonitor();let disposed=false;
  const observer=new IntersectionObserver(records=>{for(const record of records){const entriesForElement=entries.get(record.target);if(entriesForElement)entriesForElement.visible=record.isIntersecting;}},{rootMargin:'40px'});
  function register(element,tick){const entry={tick,visible:false};entries.set(element,entry);observer.observe(element);return()=>{entries.delete(element);observer.unobserve(element);};}
  const context=gsap.context(()=>{});
  const options={gsap,ScrollTrigger,register,signal};
  const cleanups=[];
  context.add(()=>{cleanups.push(mountHero(options),mountAscii(options),mountProjects(options),mountExpertise(options));});
  let mode=navigator.deviceMemory&&navigator.deviceMemory<4?'static':'full';
  document.documentElement.dataset.motionQuality=mode;
  function tick(_time,delta){
    if(document.hidden)return;
    if(quality.sample(delta)){mode='static';document.documentElement.dataset.motionQuality=mode;}
    const dt=Math.min(delta/1000,.05);
    for(const entry of entries.values())if(entry.visible)entry.tick(dt,mode);
  }
  gsap.ticker.add(tick);
  document.addEventListener('visibilitychange',()=>quality.reset(),{signal});
  function stop(){if(disposed)return;disposed=true;controller.abort();gsap.ticker.remove(tick);for(const cleanup of cleanups.reverse())cleanup();context.revert();observer.disconnect();delete document.documentElement.dataset.motionQuality;}
  reduced.addEventListener('change',()=>{if(reduced.matches)stop();},{signal});
  window.addEventListener('pagehide',stop,{once:true,signal});
  // Native navigation remains authoritative, including modified-click/new-tab.
  document.querySelectorAll('.project-link').forEach(link=>link.addEventListener('click',event=>{
    if(reduced.matches||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
    event.preventDefault();const box=link.getBoundingClientRect();const iris=document.createElement('div');iris.className='iris';iris.setAttribute('aria-hidden','true');iris.style.setProperty('--x',`${event.detail?event.clientX:box.left+box.width/2}px`);iris.style.setProperty('--y',`${event.detail?event.clientY:box.top+box.height/2}px`);document.body.append(iris);requestAnimationFrame(()=>iris.classList.add('open'));setTimeout(()=>location.assign(link.href),500);
  },{signal}));
  return stop;
}
