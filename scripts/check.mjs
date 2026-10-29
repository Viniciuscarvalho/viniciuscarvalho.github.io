import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {parse} from 'yaml';
const c=JSON.parse(await readFile('_data/content.json','utf8'));const projects=JSON.parse(await readFile('_data/projects.json','utf8'));const config=parse(await readFile('_config.yml','utf8'));
const generated=JSON.parse(await readFile('assets/generated/site.json','utf8'));
assert.equal((await readFile('CNAME','utf8')).trim(),new URL(config.url).hostname,'CNAME must match the canonical hostname');
assert.equal(generated.baseUrl,new URL((config.baseurl||'')+'/',config.url).href,'Generated assets must use the Jekyll canonical URL');
assert.equal(projects.length,6);assert.deepEqual(Object.keys(c.pt).sort(),Object.keys(c.en).sort());
assert.equal(new Set(projects.map(p=>p.slug)).size,6);
for(const p of projects)for(const lang of ['pt','en']){assert(p[lang].description);assert(p[lang].flow.length>2);}
const vcf=await readFile('assets/generated/vinicius-carvalho.vcf','utf8');assert(vcf.startsWith('BEGIN:VCARD\r\n'));assert(!vcf.replaceAll('\r\n','').includes('\n'));assert(vcf.includes(c.email));
let bytes=0;for(const file of await readdir('assets/dist')){if(file.endsWith('.js'))bytes+=gzipSync(await readFile(`assets/dist/${file}`)).length;}
assert(bytes<200*1024,`JS budget exceeded: ${bytes}`);
if(process.argv.includes('--site')){
 assert.equal((await readFile('_site/CNAME','utf8')).trim(),new URL(config.url).hostname);
 for(const path of ['index.html','en/index.html','card/index.html','en/card/index.html',...projects.flatMap(p=>[`projetos/${p.slug}/index.html`,`en/projects/${p.slug}/index.html`])]){
 const html=await readFile(`_site/${path}`,'utf8');assert(!html.includes('{{'));assert(!html.includes('{%'));assert(html.includes('rel="canonical"'));assert(html.includes('<html lang='));
 const expected=new URL(path.replace(/index\.html$/,''),generated.baseUrl).href;
 assert(html.includes(`rel="canonical" href="${expected}"`),`Canonical and generated assets disagree for ${path}`);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)){const target=decodeURIComponent(match[1]);await stat('_site'+target+(target.endsWith('/')?'index.html':''));}
 }
 for(const path of ['blog/index.html','apps/index.html','sobre/index.html','thais/index.html'])await stat('_site/'+path);
 const ptPosts=JSON.parse(await readFile('_site/search.json','utf8'));
 const enPosts=JSON.parse(await readFile('_site/en/search.json','utf8'));
 assert.equal(ptPosts.length,enPosts.length,'Every article needs an English counterpart');
 const appFiles=(await readdir('_apps')).filter(file=>file.endsWith('-en.md'));
 const enRoutes=['/en/','/en/card/','/en/apps/','/en/blog/','/en/about/','/en/404.html',...appFiles.map(file=>`/en/apps/${file.replace('-en.md','')}/`),...enPosts.map(post=>post.url)];
 for(const route of enRoutes){
  const path=decodeURI(route)+(route.endsWith('/')?'index.html':'');
  const html=await readFile('_site'+path,'utf8');
  assert(html.includes('<html lang="en-US">'),'Incorrect English language tag: '+route);
  assert(html.includes('hreflang="pt-BR"')&&html.includes('hreflang="en-US"'),'Missing reciprocal language links: '+route);
  for(const match of html.matchAll(/<a class="locale" href="([^"#?]+)"/g)){
   const target=decodeURI(match[1]);await stat('_site'+target+(target.endsWith('/')?'index.html':''));
  }
 }
 assert(ptPosts.every(post=>!post.url.startsWith('/en/')),'English article in PT search');
 assert(enPosts.every(post=>post.url.startsWith('/en/')),'PT article in English search');

}
console.log(`Content, vCard and JS budget passed (${bytes} bytes gzip across all chunks).`);
