import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {parse} from 'yaml';
async function document(path){const source=await readFile(path,'utf8');const [,header,body]=source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);return{meta:parse(header),body};}
const fences=body=>(body.match(/```[^\n]*\n[\s\S]*?```|~~~[^\n]*\n[\s\S]*?~~~/g)||[]).map(block=>block.split('\n').map(line=>line.trimEnd()).join('\n'));
test('every archived article has a complete English counterpart with unchanged code examples',async()=>{
 const files=(await readdir('_posts')).filter(f=>/\.(md|markdown)$/.test(f)&&!f.endsWith('-en.md'));
 assert.equal(files.length,21);
 for(const file of files){const original=await document('_posts/'+file),translated=await document('_posts/'+file.replace(/\.(md|markdown)$/,'-en.md'));
  assert.equal(original.meta.lang,'pt');assert.equal(translated.meta.lang,'en');
  assert.equal(original.meta.alternate,translated.meta.permalink);assert.equal(original.meta.alternate,'/en'+translated.meta.alternate);
  assert.equal(original.meta.date,translated.meta.date);assert(translated.body.trim().length>100,file);
  assert.deepEqual(fences(translated.body),fences(original.body),'Changed code in '+file);
 }
});
test('all app detail routes have reciprocal language links',async()=>{
 for(const file of (await readdir('_apps')).filter(f=>!f.endsWith('-en.md'))){const original=await document('_apps/'+file),translated=await document('_apps/'+file.replace('.md','-en.md'));
  assert.equal(translated.meta.permalink,original.meta.alternate);assert.equal(translated.meta.alternate,'/apps/'+file.replace('.md','')+'/');assert.equal(translated.meta.lang,'en');assert(translated.body.trim());
 }
});
test('locale dictionary and search indices cover both language variants',async()=>{
 const content=JSON.parse(await readFile('_data/content.json','utf8'));
 assert.deepEqual(Object.keys(content.en).sort(),Object.keys(content.pt).sort());assert.equal(content.en.lang,'en-US');assert.equal(content.pt.lang,'pt-BR');
 assert.equal(content.en.blog_url,'/en/blog/');assert.equal(content.en.apps_url,'/en/apps/');
 for(const path of ['search.json','en/search.json']){const {meta,body}=await document(path);assert(['pt','en'].includes(meta.lang));assert(body.includes("where: 'lang', page.lang"));assert(body.includes('post.title | jsonify'));}
});
