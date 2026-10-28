import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const architecture=JSON.parse(await readFile('_data/architecture.json','utf8'));
const projects=JSON.parse(await readFile('_data/projects.json','utf8'));
test('every published project has a localized, sourced graph with valid relationships',()=>{
 assert.deepEqual(architecture.graphs.map(g=>g.id),['method',...projects.map(p=>p.slug)]);
 for(const graph of architecture.graphs){
  const ids=graph.nodes.map(n=>n.id);assert.equal(new Set(ids).size,ids.length);
  assert(graph.nodes.length>=5);assert(graph.edges.length>=4);assert(graph.sources.length);
  for(const lang of ['pt','en']){assert(graph.title[lang]);assert(graph.description[lang]);assert(graph.principle[lang]);for(const node of graph.nodes){assert(node.label[lang]);assert(node.detail[lang]);}for(const edge of graph.edges)assert(edge.label[lang]);}
  for(const edge of graph.edges){assert(ids.includes(edge.source));assert(ids.includes(edge.target));assert.notEqual(edge.source,edge.target);}
  for(const node of graph.nodes){assert(node.column>=1&&node.column<=3);assert(node.row>=1);assert(graph.edges.some(e=>e.source===node.id||e.target===node.id));}
  for(const source of graph.sources)assert.match(source.url,/^https:\/\/github.com\/Viniciuscarvalho\/[^/]+\/blob\/main\/README.md$/);
 }
});
