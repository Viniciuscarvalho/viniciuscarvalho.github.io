const {test,expect}=require('@playwright/test');
const AxeBuilder=require('@axe-core/playwright').default;
for(const route of ['/card/','/en/card/','/','/en/projects/monozukuri/']){
 test(`automated accessibility baseline ${route}`,async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(route);
  const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 });
}
