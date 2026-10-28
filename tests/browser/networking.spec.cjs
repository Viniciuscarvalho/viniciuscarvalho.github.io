const {test,expect}=require('@playwright/test');

test('card works without JavaScript and in a short viewport',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:640}});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4182/card/');await expect(page.getByRole('heading',{level:1})).toHaveText('Vinicius Carvalho');
 await expect(page.locator('.socials a')).toHaveCount(4);await expect(page.getByRole('link',{name:'Salvar contato'})).toHaveAttribute('href',/\.vcf$/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});

test('flip manages hidden faces, stage traps focus and locale preserves stage',async({page})=>{
 await page.goto('/card/');await page.getByRole('button',{name:'Mostrar QR',exact:true}).click();
 await expect(page.locator('#card-back')).toBeVisible();await expect(page.locator('#card-front')).toHaveAttribute('inert','');
 await page.keyboard.press('Escape');await expect(page.locator('#card-front')).toBeVisible();
 await page.getByRole('button',{name:'Modo palco',exact:true}).click();await expect(page).toHaveURL(/stage=1/);
 await page.keyboard.press('Tab');await expect(page.locator('[data-exit-stage]')).toBeFocused();
 await page.keyboard.press('Escape');await expect(page.locator('[data-stage]')).toBeFocused();await expect(page.locator('.stage-view')).toBeHidden();
 await page.goto('/en/card/?stage=1');await expect(page.locator('html')).toHaveAttribute('lang','en');await expect(page.locator('.stage-view')).toBeVisible();await page.keyboard.press('Escape');
 await expect(page.getByRole('button',{name:'Show QR',exact:true})).toBeVisible();
});

test('copy fallback exposes a selected URL when sharing and clipboard fail',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'share',{value:undefined,configurable:true});Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied');}},configurable:true});});
 await page.goto('/card/');await page.getByRole('button',{name:'Compartilhar',exact:true}).click();
 await expect(page.locator('.share-url')).toBeVisible();await expect(page.locator('.share-url')).toBeFocused();await expect(page.getByRole('status')).toHaveText('Copie o endereço abaixo.');
});

test('cancelling native share does not expose a false error',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('Cancelled','AbortError');}}));
 await page.goto('/card/');await page.getByRole('button',{name:'Compartilhar',exact:true}).click();await expect(page.locator('.share-url')).toBeHidden();await expect(page.locator('[data-feedback]')).toBeEmpty();
});

test('motion permission is requested only after a gesture and reduction disables it',async({page})=>{
 await page.addInitScript(()=>{window.__motionRequests=0;window.DeviceOrientationEvent=class extends Event{static requestPermission(){window.__motionRequests++;return Promise.resolve('granted');}};});
 await page.goto('/card/');expect(await page.evaluate(()=>window.__motionRequests)).toBe(0);
 await page.getByRole('button',{name:'Ativar movimento',exact:true}).click();await expect(page.locator('[data-gyro]')).toHaveAttribute('aria-pressed','true');expect(await page.evaluate(()=>window.__motionRequests)).toBe(1);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('[data-gyro]')).toBeHidden();await expect(page.locator('[data-gyro]')).toHaveAttribute('aria-pressed','false');
});

test('pixel title retains the accessible name and does not overflow at 200% text',async({page})=>{
 await page.goto('/card/');await expect(page.locator('h1')).toHaveClass(/pixel-title-ready/);await expect(page.getByRole('heading',{name:'Vinicius Carvalho',exact:true})).toBeVisible();
 await page.addStyleTag({content:'body.pipeline{font-size:32px}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('denied sensor permission leaves contact actions usable',async({page})=>{
 await page.addInitScript(()=>{window.DeviceOrientationEvent=class extends Event{static requestPermission(){return Promise.resolve('denied');}};});await page.goto('/card/');await page.getByRole('button',{name:'Ativar movimento',exact:true}).click();await expect(page.locator('[data-gyro]')).toHaveAttribute('aria-pressed','false');await expect(page.locator('[data-feedback]')).toContainText('indisponível');await expect(page.getByRole('link',{name:'Salvar contato'})).toBeVisible();
});

test('Escape cancels a flip before the midpoint without a stale face update',async({page})=>{
 await page.goto('/card/');await expect(page.locator('[data-flip]')).toBeVisible();
 await page.evaluate(()=>{document.querySelector('[data-flip]').click();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));});
 await expect(page.locator('[data-flip]')).toBeEnabled();await expect(page.locator('[data-flip]')).toHaveAttribute('aria-expanded','false');await expect(page.locator('#card-front')).toBeVisible();await expect(page.locator('#card-back')).toBeHidden();
});

test('the flip trigger keeps keyboard focus after both complete turns',async({page})=>{
 await page.goto('/card/');const trigger=page.locator('[data-flip]');
 await trigger.focus();await page.keyboard.press('Enter');
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 await expect(trigger).toHaveAttribute('aria-disabled','false');
 await expect(trigger).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(trigger).toHaveAttribute('aria-expanded','false');
 await expect(trigger).toHaveAttribute('aria-disabled','false');
 await expect(trigger).toBeFocused();
});
