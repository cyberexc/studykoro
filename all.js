/* Study Hub - all.js : all the code + design lives here.
   NOTE: anything in this file is public (anyone can read it).
   Real security is NOT here, it is in the database rules (see setup.txt). */
(function(){
"use strict";

/* ---- fill these 2 after you create your Firebase project (they are public by design) ---- */
var CONFIG={DB_URL:"",API_KEY:""};
var CONNECTED=!!(CONFIG.DB_URL&&CONFIG.API_KEY);

var CSS=`
:root{--bg:#f7f3e8;--surface:#fffdf6;--ink:#2b2a33;--muted:#6d6a78;--line:#d9e2f2;--margin:#e98a8a;--accent:#3b5bdb;--hl:#fff3a3;--card:#fff9c4;--border:#e4dcc6;--danger:#c92a2a;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#16171d;--surface:#1f2029;--ink:#eceaf5;--muted:#9a98a8;--line:#2c3040;--margin:#a85555;--accent:#8aa4ff;--hl:#5a5326;--card:#3a3720;--border:#33343f;--danger:#ff8787}}
:root[data-theme="dark"]{--bg:#16171d;--surface:#1f2029;--ink:#eceaf5;--muted:#9a98a8;--line:#2c3040;--margin:#a85555;--accent:#8aa4ff;--hl:#5a5326;--card:#3a3720;--border:#33343f;--danger:#ff8787}
*{box-sizing:border-box}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
body{margin:0;background:var(--bg);color:var(--ink);font-family:"Nunito",system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.5}
h1,h2,h3,.hand{font-family:"Patrick Hand","Comic Sans MS","Segoe Print",cursive,sans-serif;font-weight:400}
.wrap{max-width:860px;margin:0 auto;padding:16px 16px 50px}
.top{margin-bottom:14px}
.logo{font-family:"Patrick Hand","Comic Sans MS",cursive,sans-serif;font-size:1.7rem}
.logo span{background:var(--hl);padding:0 6px;border-radius:3px}
.btn{border:2px solid var(--ink);border-radius:8px;padding:8px 14px;font:inherit;font-weight:700;cursor:pointer;background:var(--accent);color:#fff;box-shadow:2px 3px 0 var(--ink)}
.btn:active{transform:translate(2px,3px);box-shadow:none}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn.ghost{background:var(--surface);color:var(--ink)}
.board{background:repeating-linear-gradient(45deg,transparent 0 10px,rgba(0,0,0,.02) 10px 20px),var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px 0 10px 14px;box-shadow:0 4px 14px rgba(0,0,0,.07)}
.bh{display:flex;justify-content:space-between;align-items:center;padding-right:14px;margin-bottom:12px}
.bh b{font-family:"Patrick Hand","Comic Sans MS",cursive,sans-serif;font-size:1.3rem;font-weight:400}
.bh .btn{padding:5px 11px;font-size:.85rem}
.strip{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:10px 14px 12px 0}
.note{flex:0 0 220px;scroll-snap-align:start;background:var(--card);border:1px solid var(--border);border-radius:4px 4px 14px 4px;padding:16px 12px 12px;position:relative;min-height:120px;box-shadow:0 3px 8px rgba(0,0,0,.1)}
.note:nth-child(odd){transform:rotate(-1.2deg)}.note:nth-child(even){transform:rotate(1deg)}
.note:before{content:"";position:absolute;top:-7px;left:50%;width:42px;height:13px;margin-left:-21px;background:color-mix(in srgb,var(--accent) 35%,transparent);border-radius:3px;transform:rotate(-2deg)}
.who{display:flex;align-items:center;gap:8px;margin-bottom:4px}
.pic{width:32px;height:32px;border-radius:50%;background:var(--surface);display:grid;place-items:center;font-size:1.15rem;flex:none;border:1px solid var(--border)}
.who b{font-size:.9rem;line-height:1.1;display:block}
.who small{color:var(--muted);font-size:.72rem}
.text{font-size:.9rem;white-space:pre-wrap;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.del{position:absolute;top:8px;right:6px;border:1px solid var(--danger);color:var(--danger);background:transparent;border-radius:7px;font-size:.68rem;padding:1px 6px;cursor:pointer}
.empty{color:var(--muted);font-size:.95rem;padding:14px 0}
.hero{margin-top:18px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:22px 22px 22px 46px;position:relative;background-image:repeating-linear-gradient(transparent,transparent 27px,var(--line) 28px);box-shadow:0 6px 18px rgba(0,0,0,.08)}
.hero:before{content:"";position:absolute;left:32px;top:0;bottom:0;width:2px;background:var(--margin)}
.hero h1{margin:0;font-size:2.2rem;line-height:1.3}
.hero h1 mark{background:var(--hl);color:inherit;padding:0 6px;border-radius:3px}
.hero p{margin:6px 0 0;color:var(--muted)}
h2.sec{margin:30px 0 14px;font-size:1.6rem;line-height:1.25}
.subjects{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.sub{display:block;text-decoration:none;color:var(--ink);background:var(--surface);border:1px solid var(--border);border-left:8px solid var(--c);border-radius:4px 12px 12px 4px;padding:14px 12px;box-shadow:0 3px 8px rgba(0,0,0,.08);transition:transform .15s}
.sub:hover{transform:translateY(-3px) rotate(-.6deg)}
.sub .ic{font-size:1.9rem;display:block;line-height:1.2}
.sub b{font-family:"Patrick Hand","Comic Sans MS",cursive,sans-serif;font-size:1.35rem;font-weight:400;display:block}
.badge{display:inline-block;margin-top:4px;font-size:.75rem;color:var(--muted);border:1px dashed var(--muted);border-radius:6px;padding:0 7px}
@media (min-width:640px){.subjects{grid-template-columns:repeat(3,1fr)}.hero h1{font-size:2.8rem}}
.back{display:inline-block;margin:16px 0 8px;color:var(--accent);text-decoration:none;font-weight:700}
.sp{background:var(--surface);border:1px solid var(--border);border-left:8px solid var(--c);border-radius:4px 14px 14px 4px;padding:30px 22px 30px 46px;position:relative;background-image:repeating-linear-gradient(transparent,transparent 27px,var(--line) 28px);box-shadow:0 6px 18px rgba(0,0,0,.08)}
.sp:before{content:"";position:absolute;left:30px;top:0;bottom:0;width:2px;background:var(--margin)}
.sp .ic{font-size:2.8rem;line-height:1.2}
.sp h1{margin:0;font-size:2.4rem;line-height:1.3}
.sp .wip{display:inline-block;margin-top:6px;font-family:"Patrick Hand","Comic Sans MS",cursive,sans-serif;font-size:1.4rem;background:var(--hl);padding:0 8px;border-radius:3px}
.sp p{color:var(--muted);margin:10px 0 0}
.hide{display:none!important}
.ov{position:fixed;inset:0;background:rgba(20,18,10,.5);display:flex;align-items:flex-end;justify-content:center;z-index:50}
.modal{background:var(--surface);width:100%;max-width:480px;border-radius:14px 14px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0px));max-height:92%;overflow:auto;border-top:6px solid var(--card)}
@media (min-width:640px){.ov{align-items:center;padding:16px}.modal{border-radius:14px}}
.modal h3{margin:0 0 4px;font-size:1.6rem}
label{display:block;font-size:.85rem;color:var(--muted);margin:12px 0 5px}
.avatars{display:flex;flex-wrap:wrap;gap:8px}
.av{width:44px;height:44px;border-radius:50%;border:2px solid transparent;font-size:1.4rem;cursor:pointer;display:grid;place-items:center;background:var(--bg);padding:0}
.av.sel{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 25%,transparent)}
input[type=text],textarea{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--bg);color:var(--ink);font:inherit}
textarea{min-height:90px;resize:vertical}
.row{display:flex;justify-content:space-between;font-size:.75rem;color:var(--muted);margin-top:4px}
.acts{display:flex;gap:10px;margin-top:14px}
.acts .btn{flex:1}
.msg{margin-top:8px;font-size:.85rem;color:var(--muted)}

.foot{margin-top:40px;text-align:center;font-size:.8rem;color:var(--muted)}
.foot button{background:none;border:0;color:var(--muted);text-decoration:underline;font:inherit;cursor:pointer}
.adm{font-size:.75rem;color:var(--accent);margin-left:8px}
input[type=password],input[type=email]{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--bg);color:var(--ink);font:inherit}
`;
var st=document.createElement("style");st.textContent=CSS;document.head.appendChild(st);

var EMOJIS=["🦊","🐼","🐱","🐸","🦉","🐧","🦄","🐙","🌟","🚀","🎧","🧠"];
var SUBJECTS=[
 {k:"bangla",n:"Bangla",e:"📖",c:"#e8590c"},
 {k:"math",n:"General Math",e:"➗",c:"#1c7ed6"},
 {k:"physics",n:"Physics",e:"⚛️",c:"#7048e8"},
 {k:"biology",n:"Biology",e:"🧬",c:"#2f9e44"},
 {k:"chemistry",n:"Chemistry",e:"🧪",c:"#d6336c"},
 {k:"hmath",n:"Higher Math",e:"∑",c:"#0c8599"}];

document.getElementById("app").innerHTML=
'<div class="wrap">'+
 '<div class="top"><div class="logo"><span>Study Hub</span> 📚</div></div>'+
 '<section class="board"><div class="bh"><b>📌 Notes from students</b><button class="btn" id="open">✏️ Write a note</button></div>'+
 '<div class="strip" id="strip"><div class="empty">Loading notes…</div></div></section>'+
 '<div id="home"><section class="hero"><h1>Learn. <mark>Discuss.</mark> Grow.</h1>'+
 '<p>Pick a subject, study together and leave notes to help other students.</p></section>'+
 '<h2 class="sec">🎯 Choose the subject you wanna learn &amp; discuss</h2><div class="subjects" id="subjects"></div></div>'+
 '<div id="subpage" class="hide"><a class="back" href="#">← All subjects</a><div class="sp" id="sp">'+
 '<div class="ic" id="spic"></div><h1 id="spname"></h1><div class="wip">🚧 Working on it!</div>'+
 '<p>Lessons, practice and discussion for this subject are coming soon.</p></div></div>'+
 '<div class="foot"><button id="admbtn">Admin</button><span class="adm hide" id="admon">Admin mode on</span></div>'+
'</div>'+
'<div class="ov hide" id="ov"><div class="modal"><h3>✏️ Write a note for others</h3>'+
 '<label>Choose your profile picture</label><div class="avatars" id="avatars"></div>'+
 '<label for="name">Your name</label><input type="text" id="name" maxlength="24" placeholder="e.g. Alex">'+
 '<label for="note">The note you wanna share</label><textarea id="note" maxlength="300" placeholder="Start typing your note…"></textarea>'+
 '<div class="row"><span></span><span id="count">0/300</span></div><div class="msg" id="msg"></div>'+
 '<div class="acts"><button class="btn ghost" id="cancel" type="button">Cancel</button><button class="btn" id="post" disabled>Share note</button></div></div></div>'+
'<div class="ov hide" id="aov"><div class="modal"><h3>Admin login</h3>'+
 '<label for="aem">Email</label><input type="email" id="aem" autocomplete="username">'+
 '<label for="apw">Password</label><input type="password" id="apw" autocomplete="current-password">'+
 '<div class="msg" id="amsg"></div>'+
 '<div class="acts"><button class="btn ghost" id="acancel" type="button">Cancel</button><button class="btn" id="alogin">Log in</button></div></div></div>';

var $=function(i){return document.getElementById(i)};
var picked=EMOJIS[0], docs=[], token=null, tokenExp=0;
var strip=$("strip"), nameEl=$("name"), noteEl=$("note"), postBtn=$("post"), msg=$("msg"), ov=$("ov");

/* ---------- subjects + routing ---------- */
SUBJECTS.forEach(function(x){
  var a=document.createElement("a");a.className="sub";a.href="#"+x.k;a.style.setProperty("--c",x.c);
  var i=document.createElement("span");i.className="ic";i.textContent=x.e;
  var b=document.createElement("b");b.textContent=x.n;
  var g=document.createElement("span");g.className="badge";g.textContent="Working on it!";
  a.appendChild(i);a.appendChild(b);a.appendChild(g);$("subjects").appendChild(a);
});
function route(){
  var h=(location.hash||"").replace("#","");
  var s=SUBJECTS.filter(function(x){return x.k===h})[0];
  $("home").classList.toggle("hide",!!s);
  $("subpage").classList.toggle("hide",!s);
  if(s){$("sp").style.setProperty("--c",s.c);$("spic").textContent=s.e;$("spname").textContent=s.n;document.title=s.n+" - Study Hub";}
  else document.title="Study Hub";
  window.scrollTo(0,0);
}
window.addEventListener("hashchange",route);route();

/* ---------- note composer ---------- */
EMOJIS.forEach(function(e){
  var b=document.createElement("button");b.type="button";b.className="av"+(e===picked?" sel":"");b.textContent=e;
  b.setAttribute("aria-label","Avatar "+e);
  b.onclick=function(){picked=e;[].forEach.call($("avatars").children,function(c){c.classList.toggle("sel",c===b)});};
  $("avatars").appendChild(b);
});
try{var sv=JSON.parse(localStorage.getItem("study-profile")||"null");
 if(sv){nameEl.value=sv.name||"";if(sv.av){picked=sv.av;[].forEach.call($("avatars").children,function(c){c.classList.toggle("sel",c.textContent===picked)});}}}catch(e){}
function validate(){
  $("count").textContent=noteEl.value.length+"/300";
  postBtn.disabled=!(CONNECTED&&nameEl.value.trim()&&noteEl.value.trim());
}
nameEl.oninput=noteEl.oninput=validate;
$("open").onclick=function(){msg.textContent=CONNECTED?"":"Notes are not connected yet.";ov.classList.remove("hide");validate();};
$("cancel").onclick=function(){ov.classList.add("hide");};
ov.onclick=function(e){if(e.target===ov)ov.classList.add("hide");};

/* ---------- notes list ---------- */
function ago(t){
  var s=Math.max(1,Math.floor((Date.now()-t)/1000));
  if(s<60)return "just now";var m=Math.floor(s/60);if(m<60)return m+" min ago";
  var h=Math.floor(m/60);if(h<24)return h+" h ago";return Math.floor(h/24)+" d ago";
}
function info(t){strip.textContent="";var d=document.createElement("div");d.className="empty";d.textContent=t;strip.appendChild(d);}
function isAdmin(){return !!token&&Date.now()<tokenExp;}
function render(){
  if(!docs.length){info("No notes yet. Be the first to share one! ✨");return;}
  strip.textContent="";
  docs.forEach(function(n){
    var c=document.createElement("div");c.className="note";
    var w=document.createElement("div");w.className="who";
    var p=document.createElement("div");p.className="pic";p.textContent=String(n.av||"🙂").slice(0,8);
    var wb=document.createElement("div");
    var nm=document.createElement("b");nm.textContent=String(n.name||"Anonymous").slice(0,24);
    var tm=document.createElement("small");tm.textContent=ago(Number(n.ts)||Date.now());
    wb.appendChild(nm);wb.appendChild(tm);w.appendChild(p);w.appendChild(wb);
    var tx=document.createElement("div");tx.className="text";tx.textContent=String(n.text||"").slice(0,300);
    c.appendChild(w);c.appendChild(tx);
    if(isAdmin()){
      var d=document.createElement("button");d.className="del";d.textContent="Remove";
      d.onclick=function(){
        if(!confirm("Remove this note?"))return;
        fetch(CONFIG.DB_URL+"/notes/"+encodeURIComponent(n.id)+".json?auth="+encodeURIComponent(token),{method:"DELETE"})
          .then(function(r){if(!r.ok)throw 0;load();}).catch(function(){alert("Could not remove (admin login may have expired).");});
      };
      c.appendChild(d);
    }
    strip.appendChild(c);
  });
}
function load(){
  if(!CONNECTED){info("Notes are not connected yet. The owner needs to finish setup.");return;}
  fetch(CONFIG.DB_URL+'/notes.json?orderBy="ts"&limitToLast=30')
    .then(function(r){if(!r.ok)throw 0;return r.json();})
    .then(function(o){
      docs=Object.keys(o||{}).map(function(k){var v=o[k]||{};v.id=k;return v;})
        .sort(function(a,b){return (b.ts||0)-(a.ts||0);});
      render();
    }).catch(function(){if(!docs.length)info("Couldn't load notes right now.");});
}

postBtn.onclick=function(){
  var last=0;try{last=Number(localStorage.getItem("study-last"))||0;}catch(e){}
  if(Date.now()-last<30000){msg.textContent="Please wait a little before posting again.";return;}
  postBtn.disabled=true;msg.textContent="Sharing…";
  var data={name:nameEl.value.trim().slice(0,24),av:picked,text:noteEl.value.trim().slice(0,300),ts:Date.now()};
  fetch(CONFIG.DB_URL+"/notes.json"+(isAdmin()?"?auth="+encodeURIComponent(token):""),{method:"POST",body:JSON.stringify(data)})
   .then(function(r){if(!r.ok)throw 0;
     noteEl.value="";msg.textContent="";ov.classList.add("hide");validate();
     try{localStorage.setItem("study-profile",JSON.stringify({name:data.name,av:data.av}));localStorage.setItem("study-last",String(Date.now()));}catch(e){}
     load();})
   .catch(function(){msg.textContent="Couldn't post. Try again.";validate();});
};

/* ---------- admin login (checked by the server, not by this file) ---------- */
var aov=$("aov");
$("admbtn").onclick=function(){if(!CONNECTED)return;aov.classList.remove("hide");};
$("acancel").onclick=function(){aov.classList.add("hide");};
aov.onclick=function(e){if(e.target===aov)aov.classList.add("hide");};
$("alogin").onclick=function(){
  $("amsg").textContent="Checking…";
  fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="+encodeURIComponent(CONFIG.API_KEY),
    {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:$("aem").value.trim(),password:$("apw").value,returnSecureToken:true})})
   .then(function(r){return r.json();})
   .then(function(j){
     if(!j.idToken)throw 0;
     token=j.idToken;tokenExp=Date.now()+(Number(j.expiresIn)||3600)*1000-60000;
     $("apw").value="";$("amsg").textContent="";aov.classList.add("hide");
     $("admon").classList.remove("hide");render();
   }).catch(function(){$("amsg").textContent="Wrong email or password.";});
};

load();
setInterval(load,15000);
})();
