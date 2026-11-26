(function(){
var $=function(id){return document.getElementById(id)};
var API='https://api.github.com';
var state={list:[],sha:null,files:{},site:{facebook:'',instagram:'',tiktok:''},siteSha:null};
var cfg={};try{cfg=JSON.parse(localStorage.getItem('ez_admin_cfg')||'{}')}catch(e){}
$('repo').value=cfg.repo||'';
$('branch').value=cfg.branch||'main';
$('token').value=sessionStorage.getItem('ez_admin_token')||'';

function msg(t,type){var m=$('msg');m.textContent=t;m.className='msg '+(type||'')}
function headers(extra){var h={'Authorization':'Bearer '+$('token').value.trim(),'Accept':'application/vnd.github+json'};for(var k in extra)h[k]=extra[k];return h}
function url(p){return API+'/repos/'+$('repo').value.trim()+'/contents/'+p}
function branch(){return $('branch').value.trim()||'main'}
function toB64(s){var b=new TextEncoder().encode(s),r='';b.forEach(function(x){r+=String.fromCharCode(x)});return btoa(r)}
function fromB64(s){var r=atob(s.replace(/\s/g,'')),a=new Uint8Array(r.length);for(var i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return new TextDecoder().decode(a)}
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e}
function normUrl(s){s=String(s||'').trim();if(!s)return '';return /^https?:\/\//i.test(s)?s:'https://'+s}

function toJpeg(file){return new Promise(function(res,rej){
var img=new Image(),u=URL.createObjectURL(file);
img.onload=function(){var s=Math.min(img.width,img.height),c=document.createElement('canvas');c.width=c.height=600;
c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,600,600);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.85))};
img.onerror=function(){rej(new Error('That file is not a readable image.'))};img.src=u})}

function field(label,type,value,placeholder,onInput){
var l=el('label','',label),i=el('input');i.type=type;i.value=value||'';if(placeholder)i.placeholder=placeholder;i.autocomplete='off';
i.addEventListener('input',function(){onInput(i.value)});l.appendChild(i);return l}

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
f.appendChild(field('Name','text',t.name,'',function(v){t.name=v}));
f.appendChild(field('Phone number','tel',t.phone,'09xx xxx xxxx',function(v){t.phone=v}));
f.appendChild(field('Facebook account link','url',t.facebook,'https://facebook.com/username',function(v){t.facebook=v}));
var rm=el('button','remove','Remove technician');rm.type='button';
rm.addEventListener('click',function(){if(confirm('Remove '+(t.name||'this technician')+'?')){state.list.splice(i,1);delete state.files[t.id];render()}});
f.appendChild(rm);
row.appendChild(pic);row.appendChild(f);box.appendChild(row);
});
}

function getFile(path){
return fetch(url(path)+'?ref='+encodeURIComponent(branch()),{headers:headers(),cache:'no-store'}).then(function(r){
if(r.status===404)return null;
if(r.status===401||r.status===403)throw new Error('GitHub rejected the token. Check that it can read and write Contents for this repository.');
if(!r.ok)throw new Error('GitHub error '+r.status+'.');
return r.json().then(function(j){return {sha:j.sha,data:JSON.parse(fromB64(j.content))}});
});
}

function connect(){
if(!/^[^\/\s]+\/[^\/\s]+$/.test($('repo').value.trim())){msg('Enter the repository as username/repository-name.','err');return}
if(!$('token').value.trim()){msg('Paste your GitHub access token.','err');return}
$('connectBtn').disabled=true;msg('Connecting...');
Promise.all([getFile('data/technicians.json'),getFile('data/site.json')]).then(function(res){
state.sha=res[0]?res[0].sha:null;
state.list=res[0]&&Array.isArray(res[0].data)?res[0].data:[];
state.siteSha=res[1]?res[1].sha:null;
var s=(res[1]&&res[1].data)||{};
state.site={facebook:s.facebook||'',instagram:s.instagram||'',tiktok:s.tiktok||''};
localStorage.setItem('ez_admin_cfg',JSON.stringify({repo:$('repo').value.trim(),branch:branch()}));
sessionStorage.setItem('ez_admin_token',$('token').value.trim());
state.files={};
$('fb').value=state.site.facebook;$('ig').value=state.site.instagram;$('tt').value=state.site.tiktok;
$('editor').hidden=false;$('socialPanel').hidden=false;$('saveBar').hidden=false;
render();msg('Connected.','ok');checkWrite();
}).catch(function(e){msg(e.message||'Could not connect.','err')}).then(function(){$('connectBtn').disabled=false});
}

function checkWrite(){
fetch(API+'/repos/'+$('repo').value.trim(),{headers:headers(),cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(j){
if(j&&j.permissions&&j.permissions.push===false)msg('Connected, but this token can only read. Saving will fail until Contents is set to "Read and write".','err')}).catch(function(){});
}

function put(path,content,sha,message){
var body={message:message,content:content,branch:branch()};if(sha)body.sha=sha;
return fetch(url(path),{method:'PUT',headers:headers({'Content-Type':'application/json'}),body:JSON.stringify(body)}).then(function(r){
return r.json().then(function(j){
if(!r.ok){
if(r.status===403||r.status===404)throw new Error('GitHub says this token is not allowed to save to the repository. On GitHub, open the token, choose the repository E-Z-TECH-CS, set Contents to "Read and write", click Update, then press Connect and Save again.');
throw new Error(r.status===409||r.status===422?'The file changed on GitHub. Click Connect to reload, then try again.':(j.message||'Save failed.'))}
return j})});
}

function save(){
$('save').disabled=true;msg('Saving...');
state.list.forEach(function(t){t.name=String(t.name||'').trim();t.phone=String(t.phone||'').trim();t.facebook=normUrl(t.facebook);delete t.time});
state.site={facebook:normUrl($('fb').value),instagram:normUrl($('ig').value),tiktok:normUrl($('tt').value)};
var chain=Promise.resolve();
state.list.forEach(function(t){
if(state.files[t.id]){chain=chain.then(function(){
var name='Files/'+t.id.replace(/[^a-z0-9-]/gi,'')+'-'+Date.now()+'.jpg';
return put(name,state.files[t.id].split(',')[1],null,'Upload technician photo').then(function(){t.photo=name;delete state.files[t.id]})})}
});
chain.then(function(){return put('data/technicians.json',toB64(JSON.stringify(state.list,null,2)+'\n'),state.sha,'Update technicians')})
.then(function(j){state.sha=j.content.sha;return put('data/site.json',toB64(JSON.stringify(state.site,null,2)+'\n'),state.siteSha,'Update social media links')})
.then(function(j){state.siteSha=j.content.sha;$('fb').value=state.site.facebook;$('ig').value=state.site.instagram;$('tt').value=state.site.tiktok;render();msg('Saved. The website will update in about a minute.','ok')})
.catch(function(e){msg(e.message||'Save failed.','err')})
.then(function(){$('save').disabled=false});
}

$('connectBtn').addEventListener('click',connect);
$('save').addEventListener('click',save);
$('add').addEventListener('click',function(){state.list.push({id:'t'+Date.now(),name:'',phone:'',facebook:'',photo:''});render()});
$('forget').addEventListener('click',function(){sessionStorage.removeItem('ez_admin_token');$('token').value='';$('editor').hidden=true;$('socialPanel').hidden=true;$('saveBar').hidden=true;msg('Token cleared.')});
})();
