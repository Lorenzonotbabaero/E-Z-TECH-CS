document.getElementById('y').textContent=new Date().getFullYear();
// EmailJS settings: copy these three values from your emailjs.com dashboard
var EMAILJS={publicKey:'yWCbXVy9EpRv6Dt_c',serviceId:'service_kkyvims',templateId:'template_3adszsn'};
var f=document.getElementById('f'),st=document.getElementById('status'),btn=document.getElementById('send');
f.addEventListener('submit',function(e){
e.preventDefault();
var d=new FormData(f);
if(d.get('website')){f.reset();return}
function fail(){st.style.color='#B00020';st.textContent='Sorry, it did not send. Please email us at eztechcsbinanbranch@gmail.com.'}
if(/^YOUR_/.test(EMAILJS.publicKey)||/^YOUR_/.test(EMAILJS.serviceId)||/^YOUR_/.test(EMAILJS.templateId)){console.error('EmailJS is not set up yet: fill in EMAILJS in script.js');fail();return}
btn.disabled=true;st.style.color='';st.textContent='Sending...';
fetch('https://api.emailjs.com/api/v1.0/email/send',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({service_id:EMAILJS.serviceId,template_id:EMAILJS.templateId,user_id:EMAILJS.publicKey,
template_params:{name:d.get('name'),contact:d.get('contact'),service:d.get('service'),time:new Date().toLocaleString(),message:'Contact: '+d.get('contact')+'  |  Service: '+d.get('service')+'  |  Problem: '+d.get('msg')}})
}).then(function(r){
if(!r.ok)return r.text().then(function(t){throw new Error(t)});
f.reset();st.style.color='#0F6B3A';st.textContent='Thank you! We received your request and will contact you soon.';
}).catch(function(err){console.error(err);fail()}).then(function(){btn.disabled=false});
});

// Scroll reveal
(function(){
if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var els=document.querySelectorAll('h2.title,.lead,.about p,.row,.steps li,.info,#f,#techs');
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.15});
els.forEach(function(el){
var i=Array.prototype.indexOf.call(el.parentNode.children,el);
el.style.transitionDelay=Math.min(i,5)*80+'ms';
el.classList.add('reveal');io.observe(el);
});
})();

// Shared helper: only allow normal web links
function safeUrl(u){u=String(u||'').trim();if(!u)return '';if(!/^https?:\/\//i.test(u))u='https://'+u;return /^https?:\/\/[^\s]+$/i.test(u)?u:''}

// Technician cards, loaded from data/technicians.json (edited in admin)
(function(){
var box=document.getElementById('techs');if(!box)return;
var FB='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',PH='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>';
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e}
function chip(href,icon,label,external){
var a=el('a','chip');a.href=href;
if(external){a.target='_blank';a.rel='noopener noreferrer'}
a.insertAdjacentHTML('beforeend',icon);a.appendChild(el('span','',label));return a}
fetch('data/technicians.json?v='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(list){
if(!Array.isArray(list))return;
box.textContent='';
if(!list.length){box.appendChild(el('p','lead','No technician is listed right now. Please email us.'));return}
list.forEach(function(t){
var c=el('article','tech-card'),img=el('img','avatar');
img.src=t.photo||'';img.alt='Photo of technician '+(t.name||'');img.width=140;img.height=140;img.loading='lazy';
c.appendChild(img);
c.appendChild(el('h3','',t.name||''));
c.appendChild(el('p','role','Technician'));
var a=el('p','avail'),d=el('span','dot');d.setAttribute('aria-hidden','true');
a.appendChild(d);a.appendChild(document.createTextNode('Available'));
c.appendChild(a);
var acts=el('div','tech-actions'),phone=String(t.phone||'').trim(),fb=safeUrl(t.facebook);
if(phone)acts.appendChild(chip('tel:'+phone.replace(/[^\d+]/g,''),PH,phone,false));
if(fb)acts.appendChild(chip(fb,FB,'Facebook',true));
if(acts.children.length)c.appendChild(acts);
box.appendChild(c);
});
}).catch(function(){});
})();

// Social media icons, loaded from data/site.json (edited in admin)
(function(){
var boxes=document.querySelectorAll('[data-social]');if(!boxes.length)return;
var ICONS={
facebook:{label:'Facebook',svg:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'},
instagram:{label:'Instagram',svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>'},
tiktok:{label:'TikTok',svg:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 3c.3 2.3 1.7 4 4 4.2v3.2a7.4 7.4 0 0 1-4-1.3v6.1a6 6 0 1 1-6-6c.3 0 .7 0 1 .1v3.3a2.8 2.8 0 1 0 1.9 2.6V3h3.1z"/></svg>'}
};
fetch('data/site.json?v='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(s){
var keys=Object.keys(ICONS).filter(function(k){return safeUrl(s[k])});
if(!keys.length)return;
boxes.forEach(function(b){
keys.forEach(function(k){
var a=document.createElement('a');a.href=safeUrl(s[k]);a.target='_blank';a.rel='noopener noreferrer';
a.setAttribute('aria-label',ICONS[k].label);a.title=ICONS[k].label;a.innerHTML=ICONS[k].svg;b.appendChild(a)});
b.hidden=false});
document.querySelectorAll('[data-social-label]').forEach(function(l){l.hidden=false});
}).catch(function(){});
})();

// Mobile menu and active link
(function(){
var btn=document.getElementById('menuBtn'),nav=document.getElementById('nav');if(!btn||!nav)return;
function set(o){nav.classList.toggle('open',o);btn.setAttribute('aria-expanded',o?'true':'false')}
btn.addEventListener('click',function(){set(!nav.classList.contains('open'))});
nav.addEventListener('click',function(e){if(e.target.tagName==='A')set(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
if(!('IntersectionObserver' in window))return;
var links={};nav.querySelectorAll('a').forEach(function(a){links[a.dataset.id]=a});
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(!x.isIntersecting)return;
Object.keys(links).forEach(function(k){links[k].removeAttribute('aria-current')});
var a=links[x.target.id];if(a)a.setAttribute('aria-current','true')})},{rootMargin:'-40% 0px -55% 0px'});
Object.keys(links).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s)});
})();

