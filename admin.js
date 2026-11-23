(function(){
var $=function(id){return document.getElementById(id)};
var API='https://api.github.com';
var state={list:[],sha:null,files:{}};
var cfg={};try{cfg=JSON.parse(localStorage.getItem('ez_admin_cfg')||'{}')}catch(e){}
$('repo').value=cfg.repo||'';
$('branch').value=cfg.branch||'main';
$('token').value=sessionStorage.getItem('ez_admin_token')||'';

function msg(t,type){var m=$('msg');m.textContent=t;m.className='msg '+(type||'')}
function headers(extra){var h={'Authorization':'Bearer '+$('token').value.trim(),'Accept':'application/vnd.github+json'};for(var k in extra)h[k]=extra[k];return h}
function url(p){return API+'/repos/'+$('repo').value.trim()+'/contents/'+p}
function toB64(s){var b=new TextEncoder().encode(s),r='';b.forEach(function(x){r+=String.fromCharCode(x)});return btoa(r)}
function fromB64(s){var r=atob(s.replace(/\s/g,'')),a=new Uint8Array(r.length);for(var i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return new TextDecoder().decode(a)}
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e}

function toJpeg(file){return new Promise(function(res,rej){
var img=new Image(),u=URL.createObjectURL(file);
img.onload=function(){var s=Math.min(img.width,img.height),c=document.createElement('canvas');c.width=c.height=600;
c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,600,600);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.85))};
img.onerror=function(){rej(new Error('That file is not a readable image.'))};img.src=u})}

function render(){
var box=$('list');box.textContent='';
if(!state.list.length)box.appendChild(el('p','hint','No technicians yet. Click "Add technician".'));
state.list.forEach(function(t,i){
var row=el('div','tech'),pic=el('div','pic'),img=el('img');
img.alt='';img.src=state.files[t.id]||t.photo||'';
var lab=el('label','file','Change photo'),fi=el('input');fi.type='file';fi.accept='image/*';
fi.addEventListener('change',function(){if(!fi.files[0])return;
toJpeg(fi.files[0]).then(function(d){state.files[t.id]=d;img.src=d;msg('Photo ready. Click Save changes to publish it.')}).catch(function(e){msg(e.message,'err')})});
lab.appendChild(fi);pic.appendChild(img);pic.appendChild(lab);
var f=el('div','fields');
var l1=el('label','','Name'),n=el('input');n.value=t.name||'';n.addEventListener('input',function(){t.name=n.value});l1.appendChild(n);
var l2=el('label','','Available time'),tm=el('input');tm.value=t.time||'';tm.placeholder='3:00 PM to 10:00 PM';tm.addEventListener('input',function(){t.time=tm.value});l2.appendChild(tm);
var rm=el('button','remove','Remove technician');rm.type='button';
rm.addEventListener('click',function(){if(confirm('Remove '+(t.name||'this technician')+'?')){state.list.splice(i,1);delete state.files[t.id];render()}});
f.appendChild(l1);f.appendChild(l2);f.appendChild(rm);
row.appendChild(pic);row.appendChild(f);box.appendChild(row);
});
}

function connect(){
if(!/^[^\/\s]+\/[^\/\s]+$/.test($('repo').value.trim())){msg('Enter the repository as username/repository-name.','err');return}
if(!$('token').value.trim()){msg('Paste your GitHub access token.','err');return}
$('connectBtn').disabled=true;msg('Connecting...');
var branch=$('branch').value.trim()||'main';
fetch(url('data/technicians.json')+'?ref='+encodeURIComponent(branch),{headers:headers(),cache:'no-store'}).then(function(r){
if(r.status===404){state.sha=null;state.list=[];return}
if(r.status===401||r.status===403)throw new Error('GitHub rejected the token. Check that it can read and write Contents for this repository.');
if(!r.ok)throw new Error('GitHub error '+r.status+'.');
return r.json().then(function(j){state.sha=j.sha;state.list=JSON.parse(fromB64(j.content))});
}).then(function(){
localStorage.setItem('ez_admin_cfg',JSON.stringify({repo:$('repo').value.trim(),branch:branch}));
sessionStorage.setItem('ez_admin_token',$('token').value.trim());
state.files={};$('editor').hidden=false;render();msg('Connected.','ok');checkWrite();
}).catch(function(e){msg(e.message||'Could not connect.','err')}).then(function(){$('connectBtn').disabled=false});
}

function checkWrite(){
fetch(API+'/repos/'+$('repo').value.trim(),{headers:headers(),cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(j){
if(j&&j.permissions&&j.permissions.push===false)msg('Connected, but this token can only read. Saving will fail until Contents is set to "Read and write".','err')}).catch(function(){});
}

function put(path,content,sha,message){
var body={message:message,content:content,branch:$('branch').value.trim()||'main'};if(sha)body.sha=sha;
return fetch(url(path),{method:'PUT',headers:headers({'Content-Type':'application/json'}),body:JSON.stringify(body)}).then(function(r){
return r.json().then(function(j){
if(!r.ok){
if(r.status===403||r.status===404)throw new Error('GitHub says this token is not allowed to save to the repository. On GitHub, open the token, choose the repository E-Z-TECH-CS, set Contents to "Read and write", click Update, then press Connect and Save again.');
throw new Error(r.status===409||r.status===422?'The file changed on GitHub. Click Connect to reload, then try again.':(j.message||'Save failed.'))}
return j})});
}

function save(){
$('save').disabled=true;msg('Saving...');
var chain=Promise.resolve();
state.list.forEach(function(t){
if(state.files[t.id]){chain=chain.then(function(){
var name='Files/'+t.id.replace(/[^a-z0-9-]/gi,'')+'-'+Date.now()+'.jpg';
return put(name,state.files[t.id].split(',')[1],null,'Upload technician photo').then(function(){t.photo=name;delete state.files[t.id]})})}
});
chain.then(function(){return put('data/technicians.json',toB64(JSON.stringify(state.list,null,2)+'\n'),state.sha,'Update technicians')})
.then(function(j){state.sha=j.content.sha;render();msg('Saved. The website will update in about a minute.','ok')})
.catch(function(e){msg(e.message||'Save failed.','err')})
.then(function(){$('save').disabled=false});
}

$('connectBtn').addEventListener('click',connect);
$('save').addEventListener('click',save);
$('add').addEventListener('click',function(){state.list.push({id:'t'+Date.now(),name:'',time:'3:00 PM to 10:00 PM',photo:''});render()});
$('forget').addEventListener('click',function(){sessionStorage.removeItem('ez_admin_token');$('token').value='';$('editor').hidden=true;msg('Token cleared.')});
})();
