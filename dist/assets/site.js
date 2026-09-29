document.documentElement.classList.add('js');
// Keep previously shared single-page section links useful after the split.
if(document.body.classList.contains('page-home')){
 const legacyRoutes={'#about':'about/','#food':'menu/','#meal':'menu/#meal','#cafe':'menu/#cafe','#takeout':'menu/#takeout','#night-cafe':'menu/#night-cafe','#farm':'farm/','#hours':'visit/#hours','#access':'visit/#access','#reservation':'visit/#reservation'};
 const destination=legacyRoutes[window.location.hash];
 if(destination)window.location.replace(new URL(destination,window.location.href));
}
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
const outsideMenu=[document.querySelector('main'),document.querySelector('footer')];
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.querySelector('.sr-only').textContent='メニューを開く';document.body.classList.remove('menu-open');outsideMenu.forEach(el=>el.removeAttribute('inert'));}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.querySelector('.sr-only').textContent=open?'メニューを閉じる':'メニューを開く';document.body.classList.toggle('menu-open',open);outsideMenu.forEach(el=>el.toggleAttribute('inert',open));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(!nav.classList.contains('open'))return;if(e.key==='Escape'){closeMenu();toggle.focus();}if(e.key==='Tab'){const items=[...document.querySelectorAll('.header a,.header button')].filter(el=>el.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
window.addEventListener('resize',()=>{if(innerWidth>760)closeMenu();});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('[data-reveal]').forEach(el=>observer.observe(el));}else{document.querySelectorAll('[data-reveal]').forEach(el=>el.classList.add('visible'));}
