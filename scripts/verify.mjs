import {readFile, stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'../dist');
const routes=['','about/','menu/','farm/','visit/'];
const pages=new Map();
const titles=new Set(),descriptions=new Set();
let assets=0,links=0;
for(const route of routes){
 const html=await readFile(path.join(root,route,'index.html'),'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,'Duplicate IDs on '+route);
 assert.equal((html.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1,'Exactly one H1 on '+route);
 const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
 const description=html.match(/name="description" content="([^"]+)"/)?.[1];
 assert(title&&description,'Metadata on '+route);
 titles.add(title);descriptions.add(description);
 assert(html.includes('rel="canonical" href="https://crestix-company.github.io/fuyu/'+route+'"'),'Canonical matches public path');
 assert(!/calendar-days|month-prev|calendar-card/.test(html),'No fabricated local calendar events');
 assert(!/TODO|CONTENT -->|準備中|サンプルテキスト|\{\{/.test(html),'No unfinished content on '+route);
 assert(!html.includes('hero-control')&&!html.includes('motion-toggle'),'Hero controls remain removed');
 for(const img of html.matchAll(/<img\b[^>]+>/g)){
  assert(/\balt="[^"]+"/.test(img[0]),'Image alt on '+route);
  assert(/\bwidth=/.test(img[0])&&/\bheight=/.test(img[0]),'Image dimensions on '+route);
 }
 const nav=html.match(/<nav id="navigation"[\s\S]+?<\/nav>/)?.[0];
 assert.equal((nav.match(/aria-current="page"/g)||[]).length,1,'Current page marker '+route);
 assert.equal((nav.match(/<a /g)||[]).length,5,'Five pages in primary navigation');
 pages.set(route,{html,ids});
}
assert.equal(titles.size,5,'Unique titles');assert.equal(descriptions.size,5,'Unique descriptions');
for(const [route,{html}] of pages){
 const refs=[...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
 for(const match of html.matchAll(/srcset="([^"]+)"/g))refs.push(...match[1].split(',').map(x=>x.trim().split(' ')[0]));
 for(const ref of refs){
  if(/^(?:https?:|tel:|data:)/.test(ref))continue;
  assert(!ref.startsWith('/'),'Local links support the /fuyu/ prefix');
  const url=new URL(ref,'https://preview.test/fuyu/'+route);
  assert(url.pathname.startsWith('/fuyu/'),'Link escapes prefix: '+ref);
  const relative=decodeURIComponent(url.pathname.slice('/fuyu/'.length));
  const file=path.join(root,relative.endsWith('/')?relative+'index.html':relative);
  assert((await stat(file)).size>0,'Empty or missing resource: '+ref);
  if(relative.includes('assets/'))assets++;
  else{
   const target=pages.get(relative.replace(/index\.html$/,''));
   assert(target,'Unknown page: '+ref);
   if(url.hash)assert(target.ids.includes(decodeURIComponent(url.hash.slice(1))),'Broken anchor '+route+' → '+ref);
   links++;
  }
 }
}
const menu=pages.get('menu/').html, farm=pages.get('farm/').html, visit=pages.get('visit/').html;
for(const fact of ['4つ以上','1つから','30分以内','肉や卵','第2・第4金曜'])assert(menu.includes(fact),'Menu fact: '+fact);
for(const fact of ['2025年','年間契約','7〜8','1〜5月','週に1回'])assert(farm.includes(fact),'Farm fact: '+fact);
for(const fact of ['0255226568','下新町1057-2','前日まで','2名様以上','縦列駐車','上越IC','12:00〜14:00','14:00〜16:00','17:30〜','18:30〜20:00'])assert(visit.includes(fact),'Visit fact: '+fact);
assert(pages.get('').html.length<menu.length,'Home is an introduction, not the full content page');
const css=await readFile(path.join(root,'assets/design.css'),'utf8');
const pageCss=await readFile(path.join(root,'assets/pages.css'),'utf8');
const js=await readFile(path.join(root,'assets/site.js'),'utf8');
assert(css.includes('prefers-reduced-motion')&&pageCss.includes('prefers-reduced-motion'),'Reduced-motion CSS');
assert(!js.includes('setInterval'),'No ongoing hero animation without controls');
assert(js.includes("e.key==='Escape'"),'Menu closes via Escape');
assert(!/url\(\s*["']?\//.test(css+pageCss),'Relative CSS resources');
const workflow=await readFile(path.resolve(root,'../.github/workflows/pages.yml'),'utf8');
assert(workflow.includes('path: dist'),'Pages uploads dist, not repository root');
assert(workflow.includes('branches: [main]'),'Publish main branch');
console.log('PASS: 5 pages; '+links+' page/anchor links; '+assets+' asset references; metadata, content, motion, Pages base path.');
