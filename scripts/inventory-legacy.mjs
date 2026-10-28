import {mkdtemp,readdir,writeFile,mkdir,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
const base='9925b3685070c14440c94c154dc4826bc08127aa';
const source=await mkdtemp(join(tmpdir(),'pipeline-legacy-')),destination=await mkdtemp(join(tmpdir(),'pipeline-legacy-site-'));
const archive=execFileSync('git',['archive',base],{maxBuffer:128*1024*1024});
const tar=spawnSync('tar',['-x','-C',source],{input:archive});if(tar.status)throw Error('Legacy archive failed');
execFileSync('bundle',['exec','jekyll','build','--source',source,'--destination',destination],{stdio:'inherit'});
async function walk(dir,prefix=''){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=join(prefix,entry.name);if(entry.isDirectory())result.push(...await walk(join(dir,entry.name),path));else if(path.endsWith('.html'))result.push(path);}return result;}
const routes=await walk(destination);const missing=[];for(const route of routes){try{await stat(join('_site',route));}catch{missing.push(route);}}
await mkdir('reports',{recursive:true});await writeFile('reports/legacy-urls.json',JSON.stringify({baseline:base,checkedAt:new Date().toISOString(),routes,missing},null,2));
if(missing.length)throw Error('Missing historical URLs: '+missing.join(', '));
console.log(`Preserved ${routes.length} historical HTML routes.`);
