const {test,expect}=require('@playwright/test');
const AxeBuilder=require('@axe-core/playwright').default;

test('all six maps and the process overview can be explored with keyboard',async({page})=>{
 await page.goto('/#architecture');const picker=page.locator('[data-arch-select]');await expect(picker).toBeVisible();
 for(const value of ['method','monozukuri','saveplace','ci-guard','swift-code-reviewer-skill','feature-marker','gastandoya-api']){
  await picker.selectOption(value);const map=page.locator(`[data-architecture="${value}"]`);await expect(map).toBeVisible();
  await expect(page.locator('[data-architecture]:visible')).toHaveCount(1);
  await expect(map.locator('svg')).toBeVisible();expect(await map.locator('svg path.arch-edge').first().evaluate(path=>path.getTotalLength())).toBeGreaterThan(0);
  const node=map.locator('[data-arch-target]').nth(1);await node.focus();await page.keyboard.press('Enter');
  await expect(node).toHaveAttribute('aria-current','step');await expect(map.locator('[data-arch-panel]:visible')).toHaveCount(1);
  await expect(map.locator('[data-arch-panel]:visible')).toHaveAttribute('data-arch-panel',await node.getAttribute('data-arch-target'));
 }
});

test('walkthrough advances, pauses and stops when the map changes',async({page})=>{
 await page.goto('/#architecture');const map=page.locator('[data-architecture="method"]');const play=map.locator('[data-arch-play]');
 await play.click();await expect(play).toHaveAttribute('aria-pressed','true');await expect(map).toHaveClass(/is-playing/);
 await expect(map.locator('[data-arch-target="spec"]')).toHaveAttribute('aria-current','step',{timeout:6000});
 await page.keyboard.press('Escape');await expect(play).toHaveAttribute('aria-pressed','false');
 await play.click();await page.locator('[data-arch-select]').selectOption('saveplace');await expect(play).toHaveAttribute('aria-pressed','false');
 await expect(map).toBeHidden();
});

test('reduced motion stops playback while preserving manual navigation',async({page})=>{
 await page.goto('/projetos/saveplace/');const map=page.locator('[data-architecture]');await map.locator('[data-arch-play]').click();
 await expect(map).toHaveClass(/is-playing/);await page.emulateMedia({reducedMotion:'reduce'});await expect(map).not.toHaveClass(/is-playing/);
 await expect(map.locator('[data-arch-play]')).toBeHidden();await map.locator('[data-arch-next]').click();await expect(map.locator('[data-arch-target="cache"]')).toHaveAttribute('aria-current','step');
 await expect(map.locator('[data-arch-panel="cache"]')).toBeVisible();
});

test('the documented branches stay readable without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:640}});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4182/projetos/ci-guard/');const map=page.locator('[data-architecture]');await expect(map.locator('[data-arch-panel]:visible')).toHaveCount(6);
 await map.locator('summary').click();await expect(map.locator('[data-from="classify"][data-to="patch"]')).toContainText('Branch ou desconhecido');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});

test('maps fit mobile and desktop at enlarged text and have no automated AA violations',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/en/#architecture');
 await page.locator('[data-arch-select]').selectOption('gastandoya-api');const map=page.locator('[data-architecture="gastandoya-api"]');
 await expect(map.locator('[data-arch-panel]:visible')).toContainText('documented headers');
 for(const width of [360,390,768,1440]){await page.setViewportSize({width,height:900});await page.addStyleTag({content:'body.pipeline{font-size:32px}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 const report=await new AxeBuilder({page}).include('#architecture').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(report.violations.map(v=>v.id)).toEqual([]);
});

test('offscreen diagrams pause and a node permalink selects the correct project',async({page})=>{
 await page.goto('/#arch-saveplace-provider');await expect(page.locator('[data-arch-select]')).toHaveValue('saveplace');const map=page.locator('[data-architecture="saveplace"]');
 await expect(map.locator('[data-arch-target="provider"]')).toHaveAttribute('aria-current','step');await map.locator('[data-arch-play]').click();await expect(map).toHaveClass(/is-playing/);
 await page.evaluate(()=>scrollTo(0,0));await expect(map).not.toHaveClass(/is-playing/);
});
