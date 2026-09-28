import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=await readFile(new URL('../dist/assets/site.js',import.meta.url),'utf8');
function element(){const attributes={},classes=new Set(),events={};return{attributes,events,textContent:'',classList:{add:v=>classes.add(v),remove:v=>classes.delete(v),contains:v=>classes.has(v),toggle:(v,b)=>{b=b??!classes.has(v);b?classes.add(v):classes.delete(v);return b;}},setAttribute:(k,v)=>attributes[k]=v,getAttribute:k=>attributes[k],removeAttribute:k=>delete attributes[k],toggleAttribute:(k,v)=>v?attributes[k]='':delete attributes[k],addEventListener:(k,v)=>events[k]=v,getClientRects:()=>[{}],focus(){},querySelector:()=>label,querySelectorAll:()=>links};}
let label,links;
function setup(reduce){label=element();links=[element(),element()];const toggle=element(),nav=element(),main=element(),footer=element(),motion=element(),number=element(),frames=[element(),element(),element()],dots=[element(),element(),element()],reveals=[element()],events={};const timers=new Map();let timerId=0;const media={matches:reduce,addEventListener:(n,f)=>media.change=f};const selectors={'.menu-toggle':toggle,'#navigation':nav,main,footer,'#motion-toggle':motion,'#slide-number':number};const document={documentElement:element(),body:element(),hidden:false,activeElement:toggle,querySelector:s=>selectors[s],querySelectorAll:s=>s==='.hero-frame'?frames:s==='.slide-dot'?dots:s==='[data-reveal]'?reveals:[toggle,...links],addEventListener:(n,f)=>events[n]=f};const context={document,window:{matchMedia:()=>media,addEventListener(){}},innerWidth:390,setInterval:f=>{timers.set(++timerId,f);return timerId;},clearInterval:i=>timers.delete(i)};vm.runInNewContext(source,context);return{toggle,nav,main,footer,motion,number,frames,dots,events,timers,media,document,reveals};}
const normal=setup(false);
assert.equal(normal.timers.size,0);
normal.toggle.events.click();assert.equal(normal.toggle.attributes['aria-expanded'],'true');assert('inert' in normal.main.attributes);
normal.events.keydown({key:'Escape'});assert.equal(normal.toggle.attributes['aria-expanded'],'false');assert(!('inert' in normal.main.attributes));
const reduced=setup(true);assert.equal(reduced.timers.size,0);assert(reduced.reveals[0].classList.contains('visible'));
const css=await readFile(new URL('../dist/assets/design.css',import.meta.url),'utf8');
assert(css.includes('prefers-reduced-motion:reduce'));assert(css.includes('animation-duration:.01ms!important'));
assert(css.includes('hero-arrive 1.8s'));assert(!css.includes('infinite'));
console.log('PASS: finite hero entrance; no autoplay; reduced-motion CSS; menu/Escape/inert; reveal fallback.');
