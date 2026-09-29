import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=await readFile(new URL('../dist/assets/site.js',import.meta.url),'utf8');
const routing=source.slice(source.indexOf('if(document.body'),source.indexOf('const toggle='));
assert(routing.includes('legacyRoutes'),'Legacy routing block is present');
const cases={
 '#about':'about/','#food':'menu/','#meal':'menu/#meal',
 '#cafe':'menu/#cafe','#takeout':'menu/#takeout','#night-cafe':'menu/#night-cafe',
 '#farm':'farm/','#hours':'visit/#hours','#access':'visit/#access','#reservation':'visit/#reservation',
};
for(const base of ['https://example.test/','https://example.test/fuyu/']){
 for(const [hash,target] of Object.entries(cases)){
  let destination;
  vm.runInNewContext(routing,{
   document:{body:{classList:{contains:()=>true}}},
   window:{location:{hash,href:base+hash,replace:url=>destination=url.href}},URL,
  });
  assert.equal(destination,base+target,'Legacy route '+base+hash);
 }
}
for(const hash of ['','#top','#discover','#site-top','#unknown']){
 vm.runInNewContext(routing,{
  document:{body:{classList:{contains:()=>true}}},
  window:{location:{hash,href:'https://example.test/fuyu/'+hash,replace:()=>assert.fail('Unexpected redirect: '+hash)}},URL,
 });
}
vm.runInNewContext(routing,{
 document:{body:{classList:{contains:()=>false}}},
 window:{location:{hash:'#cafe',href:'https://example.test/fuyu/menu/#cafe',replace:()=>assert.fail('Do not redirect nested page anchors')}},URL,
});
console.log('PASS: old section links redirect under root and /fuyu/; local and unknown anchors do not redirect.');
