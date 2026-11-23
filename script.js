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
var els=document.querySelectorAll('h2.title,.lead,.about p,.row,.steps li,.info,#f');
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.15});
els.forEach(function(el){
var i=Array.prototype.indexOf.call(el.parentNode.children,el);
el.style.transitionDelay=Math.min(i,5)*80+'ms';
el.classList.add('reveal');io.observe(el);
});
})();
