import {readFile,writeFile,mkdir,copyFile,cp,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import QRCode from 'qrcode';
import sharp from 'sharp';
import {parse} from 'yaml';
const config=parse(await readFile('_config.yml','utf8'));
const url=new URL(process.env.SITE_URL||config.url);
if(url.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(url.hostname))throw Error('Expected HTTPS URL');
const base=new URL((config.baseurl||'')+'/',url);const cardUrl=new URL('card/',base).href;
await mkdir('assets/generated/fonts',{recursive:true});
for(const name of ['space-grotesk','geist','jetbrains-mono']){
 const weight=name==='space-grotesk'?700:400;
 const file=`${name}-latin-${weight}-normal.woff2`;
 await copyFile(`node_modules/@fontsource/${name}/files/${file}`,`assets/generated/fonts/${file}`);
 await cp(`node_modules/@fontsource/${name}/LICENSE`,`assets/generated/fonts/${name}-LICENSE`);
}
const c=JSON.parse(await readFile('_data/content.json','utf8'));
if(c.portrait?.approved){await sharp(c.portrait.source.replace(/^\//,'')).resize({width:640,withoutEnlargement:true}).webp({quality:82}).toFile('assets/generated/portrait.webp');}
const escapeVcf=value=>value.replaceAll('\\','\\\\').replaceAll('\n','\\n').replaceAll(';','\\;').replaceAll(',','\\,');
const vcard=['BEGIN:VCARD','VERSION:3.0','N:Marques;Vinicius;Carvalho;;',`FN:${escapeVcf(c.full_name)}`,`TITLE:${c.role}`,`EMAIL;TYPE=INTERNET:${c.email}`,`URL:${cardUrl}`,'END:VCARD',''].join('\r\n');
await writeFile('assets/generated/vinicius-carvalho.vcf',vcard);
await writeFile('assets/generated/site.json',JSON.stringify({baseUrl:base.href,cardUrl}));
await writeFile('assets/generated/card-qr.svg',await QRCode.toString(cardUrl,{type:'svg',margin:4,errorCorrectionLevel:'M'}));
await QRCode.toFile('assets/generated/card-qr.png',cardUrl,{width:900,margin:4,errorCorrectionLevel:'M'});
await writeFile('assets/generated/favicon.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0a0a0c"/><text x="8" y="42" font-size="30" font-family="monospace" fill="#ff5a1f">VC</text></svg>');
for(const lang of ['pt','en']){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0a0a0c"/><path d="M70 90H1130M70 540H1130" stroke="#26262c"/><text x="75" y="65" fill="#ff5a1f" font-family="sans-serif" font-size="20">THE PIPELINE / ENGINEERING</text><text x="70" y="245" fill="#f2efe8" font-family="sans-serif" font-size="88" font-weight="bold">Vinicius Carvalho</text><text x="75" y="315" fill="#f2efe8" font-family="sans-serif" font-size="36">Senior Software Engineer</text><text x="75" y="400" fill="#9a9aa3" font-family="monospace" font-size="23">Mobile Architecture · AI Engineering</text><text x="75" y="440" fill="#9a9aa3" font-family="monospace" font-size="23">Developer Experience</text><text x="75" y="590" fill="#ff5a1f" font-family="monospace" font-size="20">${lang==='pt'?'PROJETOS, SISTEMAS E FERRAMENTAS':'PROJECTS, SYSTEMS AND TOOLS'} ↗</text></svg>`;
 await sharp(Buffer.from(svg)).png().toFile(`assets/generated/og-${lang}.png`);
}
let sha='local';try{sha=execFileSync('git',['rev-parse','--short','HEAD'],{encoding:'utf8'}).trim();}catch{}
await writeFile('_data/build.json',JSON.stringify({sha:process.env.GITHUB_SHA?.slice(0,7)||sha,date:new Date().toISOString().slice(0,10)}));
await rm('assets/dist',{recursive:true,force:true});
await build({entryPoints:['assets/src/card.js','assets/src/home.js','assets/src/architecture.js'],bundle:true,splitting:true,format:'esm',outdir:'assets/dist',minify:true,target:['safari16','chrome110'],metafile:true}).then(async result=>writeFile('assets/generated/bundle-meta.json',JSON.stringify(result.metafile)));
console.log('Built static networking assets and JS. QR target:',cardUrl);
