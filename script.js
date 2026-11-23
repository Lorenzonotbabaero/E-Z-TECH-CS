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
if(j.success==='true'||j.success===true){f.reset();st.style.color='#0B5FA5';st.textContent='Thank you! We received your request and will contact you soon.'}
else{throw new Error('fail')}
})
.catch(function(){st.style.color='#B00020';st.textContent='Sorry, it did not send. Please call 0948 963 5044 or email eztechcsbinanbranch@gmail.com.'})
.then(function(){btn.disabled=false});
});
