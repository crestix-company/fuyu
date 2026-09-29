import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const read=file=>readFile(new URL('../dist/'+file,import.meta.url),'utf8');
const visit=await read('visit/index.html');
const section=visit.match(/<section class="calendar-section[\s\S]+?<\/section>/)?.[0];
assert(section,'Calendar section exists');
assert(section.includes('id="calendar"')&&section.includes('aria-labelledby="calendar-heading"'),'Named, linkable calendar section');
const frames=[...section.matchAll(/<iframe\b[^>]+>/g)].map(match=>match[0]);
assert.equal(frames.length,2,'Separate monthly and agenda views');
for(const [index,frame] of frames.entries()){
 const src=frame.match(/\bsrc="([^"]+)"/)?.[1].replaceAll('&amp;','&');
 const url=new URL(src);
 assert.equal(url.origin,'https://calendar.google.com');
 assert.equal(url.pathname,'/calendar/embed');
 assert.equal(url.searchParams.get('src'),'onomisa.0033@gmail.com','Customer supplied calendar');
 assert.equal(url.searchParams.get('ctz'),'Asia/Tokyo');
 assert.equal(url.searchParams.get('hl'),'ja');
 assert.equal(url.searchParams.get('mode'),index===0?'MONTH':'AGENDA');
 assert.equal(url.searchParams.get('showNav'),'1','Visitors can change dates');
 assert.equal(url.searchParams.get('showDate'),'1','Current date range remains visible');
 assert(!url.searchParams.has('dates'),'Date range is not frozen at release time');
 assert(/title="[^"]+"/.test(frame)&&frame.includes('loading="lazy"'),'Accessible title and lazy loading');
}
assert(section.includes('target="_blank" rel="noopener noreferrer"'),'Direct fallback opens safely');
assert(section.includes('ご予約・お問い合わせは、お電話'),'Calendar is not a booking form');
assert(section.includes('予定が表示されない場合'),'Blocked embeds have a fallback');
for(const route of ['','about/','menu/','farm/','visit/']){
 const page=await read(route+'index.html');
 const footer=page.match(/<footer\b[\s\S]+?<\/footer>/)?.[0];
 assert(footer.includes('visit/#calendar'),'Calendar accessible from every footer: '+route);
 assert.equal((page.match(/class="calendar-section/g)||[]).length,route==='visit/'?1:0,'Embed only on visit page');
}
const home=await read('index.html');
assert(home.includes('href="visit/#calendar"'),'Homepage calendar shortcut');
const homeEntry=home.indexOf('<aside class="home-calendar');
assert(homeEntry>home.indexOf('class="hero"')&&homeEntry<home.indexOf('class="home-about'),'Calendar entry directly follows hero, before editorial content');
assert.equal((home.match(/営業カレンダーを見る/g)||[]).length,1,'Homepage primary calendar entry is not duplicated at the bottom');
const planning=visit.match(/<div class="visit-planning wrap">([\s\S]+?)<section class="access-section/)?.[1];
assert(planning?.includes('id="hours"')&&planning.includes('id="calendar"'),'Hours and calendar form one visit-planning block before access');
const visitMain=visit.match(/<main\b[\s\S]+?<\/main>/)?.[0];
assert(visitMain.indexOf('id="calendar"')<visitMain.indexOf('<img'),'Calendar comes before store photography on visit page');
assert(visit.includes('alt="冬の日の入口"'),'Entrance photo is retained in access information');
assert(visit.includes('href="#calendar"'),'Visit page calendar shortcut');
const css=await read('assets/pages.css');
assert(css.includes('.calendar-panel .calendar-agenda{display:none}'),'Desktop agenda is hidden');
const mobile=css.slice(css.indexOf('@media(max-width:760px)'));
assert(mobile.includes('.calendar-panel .calendar-month{display:none}')&&mobile.includes('.calendar-panel .calendar-agenda{display:block;height:480px}'),'Mobile agenda replaces monthly grid');
console.log('PASS: supplied public Google Calendar, responsive views, timezone, lazy loading, navigation and fallback.');
