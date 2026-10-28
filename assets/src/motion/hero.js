import { clamp } from './model.js';

export function mountHero({ gsap, register, signal }) {
  const hero = document.querySelector('.hero');
  const title = hero?.querySelector('h1');
  if (!title) return () => {};
  const original = title.textContent;
  const spoken = document.createElement('span');
  spoken.className = 'sr-only'; spoken.textContent = original;
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  const chars = [];
  for (const word of original.split(' ')) {
    const span = document.createElement('span'); span.className = 'hero-word';
    for (const letter of word) {
      const char = document.createElement('span');
      char.className = 'reveal-char'; char.textContent = letter;
      span.append(char); chars.push(char);
    }
    visual.append(span, document.createTextNode(' '));
  }
  title.replaceChildren(spoken, visual);
  const fit = () => {
    const width = title.parentElement.clientWidth;
    const max = Math.min(116, width * 0.09);
    let size = Math.max(40, max);
    title.style.fontSize = `${size}px`;
    // Measure the longest nonbreaking word. Preserve readable minimum size.
    while (size > 32 && [...visual.children].some(word => word.getBoundingClientRect().width > width)) {
      title.style.fontSize = `${--size}px`;
    }
  };
  const resize = new ResizeObserver(fit); resize.observe(hero);
  document.fonts.ready.then(() => { if (!signal.aborted) fit(); }); fit();
  gsap.from(chars, { yPercent: 50, scale: 0.85, opacity: 0, stagger: 0.012, duration: 0.6, ease: 'power3.out' });

  const lens = document.createElement('div');
  lens.className = 'lens motion-lens'; lens.setAttribute('aria-hidden', 'true');
  const copy = document.createElement('div'); copy.className = 'lens-copy';
  const text = document.createElement('div'); text.className = 'lens-text'; text.textContent = original;
  copy.append(text); lens.append(copy); hero.append(lens);
  // SVG is decorative. Coarse-pointer and low-quality paths use highlight only.
  const canRefract = typeof SVGFEDisplacementMapElement !== 'undefined' && matchMedia('(pointer:fine)').matches;
  if (canRefract) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden','true'); svg.classList.add('filter-defs');
    svg.innerHTML = '<defs><filter id="pipeline-refraction" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="1" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
    hero.append(svg); text.style.filter = 'url(#pipeline-refraction)';
    signal.addEventListener('abort', () => svg.remove(), { once:true });
  } else copy.hidden = true;
  let pointer = null, phase = 0;
  hero.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse') {
      const box = hero.getBoundingClientRect(); pointer = { x: event.clientX-box.left, y: event.clientY-box.top };
    }
  }, { signal, passive:true });
  hero.addEventListener('pointerleave', () => pointer=null, { signal });
  let x = hero.clientWidth * .7, y = 170;
  const unregister = register(hero, (dt, quality) => {
    if (quality === 'static') { lens.hidden = true; return; }
    phase += dt;
    const tx = pointer?.x ?? hero.clientWidth * .7 + Math.sin(phase * .5) * 80;
    const ty = pointer?.y ?? 170 + Math.cos(phase * .4) * 50;
    x += (tx-x) * Math.min(1, dt*3); y += (ty-y) * Math.min(1, dt*3);
    lens.style.transform = `translate(${x-80}px,${y-80}px)`;
    copy.hidden = quality === 'static' || !canRefract;
    const titleBox=title.getBoundingClientRect(), heroBox=hero.getBoundingClientRect();
    text.style.width=`${titleBox.width}px`;
    text.style.fontSize=getComputedStyle(title).fontSize;
    text.style.transform=`translate(${titleBox.left-heroBox.left-x+80}px,${titleBox.top-heroBox.top-y+80}px)`;
    lens.style.opacity = String(1-clamp(-heroBox.top/heroBox.height));
  });
  return () => { unregister(); resize.disconnect(); lens.remove(); title.textContent=original; title.style.fontSize=''; };
}

export function mountAscii({ register, signal }) {
  const field=document.querySelector('[data-ascii]'); if(!field)return()=>{};
  const canvas=field.querySelector('canvas'), context=canvas.getContext('2d');
  if(!context)return()=>{};
  let image=null;
  // The template only emits this URL when the portrait is explicitly approved.
  if(field.dataset.portrait){image=new Image(); image.src=field.dataset.portrait;}
  const source=document.createElement('canvas'), sourceContext=source.getContext('2d',{willReadFrequently:true});
  let width=0,height=0,phase=0,lastDraw=0,staticDrawn=false;
  const resize=()=>{staticDrawn=false;const box=field.getBoundingClientRect();width=Math.max(1,Math.round(box.width));height=Math.max(1,Math.round(box.height));const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;context.setTransform(dpr,0,0,dpr,0,0);};
  const observer=new ResizeObserver(resize);observer.observe(field);resize();
  canvas.hidden=false;
  const draw=(dt,quality)=>{
    phase+=dt;
    if(quality==='static'&&staticDrawn)return;
    if(phase-lastDraw < 1/15 && quality!=='static')return;
    lastDraw=phase;staticDrawn=quality==='static';
    const cols=Math.max(24,Math.min(70,Math.floor(width/9))), rows=Math.floor(height/11);
    source.width=cols;source.height=rows;
    sourceContext.fillStyle='#0a0a0c';sourceContext.fillRect(0,0,cols,rows);
    if(image?.complete&&image.naturalWidth)sourceContext.drawImage(image,0,0,cols,rows);
    else {sourceContext.fillStyle='#ffffff';sourceContext.font=`bold ${cols*.8}px monospace`;sourceContext.textAlign='center';sourceContext.fillText('VC',cols/2,rows*.8);}
    const pixels=sourceContext.getImageData(0,0,cols,rows).data;
    const rect=field.getBoundingClientRect();const scatter=quality==='static'?0:clamp(-rect.top/(innerHeight*.7));
    context.clearRect(0,0,width,height);context.font='10px monospace';context.textAlign='center';
    const glyphs=' .:░▒▓@';
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
      const i=(row*cols+col)*4, brightness=(pixels[i]*.2126+pixels[i+1]*.7152+pixels[i+2]*.0722)/255;
      if(brightness<.05)continue;
      const hash=Math.sin(col*127.1+row*311.7)*43758.5453;const seed=hash-Math.floor(hash);
      const dx=(seed-.5)*scatter*300,dy=-scatter*seed*160;
      context.fillStyle=`rgba(184,255,60,${(quality==='static'?.45:.4+Math.sin(phase+col*.2)*.1)*(1-scatter)})`;
      context.fillText(glyphs[Math.round(brightness*(glyphs.length-1))],col*width/cols+dx,row*height/rows+dy);
    }
  };
  draw(0,'static');const unregister=register(field,draw);
  return()=>{unregister();observer.disconnect();canvas.hidden=true;};
}
