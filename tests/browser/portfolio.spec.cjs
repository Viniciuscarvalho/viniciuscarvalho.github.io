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
