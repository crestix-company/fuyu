import {readFile, access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../dist');
const html=await readFile(path.join(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate IDs');
const refs=[...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
let files=0,anchors=0;
for(const ref of refs){
 if(ref.startsWith('#')){assert(ids.includes(ref.slice(1)),`Broken anchor ${ref}`);anchors++;}
 else if(!/^(?:https?:|tel:|data:)/.test(ref)){await access(path.join(root,ref.split('?')[0]));files++;}
}
for(const match of html.matchAll(/srcset="([^"]+)"/g))for(const ref of match[1].split(','))await access(path.join(root,ref.trim().split(' ')[0]));
for(const img of html.matchAll(/<img\b[^>]+>/g)){assert(/\balt="[^\"]+"/.test(img[0]),'Image missing alt');assert(/\bwidth=/.test(img[0])&&/\bheight=/.test(img[0]),'Image missing dimensions');}
assert.equal((html.match(/<h1>/g)||[]).length,1,'Exactly one H1');
assert(!/calendar-days|month-prev|calendar-card/.test(html),'Google Calendar integration is on hold');
assert(!/TODO|CONTENT -->|準備中|サンプルテキスト/.test(html),'No unfinished content');
for(const phrase of ['0255226568','下新町1057-2','4つ以上','1つから','30分以内','年間契約','7〜8','第2・第4金曜','前日まで','2名様以上'])assert(html.includes(phrase),`Missing fact ${phrase}`);
const css=await readFile(path.join(root,'assets/design.css'),'utf8');
const js=await readFile(path.join(root,'assets/site.js'),'utf8');
assert(css.includes('prefers-reduced-motion'),'Reduced-motion CSS');
assert(!html.includes('hero-control')&&!html.includes('motion-toggle'),'Hero controls removed');
assert(!js.includes('setInterval'),'No ongoing hero animation without controls');
assert(js.includes("e.key==='Escape'"),'Menu can close via Escape');
for(const ref of refs)assert(!ref.startsWith('/'),'Local links must support the /fuyu/ Pages prefix');
assert(!/url\(\s*["']?\//.test(css),'CSS resources must be relative');
const workflow=await readFile(path.resolve(root,'../.github/workflows/pages.yml'),'utf8');
assert(workflow.includes('path: dist'),'Pages must upload dist, not the repository root');
assert(workflow.includes('branches: [main]'),'Publish the main branch');
console.log(`PASS: ${files} local asset references; ${anchors} anchors; image dimensions and alt; content, calendar hold, motion, deployment root.`);
