const {test,expect}=require('@playwright/test');
test.use({viewport:{width:1440,height:1000}});
test('gallery remains reachable through filters, keyboard and reduced motion',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('/');
 await expect(page.locator('.motion-lens')).toBeAttached();await expect(page.locator('h1 .sr-only')).toHaveCount(1);
 await page.getByRole('button',{name:'Backend',exact:true}).click();await expect(page.locator('.project-card:visible')).toHaveCount(2);await expect(page.locator('.is-pinned')).toHaveCount(0);
 await page.getByRole('button',{name:'Todos',exact:true}).click();await expect(page.locator('.is-pinned')).toHaveCount(1);
 await page.getByRole('button',{name:'Usar grade',exact:true}).click();await expect(page.locator('.is-pinned')).toHaveCount(0);
 await page.locator('[data-skill="0"]').focus();await page.keyboard.press('End');await expect(page.locator('[data-skill="4"]')).toHaveAttribute('aria-pressed','true');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.motion-lens')).toHaveCount(0);await expect(page.locator('.is-pinned')).toHaveCount(0);
 await page.emulateMedia({reducedMotion:'no-preference'});await expect(page.locator('.motion-lens')).toBeAttached();expect(errors).toEqual([]);
});
test('a direct EN case route and its PT counterpart are static',async({page})=>{await page.goto('/en/projects/monozukuri/');await expect(page.locator('html')).toHaveAttribute('lang','en');await expect(page.getByRole('heading',{level:1})).toHaveText('monozukuri');await page.getByRole('link',{name:'PT',exact:true}).click();await expect(page).toHaveURL(/\/projetos\/monozukuri\//);await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');});

async function panTo(page,fraction){
 await expect(page.locator('.is-pinned')).toHaveCount(1);
 const scroll=await page.locator('.project-stage').evaluate((stage,f)=>{
  const distance=stage.querySelector('.project-grid').scrollWidth-stage.clientWidth;
  const origin=stage.parentElement.classList.contains('pin-spacer')?stage.parentElement:stage;
  return origin.getBoundingClientRect().top+window.scrollY-100+distance*f;
 },fraction);
 await page.evaluate(top=>window.scrollTo({top,behavior:'instant'}),scroll);
 await expect.poll(async()=>Math.round((await page.locator('.project-stage').boundingBox()).y)).toBe(100);
 let lastLeft=null;
 await expect.poll(async()=>{
  const left=(await page.locator('.project-grid').boundingBox()).x;
  const stable=lastLeft!==null&&Math.abs(lastLeft-left)<.1;lastLeft=left;return stable;
 }).toBe(true);
}

test('a real mouse click during the pan opens a visible project without moving its link',async({page})=>{
 await page.goto('/');await panTo(page,.6);
 const link=await page.locator('.project-link').evaluateAll(links=>links.map((el,index)=>{
  const r=el.getBoundingClientRect();return{index,x:r.x,y:r.y,width:r.width,height:r.height,href:el.href};
 }).find(r=>r.index>0&&r.x>10&&r.x+r.width<innerWidth-10&&r.y>0&&r.y+r.height<innerHeight));
 expect(link).toBeTruthy();
 await page.mouse.move(link.x+link.width/2,link.y+link.height/2);await page.mouse.down();
 await expect(page.locator('.is-pinned')).toHaveCount(1);
 const after=await page.locator('.project-link').nth(link.index).boundingBox();
 expect(Math.abs(after.x-link.x)).toBeLessThan(1);expect(Math.abs(after.y-link.y)).toBeLessThan(1);
 await page.mouse.up();await expect(page).toHaveURL(link.href);
});

test('keyboard focus still switches the gallery to the reachable grid',async({page})=>{
 await page.goto('/');await panTo(page,.5);
 await page.locator('[data-gallery-mode]').focus();await page.keyboard.press('Tab');
 await expect(page.locator('.is-pinned')).toHaveCount(0);
 await expect(page.locator('.project-link').first()).toBeFocused();
});

test('the clipping caption remains in the viewport through the pinned scene',async({page})=>{
 await page.goto('/');
 for(const progress of [.5,.9]){
  await panTo(page,progress);
  const box=await page.locator('.project-caption').boundingBox();
  expect(box.y).toBeGreaterThanOrEqual(0);expect(box.y+box.height).toBeLessThanOrEqual(1000);
  await expect(page.locator('.project-caption')).toHaveAttribute('data-index',/^[1-5]$/);
 }
});

test('a compatible browser creates and uses the SVG refraction filter',async({page})=>{
 await page.goto('/');
 await expect(page.locator('#pipeline-refraction feDisplacementMap')).toBeAttached();
 await expect(page.locator('.lens-copy')).toBeVisible();
 await expect(page.locator('.lens-text')).toHaveCSS('filter',/pipeline-refraction/);
});
