import {readFile, writeFile, mkdir} from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const template=await readFile(path.join(root,'src/layout.html'),'utf8');
const pages=[
 {slug:'home',label:'トップ',title:'Farmer’s table 冬の日｜種まきからの食卓',description:'新潟県上越市の Farmer’s table 冬の日。種まきからの食卓を大切に、季節の料理と喫茶、農作業体験型の野菜販売をご案内します。ご予約はお電話で。'},
 {slug:'about',label:'冬の日について',title:'冬の日について｜Farmer’s table 冬の日',description:'土に触れ、野菜を育て、料理をする。新潟県上越市の Farmer’s table 冬の日が大切にする、畑と台所がつながる時間。店内や庭の様子をご紹介します。'},
 {slug:'menu',label:'料理とメニュー',title:'料理とメニュー｜Farmer’s table 冬の日',description:'冬の日の昼食と夕食、喫茶と夜喫茶、お弁当・オードブルのご案内。野菜を中心にしたおかずやカレー、ケーキを囲んで季節の食卓をお楽しみください。'},
 {slug:'farm',label:'畑と野菜販売',title:'畑と野菜販売｜Farmer’s table 冬の日',description:'週に1回程度、農作業をお手伝いいただく体験型の野菜販売。6〜11月を中心に、畑の恵みをお届けします。年間契約や農作業についてお気軽にご相談ください。'},
 {slug:'visit',label:'店舗情報・ご予約',title:'店舗情報・ご予約｜Farmer’s table 冬の日',description:'新潟県上越市下新町1057-2、上越ICより車で約10分。冬の日の営業時間、地図、駐車場のご案内。ご予約・お問い合わせは025-522-6568へ。'},
];

for(const page of pages){
 const prefix=page.slug==='home'?'./':'../';
 const href=other=>prefix+(other.slug==='home'?'':other.slug+'/');
 const navLink=other=>`<a href="${href(other)}"${other.slug===page.slug?' aria-current="page"':''}>${other.label}</a>`;
 const replacements={
  ...page,
  root:prefix,
  canonical:'https://crestix-company.github.io/fuyu/'+(page.slug==='home'?'':page.slug+'/'),
  navigation:pages.map(navLink).join(''),
  footerNavigation:pages.map(navLink).join('')+`<a href="${prefix}visit/#calendar">営業カレンダー</a><a href="${prefix}visit/#reservation">ご予約・お問い合わせ</a>`,
  breadcrumb:page.slug==='home'?'':`<nav class="breadcrumb wrap" aria-label="パンくずリスト"><a href="${prefix}">トップ</a><span aria-hidden="true">／</span><span aria-current="page">${page.label}</span></nav>`,
  content:await readFile(path.join(root,'src/pages',page.slug+'.html'),'utf8'),
 };
 const html=template.replace(/\{\{(\w+)\}\}/g,(_,key)=>{
  if(!(key in replacements))throw Error('Missing template value: '+key);
  return replacements[key];
 }).replaceAll('"assets/','"'+prefix+'assets/').replaceAll(', assets/',', '+prefix+'assets/')
 .replace('class="back-top" href="#top"','class="back-top" href="#site-top"');
 const output=path.join(root,'dist',page.slug==='home'?'':page.slug);
 await mkdir(output,{recursive:true});
 await writeFile(path.join(output,'index.html'),html);
}
console.log('Built 5 static pages: home, about, menu, farm, visit.');
