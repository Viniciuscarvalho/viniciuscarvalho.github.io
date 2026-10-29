const {test,expect}=require('@playwright/test');
for(const [pt,en,title] of [['/','/en/','Software engineering'],['/card/','/en/card/','Vinicius Carvalho'],['/apps/','/en/apps/','Apps'],['/sobre/','/en/about/',''],['/blog/','/en/blog/','Blog'],['/apps/gastandoya/','/en/apps/gastandoya/','GastandoYa'],['/projetos/saveplace/','/en/projects/saveplace/','SavePlace']]){
 test(`language switch preserves the page without JavaScript: ${pt}`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto('http://127.0.0.1:4182'+pt);
  const switcher=page.getByRole('group',{name:'Idioma',exact:true});await expect(switcher.getByRole('link',{name:'PT-BR',exact:true})).toHaveAttribute('aria-current','page');
  await switcher.getByRole('link',{name:'EN-US',exact:true}).click();await expect(page).toHaveURL('http://127.0.0.1:4182'+en);await expect(page.locator('html')).toHaveAttribute('lang','en-US');
  await expect(page.getByRole('group',{name:'Language',exact:true})).toBeVisible();if(title)await expect(page.locator('h1')).toContainText(title);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('link',{name:'PT-BR',exact:true}).click();await expect(page).toHaveURL('http://127.0.0.1:4182'+pt);await context.close();
 });
}
test('English navigation and search stay in English, including article bodies',async({page})=>{
 await page.goto('/en/');await page.locator('.footer').getByRole('link',{name:'Blog',exact:false}).click();await expect(page).toHaveURL('/en/blog/');
 const index=await (await page.request.get('/en/search.json')).json();const ptIndex=await (await page.request.get('/search.json')).json();expect(index).toHaveLength(21);expect(ptIndex).toHaveLength(21);expect(index.every(post=>post.url.startsWith('/en/'))).toBe(true);expect(ptIndex.every(post=>!post.url.startsWith('/en/'))).toBe(true);
 await page.getByRole('textbox',{name:'Search articles…'}).fill('Building a Design System');const result=page.locator('#search-results a').first();await expect(result).toContainText('Building a Design System');await result.click();await expect(page.locator('article')).toContainText('Moving beyond a rigid initializer');await expect(page.locator('article')).not.toContainText('Como resolver esse init engessado');
 await page.getByRole('link',{name:'PT-BR',exact:true}).click();await expect(page.locator('article')).toContainText('Como resolver esse init engessado');
});
test('mobile menu links preserve the English locale',async({page})=>{await page.goto('/en/apps/');await page.getByRole('button',{name:'Open menu'}).click();await page.locator('#mobile-nav').getByRole('link',{name:'About',exact:true}).click();await expect(page).toHaveURL('/en/about/');await expect(page.locator('main')).toContainText('What I do');});
