import {readFile,writeFile} from 'node:fs/promises';
const projects=JSON.parse(await readFile('_data/projects.json','utf8'));
const previous=JSON.parse(await readFile('_data/github.json','utf8'));
for(const p of projects){
 try{
 const response=await fetch(`https://api.github.com/repos/Viniciuscarvalho/${encodeURIComponent(p.repository)}`,{headers:{Accept:'application/vnd.github+json',...(process.env.GH_READ_TOKEN?{Authorization:`Bearer ${process.env.GH_READ_TOKEN}`}:{})},signal:AbortSignal.timeout(8000)});
 if(!response.ok)throw Error('unavailable');const data=await response.json();
 if(!Number.isInteger(data.stargazers_count))throw Error('invalid');
 previous[p.repository]={stars:data.stargazers_count,fetchedAt:new Date().toISOString(),url:data.html_url};
 }catch{console.warn(`Snapshot unavailable for ${p.repository}; preserving previous data.`);}
}
await writeFile('_data/github.json',JSON.stringify(previous,null,2)+'\n');
