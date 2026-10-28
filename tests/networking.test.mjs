import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import sharp from 'sharp';
test('vCard contains CRLF and approved public identity only',async()=>{const v=await readFile('assets/generated/vinicius-carvalho.vcf','utf8');assert(v.includes('FN:Vinicius Carvalho Marques\r\n'));assert(v.includes('EMAIL;TYPE=INTERNET:viniciuscarvalho789@gmail.com'));assert(!v.includes('TEL:'));assert(!v.replaceAll('\r\n','').includes('\n'));});
test('social preview is an actual 1200 by 630 PNG in both languages',async()=>{for(const lang of ['pt','en']){const meta=await sharp(`assets/generated/og-${lang}.png`).metadata();assert.equal(meta.width,1200);assert.equal(meta.height,630);assert.equal(meta.format,'png');}});
test('featured selection is exactly the three networking projects',async()=>{const projects=JSON.parse(await readFile('_data/projects.json','utf8'));assert.deepEqual(projects.filter(p=>p.featured).map(p=>p.repository),['monozukuri','swift-code-reviewer-skill','Feature-marker']);});
test('localized studies have paired permalinks',async()=>{const projects=JSON.parse(await readFile('_data/projects.json','utf8'));for(const p of projects){const pt=await readFile(`_projects/${p.slug}-pt.md`,'utf8'),en=await readFile(`_projects/${p.slug}-en.md`,'utf8');assert(pt.includes(`alternate: /en/projects/${p.slug}/`));assert(en.includes(`alternate: /projetos/${p.slug}/`));}});
