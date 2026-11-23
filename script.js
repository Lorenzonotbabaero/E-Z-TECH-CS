document.getElementById('y').textContent=new Date().getFullYear();
var f=document.getElementById('f'),st=document.getElementById('status'),btn=document.getElementById('send');
f.addEventListener('submit',function(e){
e.preventDefault();
btn.disabled=true;st.style.color='';st.textContent='Sending...';
var d=new FormData(f);
var data={_subject:'New service request: '+d.get('service'),_template:'table',_captcha:'false',_honey:d.get('_honey')||''};
['name','contact','service','msg'].forEach(function(k){data[k]=d.get(k)});
fetch('https://formsubmit.co/ajax/eztechcsbinanbranch@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
.then(function(r){return r.json()})
.then(function(j){
if(j.success==='true'||j.success===true){f.reset();st.style.color='#0F6B3A';st.textContent='Thank you! We received your request and will contact you soon.'}
else{throw new Error('fail')}
})
.catch(function(){st.style.color='#B00020';st.textContent='Sorry, it did not send. Please call 0948 963 5044 or email eztechcsbinanbranch@gmail.com.'})
.then(function(){btn.disabled=false});
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

// Technician cards, loaded from data/technicians.json (edited in admin.html)
(function(){
var box=document.getElementById('techs');if(!box)return;
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e}
fetch('data/technicians.json?v='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(list){
if(!Array.isArray(list))return;
box.textContent='';
if(!list.length){box.appendChild(el('p','lead','No technician is listed right now. Please call us.'));return}
list.forEach(function(t){
var c=el('article','tech-card'),img=el('img','avatar');
img.src=t.photo||'';img.alt='Photo of technician '+(t.name||'');img.width=140;img.height=140;img.loading='lazy';
c.appendChild(img);
c.appendChild(el('h3','',t.name||''));
c.appendChild(el('p','role','Technician'));
var a=el('p','avail'),d=el('span','dot');d.setAttribute('aria-hidden','true');
a.appendChild(d);a.appendChild(document.createTextNode('Available '+(t.time||'')));
c.appendChild(a);box.appendChild(c);
});
}).catch(function(){});
})();
