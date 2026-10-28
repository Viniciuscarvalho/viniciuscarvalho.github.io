export async function mount(){
const reduced=matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches)return;
const {gsap}=await import('gsap');const {ScrollTrigger}=await import('gsap/ScrollTrigger');gsap.registerPlugin(ScrollTrigger);
const hero=document.querySelector('.hero'),title=hero?.querySelector('h1');if(!hero||!title)return;
const lens=document.createElement('div');lens.className='lens';lens.setAttribute('aria-hidden','true');hero.append(lens);
const context=gsap.context(()=>{
 gsap.from(title,{y:24,opacity:.4,duration:.8,ease:'power3.out'});
 const mm=gsap.matchMedia();mm.add('(min-width: 1100px) and (prefers-reduced-motion: no-preference)',()=>{
 const grid=document.querySelector('.project-grid'),section=document.querySelector('.projects-section');grid.classList.add('is-pinned');
 const distance=()=>Math.max(0,grid.scrollWidth-section.clientWidth+section.clientWidth*.12);
 const animation=gsap.to(grid,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:grid,start:'top 100px',end:()=>'+='+distance(),scrub:1,pin:true,invalidateOnRefresh:true}});
 const filter=()=>{animation.scrollTrigger.refresh();};window.addEventListener('pipeline:filter',filter);
 return()=>{window.removeEventListener('pipeline:filter',filter);grid.classList.remove('is-pinned');};
 });
},hero.parentElement);
let visible=true,phase=0,last=0,slow=0;
const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});observer.observe(hero);
function tick(time,delta){if(document.hidden||!visible||reduced.matches){last=0;return;}if(last){const dt=delta;if(dt>25)slow++;else slow=Math.max(0,slow-1);if(slow>120){stop();return;}}last=time;phase+=.012;lens.style.transform=`translate(${Math.sin(phase)*70}px,${Math.cos(phase*.7)*45}px) rotate(${Math.sin(phase)*10}deg)`;}
gsap.ticker.add(tick);
function visibility(){last=0;}document.addEventListener('visibilitychange',visibility);
function stop(){gsap.ticker.remove(tick);context.revert();observer.disconnect();lens.remove();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',change);}
function change(){if(reduced.matches)stop();}reduced.addEventListener('change',change);
window.addEventListener('pagehide',stop,{once:true});
// Progressive navigation: native links remain authoritative. No fetch/modal dependency.
for(const link of document.querySelectorAll('.project-link'))link.addEventListener('click',e=>{if(reduced.matches||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();const iris=document.createElement('div');iris.className='iris';iris.style.setProperty('--x',`${e.clientX}px`);iris.style.setProperty('--y',`${e.clientY}px`);document.body.append(iris);requestAnimationFrame(()=>iris.classList.add('open'));setTimeout(()=>location.assign(link.href),500);});
}

window.addEventListener("pageshow",()=>document.querySelectorAll(".iris").forEach(el=>el.remove()));