// Clean URLs: /home, /about, /services, /process, /technician, /contact
(function(){
if(!/^https?:$/.test(location.protocol))return;
var map={home:'home',about:'about',services:'services',process:'how',technician:'technician',contact:'contact'};
var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function sec(p){return map[p.replace(/^\/+|\/+$/g,'')]}
function show(id,smooth){var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:smooth&&!rm?'smooth':'auto'})}
document.addEventListener('click',function(e){
if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target==='_blank')return;
var p=a.getAttribute('href'),id=sec(p);if(!id||p.charAt(0)!=='/')return;
e.preventDefault();
if(location.pathname.replace(/\/+$/,'')!==p)history.pushState(null,'',p);
show(id,true);
});
window.addEventListener('popstate',function(){var id=sec(location.pathname);if(id)show(id,true)});
if(/\/index\.html$/.test(location.pathname)){
var n=location.hash.slice(1);if(n==='how')n='process';if(!map[n])n='home';
history.replaceState(null,'','/'+n);show(map[n],false);
}else if(sec(location.pathname)){show(sec(location.pathname),false)}
})();

// Clean URLs: /home, /about, /services, /process, /technician, /contact
// Only used when the server rewrite rules exist (checked below); otherwise normal #links keep working.
(function(){
var names={home:'home',about:'about',services:'services',how:'process',technician:'technician',contact:'contact'};
var byPath={};Object.keys(names).forEach(function(id){byPath[names[id]]=id});
var clean=false;
function pathId(){var p=location.pathname.replace(/\/+$/,'').split('/').pop().toLowerCase().replace('.html','');return byPath[p]||null}
function go(id){var s=document.getElementById(id);if(s)s.scrollIntoView({block:'start'})}
function set(id,push){if(!clean)return;var u='/'+names[id];if(location.pathname===u)return;history[push?'pushState':'replaceState'](null,'',u)}

fetch('home',{method:'HEAD',cache:'no-store'}).then(function(r){
if(!r.ok)return;
clean=true;
var id=pathId();
if(id)go(id);else set('home',false);
setTimeout(spy,500);
}).catch(function(){});

if(pathId())go(pathId());

document.addEventListener('click',function(e){
var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a||!clean)return;
var id=a.getAttribute('href').slice(1);if(id==='top')id='home';
if(!names[id])return;
e.preventDefault();set(id,true);go(id);
});
window.addEventListener('popstate',function(){go(pathId()||'home')});

function spy(){
if(!('IntersectionObserver' in window))return;
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting)set(x.target.id,false)})},{rootMargin:'-40% 0px -55% 0px'});
Object.keys(names).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s)});
}
})();

// Hero visual: scene 1 (PC servicing) plays, then scene 2 (system check), then repeats
(function(){
var slides=document.querySelectorAll('.slide');
if(slides.length<2||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var i=0;
function show(n){slides.forEach(function(s,k){
if(k===n){s.classList.remove('run');void s.offsetWidth;s.classList.add('run','on')}
else s.classList.remove('on')})}
setTimeout(function(){show(0);setInterval(function(){i=(i+1)%slides.length;show(i)},9800)},2300);
})();
