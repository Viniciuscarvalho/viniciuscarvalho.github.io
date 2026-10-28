// Semantic HTML is the source of truth. SVG is a decorative projection of its edges.
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const ns='http://www.w3.org/2000/svg';
const svgElement=(tag,attributes={})=>{const element=document.createElementNS(ns,tag);for(const [key,value]of Object.entries(attributes))element.setAttribute(key,String(value));return element;};
const maps=[];
for(const root of document.querySelectorAll('[data-architecture]')){
  const nodes=[...root.querySelectorAll('[data-arch-target]')];
  const panels=[...root.querySelectorAll('[data-arch-panel]')];
  const board=root.querySelector('.arch-board'),svg=root.querySelector('svg');
  const play=root.querySelector('[data-arch-play]'),next=root.querySelector('[data-arch-next]');
  const status=root.querySelector('[data-arch-status]'),counter=root.querySelector('[data-arch-counter]');
  const edges=[...root.querySelectorAll('[data-arch-edge]')].map(item=>({from:item.dataset.from,to:item.dataset.to}));
  let selected=0,playing=false,elapsed=0,ticker=null,loading=0,visible=false,links=[];
  const map={root,stop,select,isPlaying:()=>playing};maps.push(map);
  function select(index){
    selected=(index+nodes.length)%nodes.length;
    nodes.forEach((node,i)=>{if(i===selected)node.setAttribute('aria-current','step');else node.removeAttribute('aria-current');});
    panels.forEach((panel,i)=>panel.hidden=i!==selected);
    counter.textContent=`${String(selected+1).padStart(2,'0')} / ${String(nodes.length).padStart(2,'0')}`;
    for(const link of links){const active=link.from===nodes[selected].dataset.archTarget;link.path.classList.toggle('is-active',active);link.dot.classList.toggle('is-active',active);link.path.setAttribute('marker-end',`url(#${root.id||'wire-'+root.dataset.architecture}-${active?'active':'arrow'})`);}
  }
  function stop(message){
    loading++;playing=false;elapsed=0;
    ticker?.remove(tick);root.classList.remove('is-playing');
    play.setAttribute('aria-pressed','false');play.textContent=root.dataset.play;
    if(message)status.textContent=message;
  }
  function tick(_time,delta){
    if(document.hidden||!visible||root.hidden||reduced.matches||document.documentElement.dataset.motionQuality==='static'){stop(root.dataset.limited);return;}
    elapsed+=Math.min(delta,80)/1000;
    const progress=Math.min(elapsed/2.8,1);
    for(const link of links)if(link.from===nodes[selected].dataset.archTarget){const point=link.path.getPointAtLength(link.length*progress);link.dot.setAttribute('transform',`translate(${point.x} ${point.y})`);}
    if(progress>=1){elapsed=0;if(selected===nodes.length-1)stop(root.dataset.done);else{select(selected+1);status.textContent=`${root.dataset.step} ${selected+1}: ${nodes[selected].querySelector('strong').textContent}`;}}
  }
  async function start(){
    if(playing){stop(root.dataset.paused);return;}
    if(reduced.matches||document.documentElement.dataset.motionQuality==='static'){status.textContent=root.dataset.limited;return;}
    document.dispatchEvent(new CustomEvent('pipeline:diagramplay',{detail:root}));
    const generation=++loading;
    try{
      const {gsap}=await import('gsap');
      if(generation!==loading||reduced.matches||document.hidden||root.hidden)return;
      if(selected===nodes.length-1)select(0);
      elapsed=0;playing=true;ticker=gsap.ticker;root.classList.add('is-playing');
      play.setAttribute('aria-pressed','true');play.textContent=root.dataset.pause;
      status.textContent=`${root.dataset.step} ${selected+1}: ${nodes[selected].querySelector('strong').textContent}`;
      ticker.add(tick);
    }catch{stop(root.dataset.limited);}
  }
  function draw(){
    if(root.hidden||!board.clientWidth)return;
    const bounds=board.getBoundingClientRect();
    const id='wire-'+root.dataset.architecture;
    svg.replaceChildren();const defs=svgElement('defs');
    for(const [suffix,color]of [['arrow','#9a9aa3'],['active','#ff5a1f']]){const marker=svgElement('marker',{id:`${id}-${suffix}`,viewBox:'0 0 8 8',refX:7,refY:4,markerWidth:6,markerHeight:6,orient:'auto'});marker.append(svgElement('path',{d:'M0 0 L8 4 L0 8 Z',fill:color}));defs.append(marker);}svg.append(defs);
    svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
    const positions=new Map(nodes.map(node=>[node.dataset.archTarget,node.getBoundingClientRect()]));
    links=edges.map(edge=>{
      const from=positions.get(edge.from),to=positions.get(edge.to);let x1,y1,x2,y2,d;
      if(Math.abs(from.top-to.top)<5){const right=to.left>from.left;x1=(right?from.right:from.left)-bounds.left;x2=(right?to.left:to.right)-bounds.left;y1=from.top+from.height/2-bounds.top;y2=to.top+to.height/2-bounds.top;d=`M${x1} ${y1} C${(x1+x2)/2} ${y1},${(x1+x2)/2} ${y2},${x2} ${y2}`;}
      else{
        const down=to.top>from.top;
        const blocked=Math.abs(from.left-to.left)<5&&[...positions.values()].some(box=>box!==from&&box!==to&&box.top>Math.min(from.top,to.top)&&box.top<Math.max(from.top,to.top)&&Math.abs(box.left-from.left)<5);
        if(blocked){const lane=from.left-bounds.left-12;x1=from.left-bounds.left;x2=to.left-bounds.left;y1=from.top+from.height/2-bounds.top;y2=to.top+to.height/2-bounds.top;d=`M${x1} ${y1} L${lane} ${y1} L${lane} ${y2} L${x2} ${y2}`;}
        else{x1=from.left+from.width/2-bounds.left;x2=to.left+to.width/2-bounds.left;y1=(down?from.bottom:from.top)-bounds.top;y2=(down?to.top:to.bottom)-bounds.top;d=`M${x1} ${y1} C${x1} ${(y1+y2)/2},${x2} ${(y1+y2)/2},${x2} ${y2}`;}
      }
      const path=svgElement('path',{d,class:'arch-edge','marker-end':`url(#${id}-arrow)`});const dot=svgElement('circle',{r:4,class:'arch-packet',transform:`translate(${x1} ${y1})`});svg.append(path,dot);return{...edge,path,dot,length:path.getTotalLength()};
    });select(selected);
  }
  nodes.forEach((node,index)=>node.addEventListener('click',event=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();stop();select(index);status.textContent=`${root.dataset.step} ${index+1}: ${node.querySelector('strong').textContent}`;
  }));
  play.addEventListener('click',start);
  next.addEventListener('click',()=>{stop();select(selected+1);status.textContent=`${root.dataset.step} ${selected+1}: ${nodes[selected].querySelector('strong').textContent}`;});
  document.addEventListener('pipeline:diagramplay',event=>{if(event.detail!==root)stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop(playing?root.dataset.paused:undefined);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&playing)stop(root.dataset.paused);});
  window.addEventListener('pagehide',()=>stop());
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)stop(playing?root.dataset.paused:undefined);});observer.observe(root);
  new ResizeObserver(draw).observe(board);
  function motionPreference(){play.hidden=reduced.matches;root.querySelector('.arch-reduced').hidden=!reduced.matches;if(reduced.matches)stop();}
  reduced.addEventListener('change',motionPreference);motionPreference();
  root.querySelector('.arch-controls').hidden=false;counter.hidden=false;svg.removeAttribute('hidden');select(0);draw();
}
for(const explorer of document.querySelectorAll('[data-architecture-explorer]')){
  const picker=explorer.querySelector('[data-arch-select]');
  const members=maps.filter(map=>explorer.contains(map.root));
  function show(){for(const map of members){map.stop();map.root.hidden=map.root.dataset.architecture!==picker.value;}}
  picker.closest('label').hidden=false;picker.addEventListener('change',show);
  const target=location.hash.slice(1);const matching=members.find(map=>[...map.root.querySelectorAll('[data-arch-panel]')].some(panel=>panel.id===target));
  if(matching)picker.value=matching.root.dataset.architecture;
  show();
}
// Deep links keep their native destination and selected explanation on reload.
for(const map of maps){const panels=[...map.root.querySelectorAll('[data-arch-panel]')];const index=panels.findIndex(panel=>panel.id===location.hash.slice(1));if(index>=0)map.select(index);}
