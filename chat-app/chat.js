// Chat app v3: accounts, groups + admin tools, edit/delete/reply, avatars, calls, dark mode, PWA, world communities.
// Run: npm install socket.io && node chat.js

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Chat</title>
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#000000">
<style>
:root{--ink:#f2f2f2;--mute:#a0a0a0;--line:#2e2e2e;--accent:#e11d2e;--sent:#8a1520;--bg:#0a0a0a;--read:#ff8a8a;--card:#151515;--hover:#222;color-scheme:dark}
:root[data-theme=light]{--ink:#17231f;--mute:#667781;--line:#dfe5e3;--accent:#0f7b6c;--sent:#d3efd0;--bg:#e6ede8;--read:#2a7de1;--card:#fff;--hover:#f1f6f4;color-scheme:light}
*{box-sizing:border-box;margin:0}
html,body{height:100%}
body{font:15px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--ink);background:var(--bg)}
button,input{font:inherit}
[hidden]{display:none!important}
.card{height:100%;display:grid;place-items:center;padding:20px}
.card form,.box{background:var(--card);padding:26px;border-radius:14px;width:100%;max-width:340px;display:grid;gap:12px}
h1{font-size:21px}
.mute{color:var(--mute)}
input[type=text],input[type=password]{background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:10px;padding:11px 14px;outline:none;width:100%}
input:focus{border-color:var(--accent)}
.btn{background:var(--accent);color:#fff;border:0;border-radius:10px;padding:11px 16px;cursor:pointer}
.btn.alt{background:var(--card);color:var(--accent);border:1px solid var(--accent)}
.lnk{background:none;border:0;color:var(--accent);cursor:pointer;padding:4px 6px}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#err{color:#b3261e;min-height:1.2em;font-size:13px}
#app{height:100%;display:grid;grid-template-columns:320px 1fr;max-width:1200px;margin:0 auto;background:var(--card)}
aside{border-right:1px solid var(--line);display:flex;flex-direction:column;min-height:0}
aside header,.chat header{padding:10px 16px;border-bottom:1px solid var(--line);font-weight:600;display:flex;align-items:center;gap:8px;min-height:56px}
aside header span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#list{overflow:auto;flex:1}
.item{display:flex;align-items:center;gap:12px;padding:12px 16px;cursor:pointer;border-bottom:1px solid var(--line)}
.item:hover,.item.on{background:var(--hover)}
.av{width:40px;height:40px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-weight:600;flex:none;position:relative}
.av.g{background:#7f1d1d}
.av.online::after{content:"";position:absolute;right:0;bottom:0;width:11px;height:11px;border-radius:50%;background:#2ecc71;border:2px solid var(--card)}
.meta{flex:1;min-width:0}
.sub{color:var(--mute);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{background:var(--accent);color:#fff;border-radius:999px;font-size:12px;padding:1px 8px}
.chat{display:flex;flex-direction:column;min-height:0;background:var(--bg)}
.chat header{background:var(--card)}
.chat header small{display:block;font-weight:400;color:var(--mute);font-size:12px}
#back{display:none;background:none;border:0;font-size:22px;cursor:pointer;color:var(--ink)}
#msgs{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:6px}
.m{max-width:min(75%,460px);padding:7px 10px 5px;border-radius:10px;background:var(--card);align-self:flex-start;overflow-wrap:anywhere}
.m.me{background:var(--sent);align-self:flex-end}
.who{font-size:12px;font-weight:600;color:var(--accent)}
.pic{max-width:100%;max-height:260px;border-radius:8px;display:block;margin:2px 0 4px}
.m a{color:var(--accent)}
.m .t{display:block;text-align:right;font-size:11px;color:var(--mute);margin-top:2px}
.tick.read{color:var(--read)}
.empty{margin:auto;color:var(--mute);text-align:center;padding:20px}
#composer{display:flex;gap:8px;padding:10px;background:var(--card);border-top:1px solid var(--line);align-items:center}
#modal,#gmodal,#cmodal,#smodal,#fmodal,#lmodal{position:fixed;inset:0;background:#0007;display:grid;place-items:center;padding:20px}
#gm,#gmem,#slist,#flist{max-height:200px;overflow:auto;display:grid;gap:6px}
.av{background-size:cover;background-position:center}
body{background:radial-gradient(circle at 50% 0,#4a0a10,#000 75%) fixed}
#msgs{background:linear-gradient(170deg,#0a0a0a 50%,#2d0409)}
:root[data-theme=light] body,:root[data-theme=light] #msgs{background:var(--bg)}
.m{border:1px solid #ffffff14}
.m.me a,.m.me .lnk{color:#fff}
audio{max-width:100%;height:36px;display:block;margin:2px 0}
.badge.off{background:#555}
.chat header>div:not(.av){min-width:0}
.chat header small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#mic.rec{color:var(--accent);font-weight:600}
.hbtns .lnk{padding:4px 3px}
.vp{display:flex;align-items:center;gap:4px;min-width:200px}
.vp .lnk,.vp .mute{white-space:nowrap;flex:none;padding:2px 3px}
.wave{display:flex;align-items:center;gap:1px;height:28px;flex:1;min-width:60px;cursor:pointer}
.wave span{flex:1 1 0;max-width:3px;min-width:1px;background:var(--mute);border-radius:2px;min-height:3px}
.wave span.on{background:var(--accent)}
.m.me .wave span.on{background:#fff}
.poll{min-width:220px}
.pq{font-weight:600;margin-bottom:6px}
.opt{position:relative;display:block;width:100%;text-align:left;background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:7px 10px;margin-top:4px;overflow:hidden;cursor:pointer}
.opt:disabled{opacity:.75;cursor:default}
.opt .fill{position:absolute;left:0;top:0;bottom:0;background:var(--accent);opacity:.3}
.opt .lbl{position:relative}
.opt.mine{border-color:var(--accent)}
.voters{font-size:11px;color:var(--mute);margin-top:2px}
.once .btn{width:100%}
select{background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:10px;padding:10px;width:100%}
.sitem.muted{opacity:.5}
#sreplybox{display:flex;gap:8px;max-width:420px;margin:0 auto}
#sreplybox input{flex:1}
#statusRow{display:flex;gap:12px;overflow-x:auto;padding:10px 14px;border-bottom:1px solid var(--line);flex:none}
.sitem{display:flex;flex-direction:column;align-items:center;gap:4px;min-width:62px;cursor:pointer;font-size:12px}
.sitem .ring{padding:2px;border:3px solid var(--accent);border-radius:50%}
.sitem .ring.seen{border-color:#666}
.sitem .ring.add{border-style:dashed;border-color:var(--mute)}
.sitem .n{max-width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--mute)}
#spreview{border-radius:12px;min-height:220px;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:12px}
#spreview textarea{width:100%;height:190px;background:transparent;border:0;color:#fff;font:600 22px/1.3 system-ui,sans-serif;text-align:center;resize:none;outline:none}
#spreview textarea::placeholder{color:#fffa}
#spreview img{max-width:100%;max-height:240px;border-radius:8px;display:block;margin:0 auto 8px}
#scolors{display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
#scolors button{width:28px;height:28px;border-radius:50%;border:2px solid #fff3;cursor:pointer}
#scolors button.on{border-color:#fff}
#sviewer{position:fixed;inset:0;background:#000;z-index:70;display:flex;flex-direction:column;color:#fff}
#sbars{display:flex;gap:4px;padding:10px 10px 4px}
#sbars span{flex:1;height:3px;background:#fff4;border-radius:2px;overflow:hidden}
#sbars i{display:block;height:100%;width:0;background:#fff}
#shead{display:flex;align-items:center;gap:10px;padding:6px 12px}
#shead .lnk{color:#fff;font-size:18px}
#sinfo{flex:1;font-size:13px}
#sbody{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;text-align:center;overflow:hidden}
#sbody .t{font:600 26px/1.3 system-ui,sans-serif;overflow-wrap:anywhere}
#sbody img{max-width:100%;max-height:68vh}
#sbody .cap{margin-top:10px;font-size:15px}
#sfoot{padding:10px 16px;text-align:center;font-size:13px;min-height:44px}
#stapL,#stapR{position:absolute;top:100px;bottom:70px;width:35%}
#stapL{left:0}
#stapR{right:0}
#emojis{background:var(--card);border-top:1px solid var(--line);max-height:220px;display:flex;flex-direction:column}
#etabs{display:flex;gap:2px;padding:4px 8px;border-bottom:1px solid var(--line)}
#etabs .lnk{font-size:20px;opacity:.55}
#etabs .lnk.on{opacity:1;border-bottom:2px solid var(--accent)}
#egrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(40px,1fr));overflow:auto;padding:4px 8px}
#egrid button{background:none;border:0;font-size:24px;padding:4px;cursor:pointer}
.reacts{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}
.chip{background:var(--card);color:var(--ink);border:1px solid var(--line);border-radius:999px;padding:1px 8px;font-size:13px;cursor:pointer}
.chip.mine{border-color:var(--accent)}
.qr{display:flex;gap:2px;margin-top:4px;flex-wrap:wrap}
.qr button{font-size:22px;background:none;border:0;cursor:pointer;padding:2px 4px;color:var(--ink)}
#composer .lnk{padding:4px 2px}
#viewer{position:fixed;inset:0;background:#000;z-index:60;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px;color:#aaa;font-size:12px}
#vbody img{max-width:100%;max-height:78vh;-webkit-touch-callout:none;user-select:none}
#vbody audio{width:min(90vw,380px)}
#onceBtn.rec{color:var(--accent);font-weight:600}
.hbtns{margin-left:auto;display:flex}
.quote{font-size:12px;color:var(--mute);border-left:3px solid var(--accent);padding:2px 6px;margin-bottom:4px;background:#8080801f;border-radius:4px}
.acts{display:flex;flex-wrap:wrap;gap:2px 8px;margin-top:4px}
.acts .lnk{white-space:nowrap;padding:4px 2px}
.sys{align-self:center;font-size:12px;color:var(--mute);background:var(--card);padding:2px 10px;border-radius:999px;text-align:center}
#bar{display:flex;align-items:center;padding:6px 12px;background:var(--card);border-top:1px solid var(--line);font-size:13px;color:var(--mute)}
#bar span{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
#call{position:fixed;inset:0;background:#111;color:#fff;display:flex;flex-direction:column;align-items:center;z-index:50}
#rv{width:100%;flex:1;object-fit:contain;min-height:0;background:#000}
#lv{position:absolute;right:12px;top:12px;width:100px;border-radius:8px;background:#222}
#callInfo{padding:12px}
.ctrls{display:flex;gap:10px;padding:0 14px 18px}
@media(max-width:700px){
  #app{grid-template-columns:1fr}
  .chat{display:none}
  body.chatting aside{display:none}
  body.chatting .chat{display:flex}
  #back{display:block}
}
.ccard{display:flex;gap:12px;align-items:center;padding:12px 14px;margin:8px 12px;border:1px solid var(--line);border-radius:12px;background:var(--card);cursor:pointer}
.ccard .cico{font-size:26px;width:44px;text-align:center;flex:none}
.ccard .meta{flex:1;min-width:0}
.ccard .ctt{font-weight:600}
.ccard .btn{width:auto;padding:6px 12px;flex:none}
.csec{margin:18px 14px 2px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.cgrp{margin:12px 14px 2px;font-weight:600}
.crow{display:flex;gap:10px;align-items:center;justify-content:space-between;margin:4px 14px;padding:8px 12px;border:1px solid var(--line);border-radius:10px;background:var(--card)}
.crow .btn{width:auto;padding:5px 12px}
.cnote{margin:2px 14px 6px;font-size:12px}
.autotag{display:inline-block;color:#9a9a9a;background:rgba(150,150,150,.2);border-radius:4px;padding:0 5px;margin-right:2px;font-size:11px;font-weight:600;letter-spacing:.03em}
.cq{margin:6px 14px;width:calc(100% - 28px)}
.cgo,.cbtn{margin:6px 14px;width:calc(100% - 28px)}
.cbtns{display:flex;gap:8px;align-items:center}
.crow span:first-child{min-width:0;overflow-wrap:anywhere}
#msgs>.btn{margin:10px 14px;width:auto;align-self:flex-start}
#lerr{color:#e74c3c;min-height:1em;font-size:13px}
</style>
</head>
<body>
<div id="login" class="card">
  <form id="authForm">
    <h1>Welcome</h1>
    <p class="mute">Log in, or create an account.</p>
    <input type="text" id="name" placeholder="Username" maxlength="20" autocomplete="username" autocapitalize="none">
    <input type="password" id="pass" placeholder="Password (6+ characters)" autocomplete="current-password">
    <input type="text" id="rcode" placeholder="Recovery code (XXXX-XXXX-XXXX)" autocapitalize="characters" autocomplete="off" hidden>
    <div id="err"></div>
    <div class="row2" id="rowLogin"><button class="btn">Log in</button><button type="button" class="btn alt" id="signup">Sign up</button></div>
    <button type="button" class="lnk" id="forgot">Forgot password?</button>
    <button type="button" class="btn" id="doReset" hidden>Reset password</button>
    <button type="button" class="lnk" id="backLogin" hidden>Back to log in</button>
  </form>
</div>

<div id="app" hidden>
  <aside>
    <header><div class="av" id="meAv" title="Change photo" style="width:34px;height:34px;cursor:pointer"></div><span id="meName"></span><button class="lnk" id="install" hidden>Install</button><button class="lnk" id="theme" aria-label="Theme">🌓</button><button class="lnk" id="newGroup">+ Group</button><button class="lnk" id="logout">Log out</button><input type="file" id="avFile" accept="image/*" hidden></header>
    <div id="statusRow"></div>
    <div id="list"></div>
    <div style="padding:8px 12px;border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:2px 8px"><button class="lnk" id="delSetBtn"></button><button class="lnk" id="recBtn">🔑 Recovery code</button><button class="lnk" id="lockPwBtn">🔒 Chat lock password</button></div>
  </aside>
  <section class="chat">
    <header>
      <button id="back" aria-label="Back">‹</button>
      <div class="av" id="peerAv" hidden></div>
      <div><span id="peerName">Select a chat</span><small id="peerStatus"></small></div>
      <span class="hbtns" hidden><button class="lnk" id="acall" aria-label="Voice call">📞</button><button class="lnk" id="vcall" aria-label="Video call">🎥</button><button class="lnk" id="gset" aria-label="Group settings">⚙️</button><button class="lnk" id="menuBtn" aria-label="Chat options">⋮</button></span>
    </header>
    <div id="msgs"></div>
    <div id="bar" hidden><span id="barText"></span><button type="button" class="lnk" id="barX">✕</button></div>
    <div id="emojis" hidden><div id="etabs"></div><div id="egrid"></div></div>
    <form id="composer" hidden>
      <button type="button" class="lnk" id="emojiBtn" aria-label="Emoji">😊</button>
      <button type="button" class="lnk" id="attach" aria-label="Attach">📎</button>
      <button type="button" class="lnk" id="mic" aria-label="Voice note">🎤</button>
      <button type="button" class="lnk" id="onceBtn" aria-label="View once" title="View once: the next photo or voice note disappears after it is opened">👁</button>
      <button type="button" class="lnk" id="pollBtn" aria-label="Poll" hidden>📊</button>
      <input type="file" id="file" hidden>
      <input type="text" id="text" placeholder="Type a message" autocomplete="off">
      <button class="btn">Send</button>
    </form>
    <div id="locked" class="empty" hidden>Only admins can send messages in this group.</div>
  </section>
</div>

<div id="modal" hidden>
  <div class="box">
    <h1>New group</h1>
    <input type="text" id="gname" placeholder="Group name" maxlength="30">
    <label><input type="checkbox" id="ghist" checked> New members can see earlier messages</label>
    <label><input type="checkbox" id="gann"> Only admins can send messages</label>
    <div id="gm"></div>
    <div class="row2"><button class="btn alt" id="gcancel">Cancel</button><button class="btn" id="gcreate">Create</button></div>
  </div>
</div>

<div id="gmodal" hidden>
  <div class="box">
    <h1>Group settings</h1>
    <input type="text" id="gname2" maxlength="30">
    <label><input type="checkbox" id="ghist2"> New members can see earlier messages</label>
    <label><input type="checkbox" id="gann2"> Only admins can send messages</label>
    <button type="button" class="btn alt" id="gav">Change group picture</button><input type="file" id="gavFile" accept="image/*" hidden>
    <div id="gmem"></div>
    <div class="row2"><button class="btn alt" id="gleave">Leave group</button><button class="btn" id="gsave">Save</button></div>
    <button class="lnk" id="gclose">Close</button>
  </div>
</div>
<div id="fmodal" hidden>
  <div class="box">
    <h1>Forward to…</h1>
    <div id="fpreview" class="mute"></div>
    <div id="flist"></div>
    <div class="row2"><button type="button" class="btn alt" id="fcancel">Cancel</button><button type="button" class="btn" id="fsend">Forward</button></div>
    <div class="mute" style="font-size:12px">Pick up to 5 chats. Photos and voice notes are copied too. Polls and view-once media can't be forwarded.</div>
  </div>
</div>
<div id="smodal" hidden>
  <div class="box">
    <h1>New status</h1>
    <div id="spreview"></div>
    <div id="scolors"></div>
    <div class="row2"><button type="button" class="btn alt" id="sphoto">📷 Photo</button><button type="button" class="btn alt" id="stextBtn">Aa Text</button></div>
    <input type="file" id="sfile" accept="image/*" hidden>
    <select id="smode"><option value="all">Who can see: Everyone</option><option value="except">Everyone except…</option><option value="only">Only share with…</option></select>
    <div id="slist" hidden></div>
    <div class="row2"><select id="sdur"><option value="24">Lasts 24 hours</option><option value="48">Lasts 2 days</option><option value="72">Lasts 3 days</option><option value="120">Lasts 5 days</option><option value="168">Lasts 7 days</option></select><select id="slimit"><option value="0">Views: unlimited</option><option value="1">View once</option><option value="2">2 views each</option><option value="3">3 views each</option><option value="5">5 views each</option></select></div>
    <div class="row2"><button type="button" class="btn alt" id="scancel">Cancel</button><button type="button" class="btn" id="spost">Post</button></div>
    <div class="mute" style="font-size:12px">Disappears automatically. Everyone except people you blocked can see it, unless you choose who. For view once to chosen contacts: pick "Only share with…" and "View once".</div>
  </div>
</div>
<div id="sviewer" hidden>
  <div id="sbars"></div>
  <div id="shead"><div class="av" id="sav"></div><div id="sinfo"></div><button class="lnk" id="smute" hidden aria-label="Mute statuses">🔔</button><button class="lnk" id="sdel" hidden aria-label="Delete status">🗑</button><button class="lnk" id="sclose" aria-label="Close">✕</button></div>
  <div id="sbody"></div>
  <div id="sfoot"></div>
  <div id="stapL"></div><div id="stapR"></div>
</div>
<div id="viewer" hidden><div id="vbody"></div><div id="vnote">View once: this closes for good when you leave</div><button class="btn" id="vclose">Close</button></div>
<div id="lmodal" hidden>
  <div class="box">
    <h1 id="ltitle">Chat lock</h1>
    <div class="mute" id="lhint" style="font-size:13px"></div>
    <input type="password" id="lold" placeholder="Current lock password (or login password)" autocomplete="off" hidden>
    <input type="password" id="lpass" placeholder="Lock password" autocomplete="off">
    <input type="password" id="lpass2" placeholder="Repeat lock password" autocomplete="off" hidden>
    <div id="lerr"></div>
    <div class="row2"><button type="button" class="btn alt" id="lcancel">Cancel</button><button type="button" class="btn" id="lok">OK</button></div>
  </div>
</div>
<div id="cmodal" hidden>
  <div class="box">
    <h1 id="ctitle">Chat options</h1>
    <button type="button" class="btn alt" id="pinBtn"></button>
    <button type="button" class="btn alt" id="muteBtn"></button>
    <button type="button" class="btn alt" id="lockBtn"></button>
    <button type="button" class="btn alt" id="timerBtn"></button>
    <button type="button" class="btn alt" id="blockBtn" hidden></button>
    <button type="button" class="btn alt" id="shareBtn">📤 Share / export chat</button>
    <button type="button" class="btn alt" id="delBtn">🗑 Delete chat</button>
    <button type="button" class="lnk" id="cclose">Close</button>
  </div>
</div>
<div id="call" hidden>
  <video id="rv" autoplay playsinline></video>
  <video id="lv" autoplay playsinline muted></video>
  <div id="callInfo"></div>
  <div class="ctrls"><button class="btn" id="accept" hidden>Accept</button><button class="btn alt" id="mute">Mute</button><button class="btn" id="hang" style="background:#c0392b">End</button></div>
</div>

<script src="/socket.io/socket.io.js"></script>
<script>
const socket = io();
const $ = (s) => document.querySelector(s);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
let selected = null, replying = null, editing = null, statuses = [];
let prefs = { pinned: [], muted: [] }, timers = {}, blocks = [], once = false, settings = { allowDelete: true };
let comms = { mine: [], more: [] }, unlocked = new Set(), backTo = null;
let me = null, token = null, users = [], groups = {}, chats = {}, reads = {}, active = null, typing = null, typingTimer, lastTyped = 0;
try { token = localStorage.getItem('tok'); } catch (e) {}

const ck = (m) => (m.group ? 'g:' + m.group : 'u:' + (m.from === me ? m.to : m.from));
const keyOf = (a) => (a ? a.t + ':' + a.id : null);
const unreadRaw = (k) => (chats[k] || []).filter((m) => m.from !== me && !m.system && m.id > (reads[k] || 0)).length;
const unread = (k) => {
  if (k[0] === 'c') { const c = (comms.mine || []).find((x) => 'c:' + x.id === k); return c ? unreadRaw('g:' + c.stage) + (muted('g:' + c.lounge) ? 0 : unreadRaw('g:' + c.lounge)) : 0; }
  return unreadRaw(k);
};
const lockedKey = (k) => (prefs.locked || []).includes(k), lockedNow = (k) => lockedKey(k) && !unlocked.has(k);
const addMsg = (m) => { const l = (chats[ck(m)] ||= []); if (!l.some((x) => x.id === m.id)) l.push(m); };
const time = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const size = (n) => (n > 1e6 ? (n / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1e3)) + ' KB');

const lastSeen = (u) => { if (!u.lastSeen) return 'Offline'; const d = new Date(u.lastSeen); return 'Last seen ' + (d.toDateString() === new Date().toDateString() ? time(u.lastSeen) : d.toLocaleDateString()); };
function setAv(node, name, url) { node.style.backgroundImage = url ? 'url("' + url + '")' : ''; node.textContent = url ? '' : (Array.from(name || '?')[0] || '?').toUpperCase(); }
const brief = (m) => m.text || (m.file ? '📎 ' + m.file.name : m.poll ? '📊 ' + m.poll.q : '');
const pinned = (k) => prefs.pinned.includes(k), muted = (k) => prefs.muted.includes(k);
const isAdmin = (g) => g.owner === me || (g.admins || []).includes(me);
function refreshMe() { const u = users.find((x) => x.name === me); setAv($('#meAv'), me, u && u.avatar); }
function load(res) {
  me = res.me; token = res.token;
  try { localStorage.setItem('tok', token); } catch (e) {}
  comms = res.communities || comms; prefs = res.prefs || { pinned: [], muted: [] }; timers = res.timers || {}; blocks = res.blocked || []; settings = res.settings || { allowDelete: true }; statuses = res.statuses || []; saud = res.statusAud || saud; sdef = res.statusDef || sdef;
  users = res.users; groups = {}; res.groups.forEach((g) => (groups[g.id] = g));
  chats = {}; res.history.forEach(addMsg); reads = res.reads;
  $('#login').hidden = true; $('#app').hidden = false; $('#meName').textContent = me; refreshMe(); updateDelSet(); renderStatusRow();
  renderList(); renderChat();
}
function auth(payload) {
  socket.emit('auth', payload, (res) => {
    if (res.error) {
      if (payload.token) { token = null; try { localStorage.removeItem('tok'); } catch (e) {} return; }
      $('#err').textContent = res.error; return;
    }
    load(res);
    if (res.recovery) alert('Your recovery code: ' + res.recovery + ' — save it somewhere safe. It is the only way to reset your password if you forget it.');
  });
}
const creds = (mode) => ({ mode, name: $('#name').value, pass: $('#pass').value });
$('#authForm').onsubmit = (e) => { e.preventDefault(); if (!$('#rcode').hidden) return $('#doReset').click(); auth(creds('login')); };
$('#signup').onclick = () => auth(creds('signup'));
socket.on('connect', () => { if (token) auth({ token }); });
$('#logout').onclick = () => { socket.emit('logout'); try { localStorage.removeItem('tok'); } catch (e) {} location.reload(); };

socket.on('users', (l) => { users = l; refreshMe(); renderList(); renderChat(true); });
socket.on('group', (g) => { groups[g.id] = g; renderList(); renderChat(true); });
socket.on('group:history', ({ id, messages }) => {
  messages.forEach(addMsg);
  (chats['g:' + id] || []).sort((x, y) => x.id - y.id);
  renderList(); if (keyOf(active) === 'g:' + id) renderChat();
});
socket.on('group:removed', (id) => {
  delete groups[id]; delete chats['g:' + id];
  if (active && active.t === 'g' && active.id === id) { active = null; document.body.classList.remove('chatting'); }
  renderList(); renderChat();
});
socket.on('message:update', (m) => {
  const k = ck(m), l = chats[k] || [], i = l.findIndex((x) => x.id === m.id);
  if (i >= 0) l[i] = m;
  if (keyOf(active) === k) renderChat(false, true);
  renderList();
});
socket.on('message', (m) => {
  addMsg(m);
  const k = ck(m);
  if (m.from !== me && !m.system && !muted(k) && !(keyOf(active) === k && !document.hidden)) beep();
  if (keyOf(active) === k) { if (m.from !== me && !document.hidden) markRead(); renderChat(); }
  renderList();
});
socket.on('status', ({ ids, status }) => {
  Object.values(chats).flat().forEach((m) => { if (ids.includes(m.id)) m.status = status; });
  renderChat();
});
socket.on('typing', (t) => {
  typing = t; renderChat(true);
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => { typing = null; renderChat(true); }, 1800);
});

function markRead() {
  const k = keyOf(active), list = chats[k] || [];
  if (list.length) reads[k] = Math.max(reads[k] || 0, list[list.length - 1].id);
  socket.emit('read', active.t === 'g' ? { group: active.id } : { to: active.id });
  renderList();
}

function item(k, label, sub, cls, online, open, url) {
  const row = el('div', 'item' + (k === keyOf(active) ? ' on' : '')); row.dataset.k = k;
  const meta = el('div', 'meta');
  meta.append(el('div', '', label + (lockedKey(k) ? ' 🔒' : '') + (pinned(k) ? ' 📌' : '') + (muted(k) ? ' 🔇' : '') + (blocks.includes(k.slice(2)) && k[0] === 'u' ? ' 🚫' : '')), el('div', 'sub', sub));
  const av = el('div', 'av ' + cls + (online ? ' online' : '')); setAv(av, label, url); row.append(av, meta);
  if (unread(k)) row.append(el('span', 'badge' + (muted(k) ? ' off' : ''), unread(k)));
  row.onclick = open;
  return row;
}
const preview = (k) => { if (lockedNow(k)) return '🔒 Locked chat'; const l = (chats[k] || []).slice(-1)[0]; return l ? (l.from === me ? 'You: ' : '') + brief(l) : ''; };

function renderList() {
  const box = $('#list'); box.replaceChildren(); const rows = [];
  Object.values(groups).forEach((g) => g.world || rows.push(item('g:' + g.id, g.name, preview('g:' + g.id) || (g.world ? 'Public room · everyone is in it' : g.members.length + (g.members.length === 1 ? ' member' : ' members')), 'g', false, () => openChat('g', g.id), g.avatar)));
  (comms.mine || []).forEach((c) => {
    const sl = (chats['g:' + c.stage] || []).filter((m) => !m.system && !m.deleted).slice(-1)[0];
    rows.push(item('c:' + c.id, '🌍 ' + c.name, sl ? '🎤 ' + (sl.from === me ? 'You' : sl.from) + (sl.tag ? ' · ' + sl.tag : '') + ': ' + brief(sl) : (c.auto ? 'You are the auto admin · ' : c.admin ? 'You are an admin · ' : '') + 'Main Stage · groups · open lounge', 'g', false, () => openChat('c', c.id)));
  });
  rows.push(item('c:_browse', '🌐 Communities', 'Create your own or join one' + ((comms.more || []).length ? ' · ' + comms.more.length + ' to join' : ''), 'g', false, () => openChat('c', '_browse')));
  const others = users.filter((u) => u.name !== me);
  others.forEach((u) => rows.push(item('u:' + u.name, u.name, preview('u:' + u.name) || (u.online ? 'Online' : lastSeen(u)), '', u.online, () => openChat('u', u.name), u.avatar)));
  const wt = (r) => (r.dataset.k === 'c:world' ? 4 : r.dataset.k === 'c:_browse' ? 2 : r.dataset.k.slice(0, 2) === 'c:' ? 3 : 0);
  rows.sort((x, y) => pinned(y.dataset.k) - pinned(x.dataset.k) || wt(y) - wt(x)).forEach((r) => box.append(r));
  const total = Object.keys(chats).filter((k) => !muted(k)).reduce((s, k) => s + unread(k), 0);
  document.title = (total ? '(' + total + ') ' : '') + 'Chat';
  if (!others.length && !Object.keys(groups).length) box.append(el('div', 'empty', 'No one else is here yet. Share the link and have a friend sign up.'));
}

function openChat(t, id, fromC) {
  const k = t + ':' + id;
  if (lockedNow(k)) return askLock('unlock', 'Open locked chat', () => { unlocked.add(k); openChat(t, id, fromC); });
  if (active && active.t !== 'c' && keyOf(active) !== k) unlocked.delete(keyOf(active)); // leaving a locked chat locks it again
  backTo = fromC ? { t: 'c', id: fromC } : null;
  active = { t, id }; clearBar(); selected = null; closeEmojis();
  document.body.classList.add('chatting');
  if (t === 'c') { renderList(); renderChat(); return; }
  markRead(); renderChat(); $('#text').focus();
}
$('#back').onclick = () => {
  if (active && active.t !== 'c') unlocked.delete(keyOf(active));
  if (backTo) { active = backTo; backTo = null; renderList(); renderChat(); return; }
  active = null; document.body.classList.remove('chatting'); renderList(); renderChat();
};

function renderChat(headerOnly, keepScroll) {
  const composer = $('#composer');
  if (!active) {
    $('#peerName').textContent = 'Select a chat'; $('#peerStatus').textContent = '';
    $('#peerAv').hidden = true; composer.hidden = true; $('.hbtns').hidden = true; $('#locked').hidden = true; clearBar();
    $('#msgs').replaceChildren(el('div', 'empty', 'Choose a chat from the list to start.'));
    return;
  }
  if (active.t === 'c') return renderCommunity(headerOnly);
  const isG = active.t === 'g', g = groups[active.id], u = users.find((x) => x.name === active.id);
  const title = isG ? (g ? g.name : '') : active.id;
  $('#peerAv').hidden = false; $('#peerAv').textContent = (title || '?')[0].toUpperCase();
  $('#peerAv').className = 'av' + (isG ? ' g' : ''); setAv($('#peerAv'), title || '?', isG ? g && g.avatar : u && u.avatar);
  $('#peerName').textContent = title;
  const typingHere = typing && (isG ? typing.group === active.id : !typing.group && typing.from === active.id);
  $('#peerStatus').textContent = typingHere ? (isG ? typing.from + ' is typing…' : 'typing…') : isG ? (g ? (g.stage ? 'Main Stage · only admitted speakers can post' : g.world ? (g.comm === 'world' ? 'Public room · everyone is in it' : 'Community chat · ' + g.members.length + ' members') : g.members.join(', ')) : '') : u && u.online ? 'online' : u ? lastSeen(u) : 'offline';
  const blockedDm = !isG && blocks.includes(active.id), lockedOut = !!(isG && g && g.announce && !isAdmin(g)) || blockedDm;
  $('#locked').textContent = blockedDm ? 'You blocked ' + active.id + '. Open the ⋮ menu to unblock.' : (g && g.stage ? 'Only speakers admitted by an admin can post here. You can read everything.' : 'Only admins can send messages in this group.');
  composer.hidden = lockedOut; $('#locked').hidden = !lockedOut;
  $('.hbtns').hidden = false; $('#gset').hidden = !isG || !!(g && g.world);
  const kk = keyOf(active); $('#pinBtn').textContent = pinned(kk) ? '📌 Unpin chat' : '📌 Pin chat'; $('#muteBtn').textContent = muted(kk) ? '🔕 Unmute chat' : '🔔 Mute chat';
  if (!isG) $('#blockBtn').textContent = blocks.includes(active.id) ? '✅ Unblock ' + active.id : '🚫 Block ' + active.id;
  $('#lockBtn').textContent = lockedKey(kk) ? '🔓 Remove chat lock' : '🔒 Lock this chat'; $('#lockBtn').hidden = !!(g && g.world);
  const ttl = (isG ? g && g.ttl : timers[kk]) || 0;
  $('#timerBtn').textContent = '⏱ Disappearing messages: ' + (ttl ? ttlLabel[ttl] : 'off'); $('#timerBtn').hidden = !!(g && g.world);
  $('#pollBtn').hidden = !isG;
  $('#acall').hidden = $('#vcall').hidden = isG || !(u && u.online) || !!pc || blocks.includes(active.id);
  if (headerOnly) return;

  const box = $('#msgs'), prev = box.scrollTop; box.replaceChildren();
  const list = chats[keyOf(active)] || [];
  const gc = isG && g && g.comm ? (comms.mine || []).find((x) => x.id === g.comm) : null; // the community this room belongs to
  if (!list.length) box.append(el('div', 'empty', isG && g && g.stage ? 'The stage is empty. Admitted speakers will appear here.' : isG && g && g.world ? 'The world is quiet. Say hello to everyone!' : 'No messages yet. Say hi!'));
  list.forEach((m) => {
    if (m.system) { box.append(el('div', 'sys', m.text)); return; }
    const b = el('div', 'm' + (m.from === me ? ' me' : ''));
    if (isG && (m.from !== me || m.tag || m.auto)) { const w = el('div', 'who'); if (m.auto) w.append(el('span', 'autotag', 'auto'), ' '); w.append(m.from + (m.tag ? ' · ' + m.tag : '')); b.append(w); }
    if (m.fwd) b.append(el('div', 'voters', '↪ Forwarded'));
    if (m.sref) b.append(el('div', 'quote', '↩ Status: ' + (m.sref.kind === 'image' ? '📷 ' : '') + (m.sref.text || (m.sref.kind === 'image' ? 'Photo' : ''))));
    if (m.replyTo) {
      const r = list.find((x) => x.id === m.replyTo);
      b.append(el('div', 'quote', !r ? 'Original message' : r.deleted ? 'Deleted message' : r.from + ': ' + brief(r).slice(0, 80)));
    }
    if (m.deleted) {
      b.append(el('i', 'mute', '🚫 This message was deleted'));
      if (m.modBy) b.append(el('div', 'voters', 'Removed by admin ' + m.modBy));
      if (m.keptBy && m.keptBy.length) b.append(el('div', 'voters', 'Still visible to ' + m.keptBy.join(', ') + ' (their setting)'));
    }
    else {
      if (m.file) {
        if (m.file.once) b.append(onceView(m));
        else if (m.file.type.indexOf('audio/') === 0) b.append(voicePlayer(m.file));
        else if (m.file.type.indexOf('image/') === 0) { const img = el('img', 'pic'); img.src = m.file.url; img.alt = m.file.name; b.append(img); }
        else { const a = el('a', '', '📎 ' + m.file.name + ' (' + size(m.file.size) + ')'); a.href = m.file.url; a.download = m.file.name; b.append(a); }
      }
      if (m.poll) b.append(pollView(m));
      if (m.text) b.append(document.createTextNode(m.text));
    }
    if (m.kept) b.append(el('div', 'voters', '🗑 The sender deleted this message, but you kept your copy'));
    const t = el('span', 't', (m.expires ? '⏱ ' : '') + (m.edited && !m.deleted ? 'edited ' : '') + time(m.ts) + ' ');
    if (m.from === me && !m.group && !m.deleted) t.append(el('span', 'tick' + (m.status === 'read' ? ' read' : ''), m.status === 'sent' ? '✓' : '✓✓'));
    b.append(t);
    if (m.reactions && !m.deleted) b.append(reactView(m));
    if (!m.deleted) {
      b.style.cursor = 'pointer';
      b.onclick = (e) => { if (e.target.tagName === 'A') return; selected = selected === m.id ? null : m.id; renderChat(false, true); };
      if (selected === m.id) {
        const qr = el('div', 'qr');
        ['👍', '❤️', '😂', '😮', '😢', '🙏'].forEach((em) => {
          const x = el('button', '', em);
          x.onclick = (e) => { e.stopPropagation(); selected = null; socket.emit('react', { id: m.id, emoji: em }); renderChat(false, true); };
          qr.append(x);
        });
        const more = el('button', '', '＋');
        more.onclick = (e) => { e.stopPropagation(); selected = null; reactTarget = m.id; openEmojis(); renderChat(false, true); };
        qr.append(more); b.append(qr);
        const acts = el('div', 'acts');
        const add = (label, fn) => { const x = el('button', 'lnk', label); x.onclick = (e) => { e.stopPropagation(); selected = null; fn(); renderChat(false, true); }; acts.append(x); };
        add('Reply', () => { editing = null; replying = m; showBar('Replying to ' + m.from + ': ' + brief(m).slice(0, 60)); });
        if (m.from === me) {
          if (!m.poll) add('Edit', () => { replying = null; editing = m; $('#text').value = m.text; showBar('Editing message'); });
          if (m.poll && !m.poll.closed) add('Close poll', () => socket.emit('poll:close', { id: m.id }));
          add('Delete for everyone', () => { if (confirm('Delete this message for everyone? Anyone who turned off "Others can delete my copy" will keep it.')) socket.emit('message:delete', { id: m.id }, (r) => r && r.kept && r.kept.length && alert('Deleted. Kept because of their setting: ' + r.kept.join(', '))); });
          if (m.group && !(groups[m.group] && groups[m.group].world)) add('Seen by', () => socket.emit('seen', { id: m.id }, (r) => alert('Seen by: ' + (r.seen.join(', ') || 'nobody yet') + (r.pending.length ? ' | Not yet: ' + r.pending.join(', ') : ''))));
        }
        if (!m.poll && !(m.file && m.file.once)) add('Forward', () => openForward(m));
        add('Delete for me', () => { if (confirm('Delete this message from your chat only?')) socket.emit('message:hide', { id: m.id }); });
        if (gc && gc.admin && m.from !== me && !(m.auto && !gc.auto)) add('Remove (admin)', () => { if (confirm('Remove this message for everyone?')) socket.emit('message:delete', { id: m.id }, errAlert); });
        b.append(acts);
      }
    }
    box.append(b);
  });
  box.scrollTop = keepScroll ? prev : box.scrollHeight;
}

function sendMsg(extra) {
  const p = Object.assign(active.t === 'g' ? { group: active.id } : { to: active.id }, { text: $('#text').value, replyTo: replying ? replying.id : undefined }, extra);
  socket.emit('message', p, (r) => r && r.error && alert(r.error));
  $('#text').value = ''; clearBar(); closeEmojis();
}
function showBar(t) { $('#barText').textContent = t; $('#bar').hidden = false; $('#text').focus(); }
function clearBar() { if (editing) $('#text').value = ''; replying = null; editing = null; $('#bar').hidden = true; }
$('#barX').onclick = clearBar;
$('#composer').onsubmit = (e) => {
  e.preventDefault();
  const v = $('#text').value.trim();
  if (!v || !active) return;
  if (editing) { socket.emit('message:edit', { id: editing.id, text: v }); clearBar(); $('#text').value = ''; }
  else sendMsg();
};
$('#text').oninput = () => {
  if (active && Date.now() - lastTyped > 1000) { lastTyped = Date.now(); socket.emit('typing', active.t === 'g' ? { group: active.id } : { to: active.id }); }
};
$('#attach').onclick = () => $('#file').click();
$('#file').onchange = (e) => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f || !active) return;
  if (f.size > 20e6) return alert('File must be under 20 MB.');
  if (once && !/^(image|audio)/.test(f.type)) return alert('View once works for photos and voice notes only. Turn it off with the 👁 button to send this file.');
  const o = once; setOnce(false);
  const r = new FileReader();
  r.onload = () => sendMsg({ file: { name: f.name, type: f.type, once: o, data: String(r.result).split(',')[1] } });
  r.readAsDataURL(f);
};

$('#newGroup').onclick = () => {
  $('#gname').value = ''; const box = $('#gm'); box.replaceChildren();
  users.filter((u) => u.name !== me).forEach((u) => {
    const l = el('label'); const c = document.createElement('input');
    c.type = 'checkbox'; c.value = u.name; l.append(c, document.createTextNode(' ' + u.name)); box.append(l);
  });
  $('#modal').hidden = false;
};
$('#gcancel').onclick = () => ($('#modal').hidden = true);
$('#gcreate').onclick = () => {
  const members = [...document.querySelectorAll('#gm input:checked')].map((c) => c.value);
  socket.emit('group:create', { name: $('#gname').value, members, history: $('#ghist').checked, announce: $('#gann').checked }, (r) => {
    if (r.error) return alert(r.error);
    $('#modal').hidden = true; openChat('g', r.id);
  });
};

// ---- Group settings ----
$('#gset').onclick = () => {
  const g = groups[active.id]; if (!g) return;
  const admin = isAdmin(g);
  $('#gname2').value = g.name; $('#gname2').disabled = !admin; $('#gav').hidden = !admin; $('#ghist2').checked = g.history !== false; $('#ghist2').disabled = !admin; $('#gann2').checked = !!g.announce; $('#gann2').disabled = !admin; $('#gsave').hidden = !admin;
  const box = $('#gmem'); box.replaceChildren();
  box.append(el('div', 'mute', 'Owner: ' + g.owner + (g.owner === me ? ' (you)' : '')));
  users.filter((u) => u.name !== me).forEach((u) => {
    const l = el('label'), c = document.createElement('input');
    c.type = 'checkbox'; c.value = u.name; c.checked = g.members.includes(u.name); c.disabled = !admin || u.name === g.owner;
    const d = document.createElement('input'); d.type = 'checkbox'; d.className = 'adm'; d.value = u.name;
    d.checked = u.name === g.owner || (g.admins || []).includes(u.name); d.disabled = !admin || u.name === g.owner;
    l.append(c, document.createTextNode(' ' + u.name + (u.name === g.owner ? ' (owner)' : '') + '  '), d, document.createTextNode(' admin')); box.append(l);
  });
  $('#gmodal').hidden = false;
};
$('#gclose').onclick = () => ($('#gmodal').hidden = true);
$('#gleave').onclick = () => { if (confirm('Leave this group?')) { socket.emit('group:leave', active.id); $('#gmodal').hidden = true; } };
$('#gsave').onclick = () => {
  const g = groups[active.id], boxes = [...document.querySelectorAll('#gmem input:not(.adm)')];
  const admins = [...document.querySelectorAll('#gmem input.adm:checked')].map((c) => c.value);
  if (isAdmin(g)) admins.push(me);
  const add = boxes.filter((c) => c.checked && !g.members.includes(c.value)).map((c) => c.value);
  const remove = boxes.filter((c) => !c.checked && g.members.includes(c.value)).map((c) => c.value);
  socket.emit('group:update', { id: g.id, name: $('#gname2').value, add, remove, history: $('#ghist2').checked, announce: $('#gann2').checked, admins }, (r) => { if (r.error) return alert(r.error); $('#gmodal').hidden = true; });
};

// ---- Profile picture, theme, install ----
$('#meAv').onclick = () => $('#avFile').click();
$('#avFile').onchange = (e) => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  if (f.size > 2e6) return alert('Picture must be under 2 MB.');
  const r = new FileReader();
  r.onload = () => socket.emit('profile:avatar', { type: f.type, data: String(r.result).split(',')[1] }, (x) => x && x.error && alert(x.error));
  r.readAsDataURL(f);
};
function applyTheme(t) { if (t) document.documentElement.dataset.theme = t; }
try { applyTheme(localStorage.getItem('theme')); } catch (e) {}
$('#theme').onclick = () => {
  const cur = document.documentElement.dataset.theme || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next); try { localStorage.setItem('theme', next); } catch (e) {}
};
let installEv = null;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEv = e; $('#install').hidden = false; });
$('#install').onclick = () => { if (installEv) { installEv.prompt(); installEv = null; $('#install').hidden = true; } };
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});

// ---- Voice / video calls (WebRTC, 1-to-1) ----
const ICE = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
let pc = null, localStream = null, callPeer = null, pendingIce = [], pendingOffer = null;
function showCall(text, incoming) { $('#callInfo').textContent = text; $('#accept').hidden = !incoming; $('#call').hidden = false; }
async function getMedia(video) {
  try { return await navigator.mediaDevices.getUserMedia({ audio: true, video }); }
  catch (e) { alert('Cannot use mic/camera. Calls need HTTPS (or localhost) and permission.'); return null; }
}
function newPC(peer) {
  pc = new RTCPeerConnection(ICE); callPeer = peer;
  pc.onicecandidate = (e) => e.candidate && socket.emit('call:ice', { to: peer, c: e.candidate });
  pc.ontrack = (e) => { $('#rv').srcObject = e.streams[0]; };
  pc.onconnectionstatechange = () => { if (pc && ['failed', 'closed'].includes(pc.connectionState)) endCall(false); };
  localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));
  $('#lv').srcObject = localStream; $('#lv').hidden = !localStream.getVideoTracks().length;
}
async function flushIce() { for (const c of pendingIce) await pc.addIceCandidate(c).catch(() => {}); pendingIce = []; }
async function startCall(video) {
  if (pc || pendingOffer || !active || active.t !== 'u') return;
  pendingIce = []; localStream = await getMedia(video); if (!localStream) return;
  newPC(active.id); showCall('Calling ' + active.id + '…', false);
  const offer = await pc.createOffer(); await pc.setLocalDescription(offer);
  socket.emit('call:offer', { to: active.id, sdp: offer, video });
}
function endCall(notify) {
  if (notify) { const to = callPeer || (pendingOffer && pendingOffer.from); if (to) socket.emit('call:end', { to }); }
  if (pc) pc.close(); pc = null;
  if (localStream) localStream.getTracks().forEach((t) => t.stop());
  localStream = null; pendingOffer = null; pendingIce = []; callPeer = null;
  $('#rv').srcObject = null; $('#call').hidden = true; renderChat(true);
}
socket.on('call:offer', (d) => {
  if (pc || pendingOffer) return socket.emit('call:busy', { to: d.from });
  pendingIce = []; pendingOffer = d; showCall(d.from + ' is ' + (d.video ? 'video' : 'voice') + ' calling…', true);
});
socket.on('call:answer', async ({ sdp }) => { if (!pc) return; await pc.setRemoteDescription(sdp); await flushIce(); $('#callInfo').textContent = 'Connected'; });
socket.on('call:ice', ({ c }) => { if (pc && pc.remoteDescription) pc.addIceCandidate(c).catch(() => {}); else pendingIce.push(c); });
socket.on('call:end', () => endCall(false));
socket.on('call:busy', () => { alert('That user is busy.'); endCall(false); });
$('#accept').onclick = async () => {
  const d = pendingOffer; $('#accept').hidden = true;
  localStream = await getMedia(d.video); if (!localStream) return endCall(true);
  pendingOffer = null; newPC(d.from);
  await pc.setRemoteDescription(d.sdp); await flushIce();
  const ans = await pc.createAnswer(); await pc.setLocalDescription(ans);
  socket.emit('call:answer', { to: d.from, sdp: ans });
  $('#callInfo').textContent = 'Connected with ' + d.from;
};
$('#hang').onclick = () => endCall(true);
$('#mute').onclick = () => { const t = localStream && localStream.getAudioTracks()[0]; if (t) { t.enabled = !t.enabled; $('#mute').textContent = t.enabled ? 'Mute' : 'Unmute'; } };
$('#acall').onclick = () => startCall(false);
$('#vcall').onclick = () => startCall(true);

// ---- Pin / mute, sound ----
socket.on('prefs', (p) => {
  prefs = p; renderList(); renderChat(true); renderStatusRow();
  if (sview && sview.name !== me) $('#smute').textContent = (p.statusMuted || []).includes(sview.name) ? '🔕' : '🔔';
});
$('#pinBtn').onclick = () => active && socket.emit('pref:set', { key: keyOf(active), pinned: !pinned(keyOf(active)) });
$('#muteBtn').onclick = () => active && socket.emit('pref:set', { key: keyOf(active), muted: !muted(keyOf(active)) });
let actx;
function beep() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.connect(g); g.connect(actx.destination); g.gain.value = 0.05; o.frequency.value = 880;
    o.start(); o.stop(actx.currentTime + 0.12);
  } catch (e) {}
  if (navigator.vibrate) navigator.vibrate(80);
}

// ---- Password reset / recovery code ----
function setReset(on) {
  $('#rcode').hidden = !on; $('#doReset').hidden = !on; $('#backLogin').hidden = !on;
  $('#rowLogin').hidden = on; $('#forgot').hidden = on; $('#err').textContent = '';
  $('#pass').placeholder = on ? 'New password (6+ characters)' : 'Password (6+ characters)';
}
$('#forgot').onclick = () => setReset(true);
$('#backLogin').onclick = () => setReset(false);
$('#doReset').onclick = () => auth({ mode: 'reset', name: $('#name').value, code: $('#rcode').value, pass: $('#pass').value });
$('#recBtn').onclick = () => {
  if (confirm('Create a new recovery code? The old one will stop working.')) socket.emit('recovery:new', null, (r) => alert('Your new recovery code: ' + r.code + ' — save it somewhere safe.'));
};

// ---- Voice notes: waveform + playback speed ----
let rec = null, recTimer = null, recStart = 0, curAudio = null;
const fmt = (s) => Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0');
function voicePlayer(f) {
  const box = el('div', 'vp'), play = el('button', 'lnk', '▶'), bars = el('div', 'wave'), spd = el('button', 'lnk', '1x');
  const au = new Audio(); au.preload = 'none'; au.src = f.url;
  const total = () => (isFinite(au.duration) && au.duration) || f.dur || 0;
  const spans = (f.wave && f.wave.length ? f.wave : new Array(40).fill(30)).map((v) => { const sp = el('span'); sp.style.height = Math.max(8, v) + '%'; bars.append(sp); return sp; });
  const paint = () => { const p = total() ? au.currentTime / total() : 0; spans.forEach((sp, i) => sp.classList.toggle('on', i / spans.length < p)); };
  play.onclick = () => { if (au.paused) { if (curAudio && curAudio !== au) curAudio.pause(); curAudio = au; au.play().catch(() => {}); } else au.pause(); };
  au.onplay = () => (play.textContent = '⏸'); au.onpause = () => (play.textContent = '▶');
  au.onended = () => { play.textContent = '▶'; au.currentTime = 0; paint(); };
  au.ontimeupdate = paint;
  bars.onclick = () => {};
  bars.addEventListener('click', (e) => { const r = bars.getBoundingClientRect(); if (total()) { au.currentTime = total() * (e.clientX - r.left) / r.width; paint(); } });
  spd.onclick = () => { const n = au.playbackRate === 1 ? 1.5 : au.playbackRate === 1.5 ? 2 : 1; au.playbackRate = n; spd.textContent = n + 'x'; };
  box.append(play, bars, spd, el('span', 'mute', f.dur ? fmt(f.dur) : ''));
  box.onclick = (e) => e.stopPropagation();
  return box;
}
$('#mic').onclick = async () => {
  if (rec) { rec.stop(); return; }
  if (!active) return;
  if (!window.MediaRecorder) return alert('Voice notes are not supported in this browser.');
  const stream = await getMedia(false); if (!stream) return;
  const target = active, chunks = [], peaks = [], o = once; setOnce(false);
  let ac = null, peakTimer = null;
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    const an = ac.createAnalyser(); an.fftSize = 256; ac.createMediaStreamSource(stream).connect(an);
    const buf = new Uint8Array(an.fftSize);
    peakTimer = setInterval(() => { an.getByteTimeDomainData(buf); let mx = 0; for (const v of buf) mx = Math.max(mx, Math.abs(v - 128)); peaks.push(mx); }, 100);
  } catch (e) {}
  rec = new MediaRecorder(stream); recStart = Date.now();
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  rec.onstop = () => {
    clearInterval(recTimer); clearInterval(peakTimer); stream.getTracks().forEach((t) => t.stop()); if (ac) ac.close().catch(() => {});
    const type = (rec.mimeType || 'audio/webm').split(';')[0], secs = (Date.now() - recStart) / 1000;
    rec = null; $('#mic').textContent = '🎤'; $('#mic').classList.remove('rec');
    if (secs < 1) return;
    const blob = new Blob(chunks, { type });
    if (blob.size > 20e6) return alert('Voice note is too long.');
    let wave = [];
    for (let i = 0; i < 40; i++) { const a = Math.floor(i * peaks.length / 40), z = Math.max(a + 1, Math.floor((i + 1) * peaks.length / 40)); wave.push(Math.max(0, ...peaks.slice(a, z))); }
    const top = Math.max(1, ...wave); wave = wave.map((v) => Math.round(v / top * 100));
    const fr = new FileReader();
    fr.onload = () => socket.emit('message', Object.assign(target.t === 'g' ? { group: target.id } : { to: target.id }, { text: '', file: { name: 'voice-note', type, wave, dur: Math.round(secs), once: o, data: String(fr.result).split(',')[1] } }), (r) => r && r.error && alert(r.error));
    fr.readAsDataURL(blob);
  };
  rec.start(); $('#mic').classList.add('rec');
  const tick = () => { const s = Math.floor((Date.now() - recStart) / 1000); $('#mic').textContent = '⏹ ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  tick(); recTimer = setInterval(tick, 500);
};

// ---- Polls (groups) ----
function pollView(m) {
  const p = m.poll, box = el('div', 'poll'), total = p.options.reduce((n, o) => n + o.votes.length, 0);
  box.append(el('div', 'pq', '📊 ' + p.q));
  p.options.forEach((o, i) => {
    const btn = el('button', 'opt' + (o.votes.includes(me) ? ' mine' : '')), fill = el('span', 'fill');
    btn.disabled = p.closed; fill.style.width = (total ? Math.round(o.votes.length / total * 100) : 0) + '%';
    btn.append(fill, el('span', 'lbl', o.t + ' — ' + o.votes.length));
    btn.onclick = (e) => { e.stopPropagation(); socket.emit('poll:vote', { id: m.id, option: i }); };
    box.append(btn);
    if (o.votes.length) box.append(el('div', 'voters', o.votes.join(', ')));
  });
  box.append(el('div', 'voters', p.closed ? 'Poll closed · ' + total + (total === 1 ? ' vote' : ' votes') : total + (total === 1 ? ' vote' : ' votes') + ' · tap an option to vote or undo'));
  return box;
}
$('#pollBtn').onclick = () => {
  if (!active || active.t !== 'g') return;
  const q = prompt('Poll question?'); if (!q) return;
  const o = prompt('Options, separated by commas (2 to 6). Example: Yes, No, Maybe'); if (!o) return;
  socket.emit('poll:create', { group: active.id, q, options: o.split(',') }, (r) => r && r.error && alert(r.error));
};

// ---- Disappearing messages ----
const TTLS = [0, 3600, 86400, 604800], ttlLabel = { 0: 'off', 3600: '1h', 86400: '24h', 604800: '7d' };
$('#timerBtn').onclick = () => {
  if (!active) return;
  const cur = (active.t === 'g' ? (groups[active.id] || {}).ttl : timers[keyOf(active)]) || 0;
  const next = TTLS[(TTLS.indexOf(cur) + 1) % TTLS.length];
  socket.emit('timer:set', active.t === 'g' ? { group: active.id, seconds: next } : { to: active.id, seconds: next }, (r) => r && r.error && alert(r.error));
};
socket.on('timer', ({ key, seconds }) => { timers[key] = seconds; renderChat(true); });
socket.on('message:gone', ({ ids }) => {
  Object.values(chats).forEach((l) => { for (let i = l.length - 1; i >= 0; i--) if (ids.includes(l[i].id)) l.splice(i, 1); });
  renderChat(false, true); renderList();
});

// ---- Group picture ----
$('#gav').onclick = () => $('#gavFile').click();
$('#gavFile').onchange = (e) => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f || !active) return;
  if (f.size > 2e6) return alert('Picture must be under 2 MB.');
  const r = new FileReader();
  r.onload = () => socket.emit('group:avatar', { id: active.id, type: f.type, data: String(r.result).split(',')[1] }, (x) => x && x.error && alert(x.error));
  r.readAsDataURL(f);
};

// ---- Chat menu, block, delete chat ----
$('#menuBtn').onclick = () => {
  if (!active) return;
  renderChat(true);
  $('#ctitle').textContent = active.t === 'g' ? (groups[active.id] || {}).name || 'Group' : active.id;
  $('#blockBtn').hidden = active.t !== 'u';
  $('#cmodal').hidden = false;
};
$('#cclose').onclick = () => ($('#cmodal').hidden = true);
$('#blockBtn').onclick = () => {
  if (!active || active.t !== 'u') return;
  const on = !blocks.includes(active.id);
  if (!on || confirm('Block ' + active.id + '? They will not be able to message or call you.')) socket.emit('block:set', { name: active.id, blocked: on });
};
socket.on('blocks', (b) => { blocks = b; Object.values(groups).filter((g) => g.world && !g.stage).forEach((g) => { chats['g:' + g.id] = (chats['g:' + g.id] || []).filter((m) => !blocks.includes(m.from)); }); renderList(); renderChat(); });
$('#delBtn').onclick = () => {
  if (!active || !confirm('Delete this chat for you? The other people keep their copy.')) return;
  socket.emit('chat:clear', active.t === 'g' ? { group: active.id } : { to: active.id });
  $('#cmodal').hidden = true;
};
socket.on('cleared', ({ key, upTo }) => {
  chats[key] = (chats[key] || []).filter((m) => m.id > upTo);
  reads[key] = Math.max(reads[key] || 0, upTo);
  renderChat(); renderList();
});

// ---- View once ----
function setOnce(v) { once = v; $('#onceBtn').classList.toggle('rec', !!v); $('#onceBtn').textContent = v ? '👁 ' + v + '×' : '👁'; }
$('#onceBtn').onclick = () => { // tap to cycle: off, 1, 2, 3, 5 views each
  const steps = [0, 1, 2, 3, 5], prev = once || 0; setOnce(steps[(steps.indexOf(prev) + 1) % steps.length]);
  if (!prev) alert('View once is ON. Your next photo or voice note can be opened a limited number of times, then it is deleted. Tap 👁 again to change how many views each person gets (1, 2, 3, 5) or to turn it off. Recipients can still screenshot or record it.');
};
function onceView(m) {
  const f = m.file, what = f.type.indexOf('image/') === 0 ? 'Photo' : 'Voice note', views = f.views || {}, max = f.max || 1, box = el('div', 'once');
  const names = Object.keys(views).filter((n) => views[n] > 0), mine = views[me] || 0;
  if (m.from === me) {
    box.append(el('div', '', '👁 ' + what + ' · ' + (max === 1 ? 'view once' : max + ' views each')));
    box.append(el('div', 'voters', names.length ? 'Opened' + (m.group ? ' by ' + names.map((n) => n + ' (' + views[n] + '/' + max + ')').join(', ') : ' ' + views[names[0]] + '/' + max) : f.gone ? 'Expired' : 'Not opened yet'));
    return box;
  }
  if (mine >= max) { box.append(el('i', 'mute', '👁 Opened' + (max > 1 ? ' · all ' + max + ' views used' : ''))); return box; }
  if (f.gone) { box.append(el('i', 'mute', '👁 Expired')); return box; }
  const btn = el('button', 'btn alt', '👁 ' + (mine ? 'Open again ' : 'Open ') + what.toLowerCase() + (max === 1 ? ' (view once)' : ' (' + (max - mine) + ' of ' + max + ' views left)'));
  btn.onclick = (e) => { e.stopPropagation(); openOnce(m); };
  box.append(btn); return box;
}
function openOnce(m) {
  socket.emit('once:open', { id: m.id }, (r) => {
    if (r.error) return alert(r.error);
    const body = $('#vbody'); body.replaceChildren();
    if (r.type.indexOf('image/') === 0) { const img = el('img'); img.src = r.url; img.draggable = false; img.oncontextmenu = (e) => e.preventDefault(); body.append(img); }
    else { const au = el('audio'); au.controls = true; au.autoplay = true; au.src = r.url; body.append(au); }
    $('#vnote').textContent = r.left > 0 ? 'You can open it ' + r.left + (r.left === 1 ? ' more time' : ' more times') : 'This is your last view: it closes for good when you leave';
    $('#viewer').hidden = false;
  });
}
$('#vclose').onclick = () => { $('#vbody').replaceChildren(); $('#viewer').hidden = true; };

// ---- Delete for me / for everyone, and the "others can delete my copy" switch ----
function updateDelSet() { $('#delSetBtn').textContent = '🗑 Others can delete my copy: ' + (settings.allowDelete ? 'ON' : 'OFF'); }
$('#delSetBtn').onclick = () => {
  const next = !settings.allowDelete;
  if (!next && !confirm('Turn OFF? When someone uses Delete for everyone, the message will stay in your chat, with a note. Turn it ON to let senders remove messages from your chat.')) return;
  socket.emit('settings:set', { allowDelete: next });
};
socket.on('settings', (s) => { settings = s; updateDelSet(); });
socket.on('hidden', ({ id }) => {
  Object.values(chats).forEach((l) => { const i = l.findIndex((x) => x.id === id); if (i >= 0) l.splice(i, 1); });
  renderChat(false, true); renderList();
});

// ---- Emoji picker + reactions ----
const EMOJI = [
  ['😀', '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😍 🥰 😘 😋 😛 😜 🤪 🤗 🤭 🤔 😐 🙄 😏 😴 😎 🤓 😕 😟 😢 😭 😤 😡 🤬 😱 😨 😰 😳 🥺 😬 🤯 🥳 🤒 🤧 🥶 🥵'],
  ['👍', '👍 👎 👌 🤞 🤟 🤘 🤙 👈 👉 👆 👇 ✋ 🤚 👋 👏 🙌 👐 🤝 🙏 💪 🤳 👀 🧠 🙈 🙉 🙊'],
  ['❤️', '❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 💕 💞 💓 💗 💖 💘 💝 💋 💯'],
  ['🐶', '🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🦄 🐝 🦋 🐢 🐍 🐙 🐬 🐳 🍎 🍊 🍌 🍉 🍇 🍓 🍒 🍑 🍍 🥑 🍅 🌽 🍕 🍔 🍟 🌭 🌮 🍩 🍪 🎂 🍰 🍫 🍿 ☕ 🍺 🍷 🥂'],
  ['🎉', '🎉 🎊 🎁 🎈 🏆 ⚽ 🏀 🏈 🎮 🎵 🎶 🎤 🎧 📱 💻 📷 🔥 ✨ ⭐ 🌟 💡 ✅ ❌ ❓ ❗ 💤 💥 🌈 🌙 ⚡ 🌸 🌹 🚀 🚗 🏠 🌍'],
];
let reactTarget = null, caret = null;
function buildEmojis(i) {
  const tabs = $('#etabs'), grid = $('#egrid'); tabs.replaceChildren(); grid.replaceChildren();
  EMOJI.forEach(([icon], k) => { const t = el('button', 'lnk' + (k === i ? ' on' : ''), icon); t.type = 'button'; t.onclick = () => buildEmojis(k); tabs.append(t); });
  EMOJI[i][1].split(' ').forEach((em) => { const x = el('button', '', em); x.type = 'button'; x.onclick = () => pickEmoji(em); grid.append(x); });
}
function openEmojis() { buildEmojis(0); $('#emojis').hidden = false; }
function closeEmojis() { $('#emojis').hidden = true; reactTarget = null; }
function pickEmoji(em) {
  if (reactTarget) { socket.emit('react', { id: reactTarget, emoji: em }); closeEmojis(); return; }
  const t = $('#text'), live = document.activeElement === t || !caret;
  let s = live ? t.selectionStart : caret[0], e = live ? t.selectionEnd : caret[1];
  s = Math.min(s == null ? t.value.length : s, t.value.length); e = Math.min(e == null ? s : e, t.value.length);
  t.value = t.value.slice(0, s) + em + t.value.slice(e);
  const pos = s + em.length; caret = [pos, pos]; t.setSelectionRange(pos, pos); t.dispatchEvent(new Event('input'));
}
$('#text').addEventListener('blur', () => { caret = [$('#text').selectionStart, $('#text').selectionEnd]; });
$('#emojiBtn').onclick = () => { if (!$('#emojis').hidden && !reactTarget) closeEmojis(); else { reactTarget = null; openEmojis(); } };
function reactView(m) {
  const row = el('div', 'reacts');
  Object.keys(m.reactions).forEach((em) => {
    const who = m.reactions[em]; if (!who.length) return;
    const c = el('button', 'chip' + (who.includes(me) ? ' mine' : ''), em + (who.length > 1 ? ' ' + who.length : ''));
    c.title = who.join(', ');
    c.onclick = (e) => { e.stopPropagation(); socket.emit('react', { id: m.id, emoji: em }); };
    row.append(c);
  });
  return row;
}

// ---- Status: 24-hour photo and text posts ----
const SBG = ['#e11d2e', '#7a1018', '#1d4ed8', '#0f766e', '#7c3aed', '#c2410c', '#be185d', '#374151'];
let sdraft = { kind: 'text', bg: 0 }, sview = null, stimer = null, sleft = 5000, sstart = 0, holdT = null, held = false, saud = { mode: 'all', list: [] }, sdef = { hours: 24, limit: 0 };
const ago = (ts) => { const m = Math.floor((Date.now() - ts) / 60000); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : Math.floor(m / 60) + ' h ago'; };
const liveStatuses = () => statuses.filter((s) => s.exp > Date.now());
const sSeen = (s) => s.from === me || s.seen;
function renderStatusRow() {
  const row = $('#statusRow'); row.replaceChildren();
  const add = el('div', 'sitem'), ar = el('div', 'ring add'), aa = el('div', 'av', '＋');
  aa.style.cssText = 'width:44px;height:44px;background:var(--hover);color:var(--ink);font-size:22px';
  ar.append(aa); add.append(ar, el('span', 'n', 'Add status')); add.onclick = openStatusComposer; row.append(add);
  const by = {}; liveStatuses().forEach((s) => (by[s.from] ||= []).push(s));
  const mu = (n) => ((prefs.statusMuted || []).includes(n) && n !== me ? 1 : 0);
  const unseen = (n) => by[n].filter((s) => !sSeen(s)).length, newest = (n) => Math.max(...by[n].map((s) => s.ts));
  Object.keys(by).sort((x, y) => (x === me ? -1 : y === me ? 1 : mu(x) - mu(y) || (unseen(y) ? 1 : 0) - (unseen(x) ? 1 : 0) || newest(y) - newest(x))).forEach((n) => {
    const it = el('div', 'sitem' + (mu(n) ? ' muted' : '')), ring = el('div', 'ring' + ((unseen(n) && !mu(n)) || n === me ? '' : ' seen')), av = el('div', 'av');
    const u = users.find((x) => x.name === n) || {}; setAv(av, n, u.avatar); av.style.cssText += ';width:44px;height:44px';
    ring.append(av); it.append(ring, el('span', 'n', n === me ? 'You' : n + (mu(n) ? ' 🔕' : ''))); it.onclick = () => openStatusViewer(n); row.append(it);
  });
}
setInterval(() => { if (me) renderStatusRow(); }, 60000);

function openStatusComposer() { sdraft = { kind: 'text', bg: 0, text: '' }; drawDraft(); $('#smode').value = saud.mode; drawAud(saud.list); $('#sdur').value = String(sdef.hours); $('#slimit').value = String(sdef.limit); $('#smodal').hidden = false; }
function drawAud(checked) {
  const box = $('#slist'); box.replaceChildren(); box.hidden = $('#smode').value === 'all';
  users.filter((u) => u.name !== me).forEach((u) => {
    const l = el('label'), c = document.createElement('input'); c.type = 'checkbox'; c.value = u.name; c.checked = (checked || []).includes(u.name);
    l.append(c, document.createTextNode(' ' + u.name)); box.append(l);
  });
}
$('#smode').onchange = () => drawAud([]);
function drawDraft() {
  const box = $('#spreview'), colors = $('#scolors'); box.replaceChildren(); colors.replaceChildren();
  box.style.background = sdraft.kind === 'text' ? SBG[sdraft.bg] : '#111';
  if (sdraft.kind === 'text') {
    const ta = el('textarea'); ta.maxLength = 300; ta.placeholder = 'Type a status'; ta.value = sdraft.text || ''; ta.oninput = () => (sdraft.text = ta.value); box.append(ta);
    SBG.forEach((c, i) => { const b = el('button', i === sdraft.bg ? 'on' : ''); b.type = 'button'; b.style.background = c; b.onclick = () => { sdraft.bg = i; drawDraft(); }; colors.append(b); });
  } else {
    const wrap = el('div'), img = el('img'), cap = el('input');
    img.src = sdraft.preview; cap.type = 'text'; cap.maxLength = 200; cap.placeholder = 'Add a caption'; cap.value = sdraft.caption || ''; cap.oninput = () => (sdraft.caption = cap.value);
    wrap.append(img, cap); box.append(wrap);
  }
}
$('#sphoto').onclick = () => $('#sfile').click();
$('#stextBtn').onclick = () => { sdraft = { kind: 'text', bg: sdraft.bg || 0, text: '' }; drawDraft(); };
$('#sfile').onchange = (e) => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  if (f.type.indexOf('image/') !== 0) return alert('Choose a photo.');
  if (f.size > 10e6) return alert('Photo must be under 10 MB.');
  const r = new FileReader();
  r.onload = () => { sdraft = { kind: 'image', bg: sdraft.bg || 0, preview: r.result, file: { type: f.type, data: String(r.result).split(',')[1] }, caption: '' }; drawDraft(); };
  r.readAsDataURL(f);
};
$('#scancel').onclick = () => ($('#smodal').hidden = true);
$('#spost').onclick = () => {
  const p = sdraft.kind === 'text' ? { kind: 'text', text: sdraft.text || '', bg: sdraft.bg } : { kind: 'image', caption: sdraft.caption || '', file: sdraft.file };
  const mode = $('#smode').value, list = [...document.querySelectorAll('#slist input:checked')].map((c) => c.value);
  if (mode !== 'all' && !list.length) return alert('Pick at least one person.');
  p.aud = { mode, list }; saud = p.aud; p.hours = +$('#sdur').value; p.limit = +$('#slimit').value; sdef = { hours: p.hours, limit: p.limit };
  socket.emit('status:post', p, (r) => { if (r.error) return alert(r.error); $('#smodal').hidden = true; });
};

function openStatusViewer(name) {
  const list = liveStatuses().filter((s) => s.from === name).sort((x, y) => x.ts - y.ts);
  if (!list.length) return;
  const first = name === me ? 0 : list.findIndex((s) => !s.seen);
  sview = { name, list, i: Math.max(0, first), cache: {} }; $('#sviewer').hidden = false; showStatus();
}
function drawFoot(s) {
  const foot = $('#sfoot'); foot.replaceChildren();
  if (sview.name === me) {
    const v = s.viewers || [], a = s.aud || { mode: 'all', list: [] }, n = a.list.length, b = el('button', 'lnk', '👁 ' + v.length + (v.length === 1 ? ' view' : ' views'));
    b.style.color = '#fff'; b.onclick = () => alert(v.length ? 'Viewed by: ' + v.map((x) => x.name + (s.maxViews ? ' (' + (x.n || 1) + '/' + s.maxViews + ')' : '')).join(', ') : 'No views yet'); foot.append(b);
    foot.append(el('div', '', a.mode === 'all' ? 'Shared with everyone' : (a.mode === 'only' ? 'Shared with ' : 'Hidden from ') + n + (n === 1 ? ' person' : ' people') + (s.maxViews ? ' · ' + (s.maxViews === 1 ? 'view once' : s.maxViews + ' views each') : '') + ' · ends ' + new Date(s.exp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })));
    return;
  }
  const box = el('div'), inp = el('input'), go = el('button', 'btn', 'Send');
  box.id = 'sreplybox'; inp.type = 'text'; inp.id = 'sreply'; inp.maxLength = 500; inp.placeholder = 'Reply to ' + sview.name;
  inp.onfocus = pauseStatus; inp.onblur = resumeStatus;
  const send = () => {
    const t = inp.value.trim(); if (!t) return;
    socket.emit('message', { to: sview.name, text: t, statusReply: s.id }, (r) => r && r.error && alert(r.error));
    inp.value = ''; inp.placeholder = 'Reply sent ✓'; inp.blur();
  };
  go.onclick = send; inp.onkeydown = (e) => e.key === 'Enter' && send(); box.append(inp, go); foot.append(box);
}
function pauseStatus() {
  if (!sview || sview.paused) return;
  sview.paused = true; clearTimeout(stimer); sleft = Math.max(300, sleft - (Date.now() - sstart));
  const cur = $('#sbars').children[sview.i].firstChild; cur.style.width = getComputedStyle(cur).width; cur.style.transition = 'none';
}
function resumeStatus() {
  if (!sview || !sview.paused) return;
  sview.paused = false; const cur = $('#sbars').children[sview.i].firstChild;
  cur.style.transition = 'width ' + sleft + 'ms linear'; cur.style.width = '100%'; sstart = Date.now();
  stimer = setTimeout(() => { sview.i++; showStatus(); }, sleft);
}
function paintStatus(s, c) {
  const body = $('#sbody'); body.replaceChildren();
  if (c.locked) { body.style.background = '#111'; body.append(el('div', 't', '🔒'), el('div', 'cap', c.locked)); return; }
  const kind = c.kind || s.kind;
  body.style.background = kind === 'text' ? SBG[c.bg != null ? c.bg : s.bg] : '#000';
  if (kind === 'text') body.append(el('div', 't', c.text));
  else { const img = el('img'); img.src = c.url || (s.file && s.file.url); body.append(img); if (c.caption) body.append(el('div', 'cap', c.caption)); }
  if (c.left != null) body.append(el('div', 'cap', c.left > 0 ? '👁 ' + c.left + (c.left === 1 ? ' view' : ' views') + ' left after this' : '👁 That was your last view'));
}
function startBar() {
  const cur = $('#sbars').children[sview.i].firstChild; cur.style.transition = 'none'; cur.style.width = '0'; void cur.offsetWidth; cur.style.transition = 'width 5s linear'; cur.style.width = '100%';
  sleft = 5000; sstart = Date.now(); sview.paused = false; stimer = setTimeout(() => { sview.i++; showStatus(); }, 5000);
}
function showStatus() {
  clearTimeout(stimer);
  const { name, list, i } = sview, s = list[i];
  if (!s) return closeStatusViewer();
  const bars = $('#sbars'); bars.replaceChildren();
  list.forEach((_, k) => { const sp = el('span'), fill = el('i'); fill.style.width = k < i ? '100%' : '0'; sp.append(fill); bars.append(sp); });
  setAv($('#sav'), name, (users.find((x) => x.name === name) || {}).avatar);
  $('#sinfo').textContent = (name === me ? 'My status' : name) + ' · ' + ago(s.ts);
  $('#sdel').hidden = name !== me; $('#smute').hidden = name === me; $('#smute').textContent = (prefs.statusMuted || []).includes(name) ? '🔕' : '🔔';
  drawFoot(s);
  const show = (c) => { if (!sview || !sview.list[sview.i] || sview.list[sview.i].id !== s.id) return; paintStatus(s, c); startBar(); };
  if (!(s.limited && name !== me)) { show(s); if (name !== me) socket.emit('status:view', { id: s.id }); return; }
  if (sview.cache[s.id]) return show(sview.cache[s.id]); // opening it again in this viewing does not cost another view
  paintStatus(s, { locked: 'Opening…' });
  socket.emit('status:open', { id: s.id }, (r) => { if (r.error) return show({ locked: r.error }); sview.cache[s.id] = r; show(r); });
}
function closeStatusViewer() { clearTimeout(stimer); sview = null; $('#sviewer').hidden = true; renderStatusRow(); }
$('#sclose').onclick = closeStatusViewer;
$('#stapR').onclick = () => { if (held) { held = false; return; } if (sview) { sview.i++; showStatus(); } };
$('#stapL').onclick = () => { if (held) { held = false; return; } if (sview) { sview.i = Math.max(0, sview.i - 1); showStatus(); } };
['#stapL', '#stapR'].forEach((sel) => { // press and hold to pause
  const t = $(sel), end = () => { clearTimeout(holdT); if (held) resumeStatus(); };
  t.onpointerdown = () => { held = false; holdT = setTimeout(() => { held = true; pauseStatus(); }, 220); };
  t.onpointerup = end; t.onpointerleave = end; t.onpointercancel = end;
});
$('#smute').onclick = () => {
  if (!sview || sview.name === me) return;
  socket.emit('status:mute', { name: sview.name, muted: !(prefs.statusMuted || []).includes(sview.name) });
};
$('#sdel').onclick = () => { if (sview && confirm('Delete this status?')) socket.emit('status:delete', { id: sview.list[sview.i].id }); };
socket.on('statuses', (l) => { statuses = l; renderStatusRow(); if (sview && !liveStatuses().some((s) => s.from === sview.name)) closeStatusViewer(); });
socket.on('status:new', (s) => { statuses.push(s); renderStatusRow(); });
socket.on('status:update', (s) => {
  const i = statuses.findIndex((x) => x.id === s.id); if (i >= 0) statuses[i] = s; else statuses.push(s);
  if (sview) { const k = sview.list.findIndex((x) => x.id === s.id); if (k >= 0) { sview.list[k] = s; if (k === sview.i) drawFoot(s); } }
  if (!sview) renderStatusRow();
});
socket.on('status:gone', ({ ids }) => {
  statuses = statuses.filter((s) => !ids.includes(s.id));
  if (sview) { sview.list = sview.list.filter((s) => !ids.includes(s.id)); if (sview.i >= sview.list.length) closeStatusViewer(); else showStatus(); }
  else renderStatusRow();
});

// ---- Share / export a chat as a text file ----
const NL = String.fromCharCode(10);
function chatText(k, title) {
  const when = (ts) => new Date(ts).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  const lines = ['Chat with ' + title, 'Exported by ' + me + ' on ' + when(Date.now()), 'Photos, voice notes and view-once media are not included.', ''];
  (chats[k] || []).forEach((m) => {
    if (m.system) return lines.push('[' + when(m.ts) + '] *** ' + m.text);
    let body;
    if (m.deleted) body = '(this message was deleted)';
    else if (m.poll) body = '[Poll] ' + m.poll.q + ' | ' + m.poll.options.map((o) => o.t + ' (' + o.votes.length + ')').join(', ');
    else if (m.file) body = (m.file.once ? '[View once media]' : m.file.type.indexOf('image/') === 0 ? '[Photo: ' + m.file.name + ']' : m.file.type.indexOf('audio/') === 0 ? '[Voice note' + (m.file.dur ? ' ' + fmt(m.file.dur) : '') + ']' : '[File: ' + m.file.name + ']') + (m.text ? ' ' + m.text : '');
    else body = m.text;
    const re = m.reactions ? ' {' + Object.keys(m.reactions).map((e) => e + m.reactions[e].length).join(' ') + '}' : '';
    lines.push('[' + when(m.ts) + '] ' + m.from + ': ' + (m.sref ? '(re: status) ' : '') + body + (m.edited ? ' (edited)' : '') + re);
  });
  return lines.join(NL) + NL;
}
async function shareChat() {
  if (!active) return;
  const k = keyOf(active), title = active.t === 'g' ? (groups[active.id] || {}).name || 'group' : active.id;
  if (!(chats[k] || []).length) return alert('There are no messages to share yet.');
  if (!confirm('Share a text copy of this chat? It contains the messages you can see in it. Photos, voice notes and view-once media are not included.')) return;
  const name = 'chat-' + String(title).replace(/[^A-Za-z0-9_-]/g, '_') + '.txt', file = new File([chatText(k, title)], name, { type: 'text/plain' });
  try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Chat with ' + title }); return; } }
  catch (e) { if (e && e.name === 'AbortError') return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
$('#shareBtn').onclick = () => { $('#cmodal').hidden = true; shareChat(); };

// ---- Forward a message to other chats ----
let fwdMsg = null;
function openForward(m) {
  fwdMsg = m; const box = $('#flist'); box.replaceChildren(); $('#fpreview').textContent = brief(m).slice(0, 80);
  const add = (label, val) => { const l = el('label'), c = document.createElement('input'); c.type = 'checkbox'; c.value = val; l.append(c, document.createTextNode(' ' + label)); box.append(l); };
  Object.values(groups).forEach((g) => add((g.world ? '' : '👥 ') + g.name, 'g:' + g.id));
  users.filter((u) => u.name !== me && !blocks.includes(u.name)).forEach((u) => add(u.name, 'u:' + u.name));
  $('#fmodal').hidden = false;
}
$('#fcancel').onclick = () => ($('#fmodal').hidden = true);
$('#fsend').onclick = () => {
  const picks = [...document.querySelectorAll('#flist input:checked')].map((c) => c.value);
  if (!picks.length) return alert('Pick where to send it.');
  if (picks.length > 5) return alert('You can forward to up to 5 chats at a time.');
  socket.emit('forward', { id: fwdMsg.id, targets: picks.map((v) => (v[0] === 'g' ? { group: v.slice(2) } : { to: v.slice(2) })) }, (r) => {
    if (r.error) return alert(r.error);
    $('#fmodal').hidden = true;
    if (r.sent < r.total) alert('Sent to ' + r.sent + ' of ' + r.total + ' chats. The others did not allow it (blocked, admin-only, too fast or not found).');
  });
};

// ---- World community pages ----
const commById = (id) => (comms.mine || []).find((c) => c.id === id);
const errAlert = (r) => { if (r && r.error) alert(r.error); };
let browseDraft = '';
function personName(name, c) { // a name, with the gray auto label in front of the auto admin
  const s = el('span', '');
  if (c.owner === name) s.append(el('span', 'autotag', 'auto'), ' ');
  s.append(name + (name === me ? ' (you)' : ''));
  return s;
}
function renderBrowse(skipBody) {
  $('#peerName').textContent = '🌐 Communities'; $('#peerStatus').textContent = 'Create your own or join one';
  if (skipBody) return;
  const box = $('#msgs'), prev = box.scrollTop; box.replaceChildren();
  box.append(el('div', 'csec', 'Create a world community'));
  box.append(el('div', 'mute cnote', 'You become its auto admin, shown with a gray auto label by your name. You can add other admins, and anyone can join. You can make up to 3.'));
  const inp = el('input', 'cq'); inp.type = 'text'; inp.placeholder = 'Community name'; inp.maxLength = 30; inp.value = browseDraft;
  inp.oninput = () => { browseDraft = inp.value; };
  const go = el('button', 'btn cgo', '＋ Create community');
  go.onclick = () => {
    const v = inp.value.trim(); if (!v) return;
    socket.emit('community:create', { name: v }, (r) => { if (r && r.error) return alert(r.error); browseDraft = ''; if (r && r.id) openChat('c', r.id); });
  };
  box.append(inp, go);
  box.append(el('div', 'csec', 'Communities you can join'));
  if (!(comms.more || []).length) box.append(el('div', 'empty', 'No other communities yet.'));
  (comms.more || []).forEach((c) => {
    const row = el('div', 'ccard'), t = el('div', 'meta');
    t.append(el('div', 'ctt', c.name), el('div', 'sub', c.count + (c.count === 1 ? ' member' : ' members') + ' · made by ' + c.owner));
    const b = el('button', 'btn alt', 'Join');
    b.onclick = () => socket.emit('community:join', { id: c.id }, (r) => { if (r && r.error) return alert(r.error); openChat('c', c.id); });
    row.append(el('div', 'cico', '🌍'), t, b); box.append(row);
  });
  box.scrollTop = prev;
}
function renderCommunity(skipBody) {
  $('#peerAv').hidden = true; $('#composer').hidden = true; $('#locked').hidden = true; $('.hbtns').hidden = true; clearBar();
  if (active.id === '_browse') return renderBrowse(skipBody);
  const c = commById(active.id);
  if (!c) { active = null; document.body.classList.remove('chatting'); renderList(); renderChat(); return; }
  const n = c.groups.length;
  $('#peerName').textContent = '🌍 ' + c.name;
  $('#peerStatus').textContent = c.count + (c.count === 1 ? ' member' : ' members') + ' · ' + n + (n === 1 ? ' group' : ' groups') + (c.auto ? ' · you are the auto admin' : c.admin ? ' · you are an admin' : '');
  if (skipBody) return;
  const box = $('#msgs'), prev = box.scrollTop; box.replaceChildren();
  const card = (icon, title, sub, fn, badge) => {
    const x = el('div', 'ccard'), t = el('div', 'meta');
    t.append(el('div', 'ctt', title), el('div', 'sub', sub));
    x.append(el('div', 'cico', icon), t);
    if (badge) x.append(el('span', 'badge', badge));
    if (fn) x.onclick = fn;
    return x;
  };
  const err = errAlert;
  const canRemove = (u) => u !== me && u !== c.owner && (c.auto || !c.admins.includes(u)); // admins cannot remove the auto admin or other admins
  const sg = groups[c.stage] || {}, sp = sg.speakers || {}, spk = Object.keys(sp);
  box.append(card('🎤', 'Main Stage', (spk.length ? spk.length + (spk.length === 1 ? ' speaker' : ' speakers') : 'No speakers yet') + ' · everyone can read', () => openChat('g', c.stage, c.id), unread('g:' + c.stage)));
  box.append(card('💬', 'Open lounge', 'Everyone can chat here', () => openChat('g', c.lounge, c.id), muted('g:' + c.lounge) ? 0 : unread('g:' + c.lounge)));

  box.append(el('div', 'csec', 'Groups in the community'));
  if (!n) box.append(el('div', 'empty', 'No groups have joined yet. A group admin can add their group below.'));
  c.groups.forEach((g) => {
    const x = card('', g.name, g.count + (g.count === 1 ? ' member' : ' members') + (g.mine ? ' · you are in it' : '') + (g.speakers.length ? ' · speakers: ' + g.speakers.join(', ') : ''), g.mine ? () => openChat('g', g.id, c.id) : null);
    const av = el('div', 'av g'); setAv(av, g.name, g.avatar); x.replaceChild(av, x.firstChild);
    if (g.manage) {
      const rm = el('button', 'lnk', 'Remove');
      rm.onclick = (e) => { e.stopPropagation(); if (confirm('Remove ' + g.name + ' from ' + c.name + '?')) socket.emit('community:group:remove', { cid: c.id, id: g.id }, err); };
      x.append(rm);
    }
    box.append(x);
  });
  const addable = Object.values(groups).filter((g) => !g.world && isAdmin(g) && !c.groups.some((x) => x.id === g.id));
  if (addable.length) {
    box.append(el('div', 'csec', 'Your groups'));
    addable.forEach((g) => {
      const x = card('👥', g.name, 'Not in the community yet', null), add = el('button', 'btn alt', '＋ Add');
      add.onclick = () => socket.emit('community:group:add', { cid: c.id, id: g.id }, err);
      x.append(add); box.append(x);
    });
  }

  box.append(el('div', 'csec', 'Admins'));
  box.append(el('div', 'mute cnote', 'Admins can remove people from the community and its groups, remove groups, choose Main Stage speakers and delete messages here. Only the auto admin can add or remove admins, rename or delete the community.'));
  [c.owner, ...c.admins].filter(Boolean).forEach((a) => {
    const row = el('div', 'crow'); row.append(personName(a, c));
    if (c.auto && a !== c.owner) {
      const rm = el('button', 'lnk', 'Remove admin');
      rm.onclick = () => confirm('Remove ' + a + ' as an admin of ' + c.name + '?') && socket.emit('community:admin', { cid: c.id, name: a, on: false }, err);
      row.append(rm);
    }
    box.append(row);
  });
  if (c.auto) {
    const pick = el('div'), rows = [];
    pick.hidden = true;
    const q = el('input', 'cq'); q.type = 'text'; q.placeholder = 'Search people'; pick.append(q);
    (c.members || []).filter((u) => u !== c.owner && !c.admins.includes(u)).forEach((u) => {
      const row = el('div', 'crow'); row.append(el('span', '', u));
      const b = el('button', 'btn alt', 'Make admin');
      b.onclick = () => confirm('Make ' + u + ' an admin of ' + c.name + '?') && socket.emit('community:admin', { cid: c.id, name: u, on: true }, err);
      row.append(b); rows.push([u, row]); pick.append(row);
    });
    if (!rows.length) pick.append(el('div', 'empty', 'Everyone here is already an admin.'));
    q.oninput = () => rows.forEach(([u, row]) => { row.hidden = u.toLowerCase().indexOf(q.value.trim().toLowerCase()) < 0; });
    const add = el('button', 'btn alt cbtn', '＋ Add admin');
    add.onclick = () => { pick.hidden = !pick.hidden; if (!pick.hidden) q.focus(); };
    box.append(add, pick);
  }

  if (c.admin) {
    box.append(el('div', 'csec', 'Main Stage speakers'));
    box.append(el('div', 'mute cnote', 'Choose who may speak on the Main Stage. A speaker speaks for one group, and that group is shown next to their name. You can also remove a person from a group here.'));
    c.groups.forEach((g) => {
      box.append(el('div', 'cgrp', g.name));
      (g.members || []).forEach((u) => {
        const row = el('div', 'crow'), isSp = sp[u] === g.id;
        const nm = personName(u, c); if (sp[u] && !isSp) nm.append(' (speaks for another group)');
        row.append(nm);
        const btns = el('span', 'cbtns');
        const b = el('button', isSp ? 'btn' : 'btn alt', isSp ? '🎤 Speaker' : 'Make speaker');
        b.onclick = () => socket.emit('community:speaker', { cid: c.id, name: u, group: g.id, on: !isSp }, err);
        btns.append(b);
        if (canRemove(u)) {
          const rm = el('button', 'lnk', 'Remove');
          rm.onclick = () => confirm('Remove ' + u + ' from the group ' + g.name + '?') && socket.emit('community:group:kick', { cid: c.id, group: g.id, name: u }, err);
          btns.append(rm);
        }
        row.append(btns); box.append(row);
      });
    });

    box.append(el('div', 'csec', 'People in ' + c.name + ' (' + (c.members || []).length + ')'));
    const pq = el('input', 'cq'); pq.type = 'text'; pq.placeholder = 'Search people'; box.append(pq);
    const prow = [];
    (c.members || []).forEach((u) => {
      const row = el('div', 'crow'); row.append(personName(u, c));
      if (canRemove(u)) {
        const rm = el('button', 'lnk', 'Remove');
        rm.onclick = () => confirm('Remove ' + u + ' from ' + c.name + '? They lose the Main Stage and the lounge until you bring them back.') && socket.emit('community:kick', { cid: c.id, name: u }, err);
        row.append(rm);
      }
      prow.push([u, row]); box.append(row);
    });
    pq.oninput = () => prow.forEach(([u, row]) => { row.hidden = u.toLowerCase().indexOf(pq.value.trim().toLowerCase()) < 0; });
    if ((c.banned || []).length) {
      box.append(el('div', 'csec', 'Removed people'));
      c.banned.forEach((u) => {
        const row = el('div', 'crow'); row.append(el('span', '', u));
        const b = el('button', 'btn alt', c.builtin ? 'Bring back' : 'Allow to join');
        b.onclick = () => socket.emit('community:unban', { cid: c.id, name: u }, err);
        row.append(b); box.append(row);
      });
    }
  }

  if (c.auto && !c.builtin) {
    box.append(el('div', 'csec', 'Auto admin'));
    const rn = el('button', 'btn alt cbtn', '✏️ Rename community');
    rn.onclick = () => { const v = prompt('New name for the community:', c.name); if (v && v.trim()) socket.emit('community:rename', { cid: c.id, name: v.trim() }, err); };
    const del = el('button', 'btn alt cbtn', '🗑 Delete community');
    del.onclick = () => confirm('Delete ' + c.name + '? Its Main Stage and lounge messages are erased for everyone. The groups in it are not deleted.') && socket.emit('community:delete', { cid: c.id }, err);
    box.append(rn, del);
  }
  if (!c.builtin && !c.auto) {
    const lv = el('button', 'btn alt cbtn', 'Leave community');
    lv.onclick = () => confirm('Leave ' + c.name + '?') && socket.emit('community:leave', { id: c.id }, err);
    box.append(lv);
  }
  box.scrollTop = prev;
}
socket.on('communities', (c) => {
  comms = c; renderList();
  const typingNow = document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('cq'); // do not wipe a search box while someone types in it
  if (active && active.t === 'c') { if (!typingNow) renderChat(); }
  else if (active && active.t === 'g' && groups[active.id] && groups[active.id].comm) renderChat(true);
});

// ---- Chat lock ----
let lockState = null;
function askLock(mode, title, done) {
  const setup = mode === 'setup', changing = setup && !!settings.lockSet;
  lockState = { mode, done, changing };
  $('#ltitle').textContent = title;
  $('#lhint').textContent = setup ? 'This password is only for locked chats. It must be different from your login password.' : mode === 'unlock' ? 'Enter your chat lock password to open this chat.' : 'Enter your chat lock password to continue.';
  $('#lold').hidden = !changing; $('#lpass2').hidden = !setup;
  $('#lpass').placeholder = setup ? 'New lock password (4+ characters)' : 'Lock password';
  $('#lold').value = $('#lpass').value = $('#lpass2').value = ''; $('#lerr').textContent = '';
  $('#lmodal').hidden = false; (changing ? $('#lold') : $('#lpass')).focus();
}
function lockSubmit() {
  const s = lockState; if (!s) return;
  const p = $('#lpass').value, fail = (t) => { $('#lerr').textContent = t; };
  const finish = (pw) => { $('#lmodal').hidden = true; lockState = null; s.done(pw); };
  if (!p) return fail('Enter the password.');
  if (s.mode === 'verify') return finish(p);
  if (s.mode === 'unlock') return socket.emit('lock:verify', { pass: p }, (r) => (r.error ? fail(r.error) : finish(p)));
  const old = $('#lold').value;
  if (s.changing && !old) return fail('Enter your current lock password (or your login password if you forgot it).');
  if (p.length < 4) return fail('Use at least 4 characters.');
  if (p !== $('#lpass2').value) return fail('The two passwords do not match.');
  socket.emit('lock:setup', { pass: p, old, acct: old }, (r) => (r.error ? fail(r.error) : finish(p)));
}
$('#lok').onclick = lockSubmit;
['#lold', '#lpass', '#lpass2'].forEach((q) => $(q).addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); lockSubmit(); } }));
$('#lcancel').onclick = () => { $('#lmodal').hidden = true; lockState = null; };
$('#lockPwBtn').onclick = () => askLock('setup', settings.lockSet ? 'Change lock password' : 'Create lock password', () => alert('Chat lock password saved.'));
$('#lockBtn').onclick = () => {
  if (!active) return;
  $('#cmodal').hidden = true;
  const k = keyOf(active);
  if (lockedKey(k)) return askLock('verify', 'Remove chat lock', (pw) => socket.emit('lock:chat', { key: k, on: false, pass: pw }, (r) => { if (r.error) alert(r.error); }));
  const doLock = () => socket.emit('lock:chat', { key: k, on: true }, (r) => { if (r.error) return alert(r.error); unlocked.add(k); });
  if (!settings.lockSet) return askLock('setup', 'Create your chat lock password', doLock);
  doLock();
};
// locked chats close again after the app has been in the background for 30 seconds
let relockT = null;
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) { clearTimeout(relockT); return; }
  relockT = setTimeout(() => {
    unlocked.clear();
    if (active && active.t !== 'c' && lockedNow(keyOf(active))) { active = null; backTo = null; document.body.classList.remove('chatting'); }
    renderList(); renderChat();
  }, 30000);
});
</script>
</body>
</html>
`;

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Server } = require('socket.io');

// ---- Storage: db.json (data) + uploads/ (files). Swap for a real DB later. ----
const DB_FILE = path.join(__dirname, 'db.json'), UP = path.join(__dirname, 'uploads');
fs.mkdirSync(UP, { recursive: true });
let db = { users: {}, tokens: {}, groups: {}, messages: [], reads: {}, prefs: {}, dmTimers: {}, blocks: {}, cleared: {}, hidden: {}, statuses: [], community: { admins: [], groups: [] }, communities: {}, nextId: 1 };
try { db = { ...db, ...JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) }; } catch (e) {}
let timer;
const save = () => {
  clearTimeout(timer);
  timer = setTimeout(() => fs.writeFile(DB_FILE + '.tmp', JSON.stringify(db), { mode: 0o600 }, (e) => !e && fs.rename(DB_FILE + '.tmp', DB_FILE, () => {})), 300);
};

// ---- Security settings (all optional, set as environment variables) ----
// TRUST_PROXY=1     you run behind a reverse proxy (nginx, Caddy, Cloudflare...): use its X-Forwarded-* headers
// FORCE_HTTPS=1     redirect plain http to https (needs TRUST_PROXY=1 and a proxy that sets X-Forwarded-Proto)
// ALLOWED_ORIGINS   extra browser origins allowed to connect, comma separated (default: same site only)
const TRUST = process.env.TRUST_PROXY === '1', FORCE_HTTPS = process.env.FORCE_HTTPS === '1';
const EXTRA_ORIGINS = String(process.env.ALLOWED_ORIGINS || '').split(',').map((x) => x.trim()).filter(Boolean);
const MIN = 60e3;
const ipOf = (req) => (TRUST && String(req.headers['x-forwarded-for'] || '').split(',').pop().trim()) || req.socket.remoteAddress || 'unknown';

// Check that an upload really is what the client says it is (first bytes of the file).
const ascii = (b, from, to) => b.toString('latin1', from, to);
const SIG = {
  'image/png': (b) => b.length > 8 && b[0] === 0x89 && ascii(b, 1, 4) === 'PNG' && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  'image/jpeg': (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/gif': (b) => b.length > 6 && /^GIF8[79]a$/.test(ascii(b, 0, 6)),
  'image/webp': (b) => b.length > 12 && ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WEBP',
  'audio/webm': (b) => b.length > 4 && b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3,
  'audio/ogg': (b) => b.length > 4 && ascii(b, 0, 4) === 'OggS',
  'audio/mp4': (b) => b.length > 12 && ascii(b, 4, 8) === 'ftyp',
  'audio/x-m4a': (b) => b.length > 12 && ascii(b, 4, 8) === 'ftyp',
  'audio/mpeg': (b) => b.length > 3 && (ascii(b, 0, 3) === 'ID3' || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0)),
  'audio/wav': (b) => b.length > 12 && ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WAVE',
};
const sniffOk = (type, buf) => !SIG[type] || SIG[type](buf);
const BAD_FILE = 'That file is damaged or is not a real photo / voice note.';

const IMG = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp' };
const AUD = { 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/mpeg': 'mp3', 'audio/wav': 'wav' };
const MEDIA = { ...IMG, ...AUD };
// World chat: the built-in community's lounge. Everyone is in it (members are kept in sync by syncComm below).
db.groups.world ||= { id: 'world', name: '', members: [], owner: '', world: true, history: true, joined: {}, admins: [] };
db.groups.world.name = '🌍 myChat world chat'; db.groups.world.comm = 'world';
// Main Stage: everyone can read, only admitted speakers and admins can post
db.groups.stage ||= { id: 'stage', name: '🎤 Main Stage', members: [], owner: '', world: true, stage: true, announce: true, history: true, joined: {}, admins: [], speakers: {} };
db.groups.stage.comm = 'world';
const lastWorld = {}; // slow-mode: one message per 1.5 seconds per person
// View-once media: the real file name never leaves the server. Recipients get a short-lived token instead.
const onceTokens = new Map(); // token -> { file, exp }
const onceNames = new Set([...db.messages.filter((m) => m.once && m.file && m.file.url).map((m) => path.basename(m.file.url)), ...db.statuses.filter((s) => s.maxViews && s.file).map((s) => path.basename(s.file.url))]);
const MANIFEST = JSON.stringify({ name: 'Chat', short_name: 'Chat', start_url: '/', display: 'standalone', background_color: '#000000', theme_color: '#000000', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] });
const SW = "self.addEventListener('install', () => self.skipWaiting()); self.addEventListener('fetch', () => {});";
const ICON192 = 'iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAIAAADdvvtQAAACgUlEQVR42u3dwU0EMRBE0T5PDqRA/umQCRIRgEGLq/p9OQLXO4xGq9l5pF80rkAACSABJIAkgASQABJAEkACSAAJIAkgASSABJAEkAASQAJIAEkACSABJIAkgASQABJAEkACSAAJIAkgASSABJAA0lcfb+/fP64LoJ+J4Qmgv3dD0nBDEkB30VnFaNDBCKB76dQzGnQwAiiDTiWjoYchgPL01BgaehjaCyiaTgejoYehjYDK9OQaGnoY2gWoWE+ioaGHIYAAAoieTENDD0P9gBbqSTEEEEDtgNbqiTA09DAEEEAA0ZNpCCCASgFBE2EIIIAaAeGSYggggAACCCB6Qg0BBBBAAAFET6ghgAACCCCAAAKIno2GAAIIIIAAAggggAACCCCAAALIAQgggAACCCCAAHIAAggggAACCCCAHIAAAggggAACqA0QQ34TDRBAAAEEEEAAOQAx5OMKAAEEEECbADHkE3cAAcQQPQABtBcQQ/frAQigakAMXa4HIIDaATF0+ToAAdQO6PG33wAxVKkHIIDWANpmKGWUJEB7DAUtEgZog6GsOfIAdRuK2yISUKuhxCFSAfUZCl0hGFCTodwJsgF1GIq+/3hA6YbSL78BUK6hgpsHCB2A0gA9RQGEjodoegDqBvT0BhA6XiRyA1AHoGdfAHGzGBArAF0KiAyA0AHohXpQAAgdgF4LyPx7AXED0D8AsjdAJ4DMDNChHgMDdAjItACdALIoQId6bAnQCSATAnQIyHgAHeoxG0ACSAJIAAkgASSAJIAEkAASQBJAAkgACSAJIAEkgASQBJAAEkACSABJAAkgASSAJIAEkAASQBJAAkgACSAJIAGkO/oEBy+UKyTjSXgAAAAASUVORK5CYII=', ICON512 = 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAJV0lEQVR42u3VQQ3AIBQFQc54qAX828EJJpqQsDN5Cmj6d0wAkoYnABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAABAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAAABAEAAAAQAAAEAQAAAEAAABAAAAQBAAAAQAAAEAO7a3/prHhMBgMcPvTAgAODcSwICAI6+GCAA4OiLAQIAjr4YIADg7isBAgDuvhIgAODuKwECAE6/DCAAuPumBAgATr/JAAKA028ygADg9JsMIAA4/SYDCABOv8kAAoDTbzKAAOD0mwwgALj+pgEIAE6/DIAA4PTLAAgArr8GgADg9MsACACuvwYgAOD0ywACAK6/BiAAuP6mAQgATr/JAAKA628agADg+psGIAC4/qYBCABOv8kAAoDrbxqAAOD6mwYgALj+pgEIAK6/aQACgOtvGoAA4PqbBiAAuP6mAQgArr9pAAKA628agADg+psGIAC4/qYBCACuv2kAAuD6m2kAAuD6m2kAAuD6m2kAAuD6m2mAACAAZgIgALj+ZhogALj+ZhogALj+ZhogALj+ZhogAAiACQACgOtvGoAA4PqbBiAACIAJAAKA628agADg+psGIAAIgAkAAoDrbxqAAOD6mwYgAAiACQAC4PqbaQAC4PqbaQACIABmAoAAuP5mGoAACICZACAArr+ZBiAAAmAmAAiA62+mAQKA62+mAQKAAJgJgADg+ptpgAAgAGYCIAC4/mYaIAAIgJkACAACYCYAAoDrb6YBAoAAmAmAAOD6m2mAACAAJgAIAK6/aQACgACYACAAAmAmAAiA62+mAQiAAJgJAALg+ptpAAIgAGYCgAAIgJkAIACuv5kGIAACYCYACIAAmAkAAuD6m2mAAHgCATATAAFAAMwEQABw/c00QAAQADMBEAAEwEwABAABMBMAAcD1N9MAAUAAzARAABAAMwEQAATATAAEANffTAMEQAD89mYCIAACYCYACIAAmAkAAiAAZgKAALj+ZhqAAAiAmQAgAAJgJgAIgACYCQACIABmAoAACICZACAAAmAmAAiA62+mAQiAAJgJgAAgAGYCIAAIgJkACAACYCYAAoAAmAmAACAAZgIgAAiAmQAIAAJgJgACgACYCYAAIABmAiAAuP5mGiAAAmBmAiAAAmBmAiAAAmBmToQACICZACAAAmAmAAiAAJgJAAIgAGYCgAAIgJkAIAACYCYACIAAmAkAAiAAZgKAAGiAmeuPAAiAmQAIAAJgJgACgACYCYAAIABmAiAACICZAAgAAmAmAAKAAJgJgAAgAGYCIAAIgJkACAACYCYAAoAGmLn+AoAAmAmAAAiAmQmAAAiAmQAgAAJgJgAIgACYCQACIABmAoAAaICZ648ACICZACAAAmAmAAiAAJgJAAIgAGYCgABogJnrjwAIgJkAIAACYCYAAoAAmAmAAKABZq6/ACAAZgIgAAiAmQAIAAJgJgACgAaYuf4CgACYCYAAIABmAiAAaICZ6y8ACICZAAgAAmDmxxcANMBcfwRAAMwEAAEQADMBQAA0wMz1RwAEwEwAEAANMHP9EQABMBMABEAAzAQAAdAAM9cfARAAMwFAADTAzPVHAATATAAEAAEwEwABQAPMXH8BQADMBEAA0AAz118AEAAzARAANMDM9RcABMBMAAQADTBz/QUAATDzCwsAGmCuPwKABpjrjwAgACYACAAaYK4/AoAAmAAgAGiAuf4IABpgrj8CIABmAoAAaICZ648ACICZACAAGmDm+iMAGmDm+iMAGmDm+iMAAmAmAAiABpi5/gKABpi5/gKAAJgJgACgAWauvwCgAWauvwCgAeb6IwBogLn+CAACYAKAAKAB5vojAGiAuf4IABpgrj8CgAaY648AoAHm+iMAaIC5/ggAGmCuPwKABpjrjwCgAeb6IwBogLn+CAAaYK4/AoAGmOuPAKAB5vojAGiAuf4IABpgrj8CgAaY6y8AyIA5/QgAGmCuPwKABpjrjwCgAeb6IwDIgDn9CACuv7n+CAACYK4/AoAAmNOPAOD6m+uPACAA5vQjAAiAuf4IAK6/Of0IAAJgTj8CgACY648A4Pqb048AIADm9CMACIDTDwKA6+/0gwAgAE4/CAAC4PSDAOD6O/0gAAiAuw8CgAA4/SAArr+5+wgAAmDuPgKAAJi7jwDg+pujjwAgAOboIwAIgDn6CACuv3MPAoAAuPUgAAiAUw4CgOvv7oMAIABOPwgAAuDugwDg+jv9IAAIgNMPAoAAuPsgALj+Tj8IAALg7oMAEA2AjwgCQO76+4IgALQC4MOBAJALgE8GAkDr+vtYIADkAuAzgQCQC4APBAJA6/r7NCAA5ALgo4AA0AqAbwECQO76+xAgAOQC4BOAANAKgJcHASB3/T07CACtAHhtEAByAfDOIADkrr9HBgGgFQBvCwJALgBeFQSA1vX3niAA5ALgJUEAyAXAG4IA0Lr+Xg8EgFwAvBsIAK0AeC4QAHLX31uBAJALgFcCBKAVAI8DCEDu+nsZQABaAfAggADkAuApAAHIXX/vAAgAAAIAgAAAIAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACACAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACACAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgCAAAAgAAAIAAACAIAAACAAAAgAAAIAgAAAIAAACAAAAgAgAAAIAAACAIAAAPCSA/ej6IIXLeDxAAAAAElFTkSuQmCC';

const SEC_HEADERS = { 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer', 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Resource-Policy': 'same-origin', 'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=(), payment=()' };
const csp = (nonce, host) => ["default-src 'none'", "script-src 'self' 'nonce-" + nonce + "'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:", "media-src 'self' blob: data:", "font-src 'self' data:",
  "connect-src 'self'" + (host ? ' ws://' + host + ' wss://' + host : ''), "manifest-src 'self'", "worker-src 'self'", "base-uri 'none'", "form-action 'none'", "frame-ancestors 'none'", "object-src 'none'"].join('; ');
const server = http.createServer((req, res) => {
  const hostOk = /^[a-z0-9.\-:\[\]]{1,255}$/i.test(req.headers.host || '') ? req.headers.host : '';
  const https = !!req.socket.encrypted || (TRUST && req.headers['x-forwarded-proto'] === 'https');
  if (FORCE_HTTPS && !https && hostOk) { res.writeHead(308, { Location: 'https://' + hostOk + req.url }); return res.end(); }
  for (const k in SEC_HEADERS) res.setHeader(k, SEC_HEADERS[k]);
  if (https) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }
  const p = req.url.split('?')[0], om = /^\/once\/([a-f0-9]{32})$/.exec(p), tk = om && onceTokens.get(om[1]);
  const m = tk && tk.exp > Date.now() ? ['', tk.file] : /^\/uploads\/([a-f0-9]{32}\.[a-z0-9]{2,4})$/.exec(p);
  if (m && !tk && onceNames.has(m[1])) { res.writeHead(404); return res.end(); }
  if (m) {
    const type = Object.keys(MEDIA).find((k) => MEDIA[k] === path.extname(m[1]).slice(1));
    return fs.readFile(path.join(UP, m[1]), (e, buf) => {
      if (e) { res.writeHead(404); return res.end(); }
      const h = { 'Content-Type': type || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes', ...(tk ? { 'Cache-Control': 'no-store' } : {}), ...(type ? {} : { 'Content-Disposition': 'attachment' }) };
      const r = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (r && (r[1] || r[2])) { // byte ranges: needed so audio plays and seeks on Safari/iOS
        const s = r[1] ? +r[1] : buf.length - +r[2], en = Math.min(r[1] && r[2] ? +r[2] : buf.length - 1, buf.length - 1);
        if (s > en || s < 0) { res.writeHead(416, { 'Content-Range': 'bytes */' + buf.length }); return res.end(); }
        res.writeHead(206, { ...h, 'Content-Range': 'bytes ' + s + '-' + en + '/' + buf.length, 'Content-Length': en - s + 1 });
        return res.end(buf.subarray(s, en + 1));
      }
      res.writeHead(200, h); res.end(buf);
    });
  }
  const url = req.url.split('?')[0];
  if (url === '/manifest.json') { res.writeHead(200, { 'Content-Type': 'application/manifest+json' }); return res.end(MANIFEST); }
  if (url === '/sw.js') { res.writeHead(200, { 'Content-Type': 'text/javascript' }); return res.end(SW); }
  if (url === '/icon-192.png' || url === '/icon-512.png') { res.writeHead(200, { 'Content-Type': 'image/png' }); return res.end(Buffer.from(url.includes('192') ? ICON192 : ICON512, 'base64')); }
  if (url !== '/' && url !== '/index.html') { res.writeHead(404); return res.end(); }
  const nonce = crypto.randomBytes(16).toString('base64');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': csp(nonce, hostOk), 'Cache-Control': 'no-store' });
  res.end(HTML.replace(/<script\b/g, '<script nonce="' + nonce + '"'));
});
// Only pages served from this site (or ALLOWED_ORIGINS) may open a socket: blocks other websites from using a visitor's session.
const io = new Server(server, {
  maxHttpBufferSize: 30e6,
  allowRequest: (req, cb) => {
    const o = req.headers.origin;
    if (!o) return cb(null, true);
    try { cb(null, new URL(o).host === req.headers.host || EXTRA_ORIGINS.includes(o)); } catch (e) { cb(null, false); }
  },
});

const room = (n) => 'u:' + n;
const online = (n) => (io.sockets.adapter.rooms.get(room(n))?.size || 0) > 0;
const userList = () => Object.values(db.users).map((u) => ({ name: u.name, online: online(u.name), avatar: u.avatar || null, lastSeen: u.lastSeen || null }));
const emitTo = (names, ev, data) => names.forEach((n) => io.to(room(n)).emit(ev, clean(ev, data, n)));
const groupsOf = (n) => Object.values(db.groups).filter((g) => g.members.includes(n));
// ---- Passwords: scrypt runs off the main thread, at most 4 at once, so login spam cannot freeze the server ----
let hashBusy = 0; const hashQ = [];
const hashA = (pass, salt) => new Promise((resolve, reject) => {
  const run = () => { hashBusy++; crypto.scrypt(pass, salt, 64, (e, k) => { hashBusy--; const n = hashQ.shift(); if (n) n(); e ? reject(e) : resolve(k); }); };
  if (hashBusy < 4) run(); else if (hashQ.length < 50) hashQ.push(run); else reject(new Error('busy'));
});
const DUMMY_SALT = '0'.repeat(32); // unknown users still cost one hash, so timing does not reveal who exists
const sameHash = async (plain, salt, hex) => {
  const k = await hashA(plain, salt || DUMMY_SALT), h = hex ? Buffer.from(hex, 'hex') : null;
  return !!h && h.length === k.length && crypto.timingSafeEqual(k, h);
};

// ---- Rate limits: counted per IP, per name, and per IP+name. Reconnecting does not reset them. ----
const hits = new Map();
const blockedFor = (key) => { const a = hits.get(key); return a && a.lock > Date.now() ? a.lock - Date.now() : 0; };
const hit = (key, max, win, lock) => {
  const now = Date.now(); let a = hits.get(key);
  if (!a || now - a.first > win) a = { n: 0, first: now, lock: 0 };
  if (++a.n >= max) { a.lock = now + lock; a.n = 0; a.first = now; }
  hits.set(key, a);
};
const waitMsg = (ms) => 'Too many attempts. Try again in ' + Math.max(1, Math.ceil(ms / MIN)) + ' min.';

// ---- Login tokens: stored only as a SHA-256 hash, expire after 30 days of not being used, max 10 devices per person ----
const TOKEN_TTL = 30 * 864e5, MAX_TOKENS = 10;
const sha = (x) => crypto.createHash('sha256').update(String(x)).digest('hex');
for (const k of Object.keys(db.tokens)) { // upgrade old plaintext tokens in place (people stay logged in)
  if (typeof db.tokens[k] === 'string') { const n = db.tokens[k]; delete db.tokens[k]; db.tokens[sha(k)] = { name: n, made: Date.now(), exp: Date.now() + TOKEN_TTL }; }
}
const newToken = (name) => {
  const tok = crypto.randomBytes(32).toString('hex'), now = Date.now();
  db.tokens[sha(tok)] = { name, made: now, exp: now + TOKEN_TTL };
  const mine = Object.entries(db.tokens).filter(([, v]) => v.name === name).sort((a, b) => a[1].made - b[1].made);
  while (mine.length > MAX_TOKENS) delete db.tokens[mine.shift()[0]];
  return tok;
};
const tokenUser = (tok) => {
  const k = sha(tok), t = db.tokens[k], now = Date.now();
  if (!t) return null;
  if (t.exp < now) { delete db.tokens[k]; return null; }
  if (t.exp - now < TOKEN_TTL - 864e5) t.exp = now + TOKEN_TTL; // renew at most once a day
  return find(t.name) || null;
};
const dropTokens = (name) => { for (const k in db.tokens) if (db.tokens[k].name === name) delete db.tokens[k]; };
setInterval(() => {
  const now = Date.now(); let n = 0;
  for (const k in db.tokens) if (db.tokens[k].exp < now) { delete db.tokens[k]; n++; }
  for (const [k, a] of hits) if (a.lock < now && now - a.first > 60 * MIN) hits.delete(k);
  if (n) save();
}, 10 * MIN).unref();
const find = (n) => db.users[String(n || '').toLowerCase()];
// ---- World communities ----
// Any account can create a world community and becomes its "auto" admin (shown with a gray "auto" label).
//   Auto admin: everything an admin can do, plus add / remove admins, rename and delete the community.
//   Admins:     remove people from the community and from its groups, admit Main Stage speakers, remove groups,
//               delete messages in the community rooms, unban. They cannot touch the auto admin or other admins.
// The built-in community is "myChat world chat" (everyone is in it). Its auto admin is the first account ever
// created; WORLD_ADMINS=name1,name2 (optional) adds regular admins to it.
const BUILTIN = 'world';
db.communities ||= {};
(() => { // move the old single World community into the built-in one (runs once)
  const old = db.community || { admins: [], groups: [] };
  const c = (db.communities[BUILTIN] ||= { id: BUILTIN, name: 'myChat world chat', owner: '', admins: [], groups: [], speakers: {}, members: [], banned: [], lounge: 'world', stage: 'stage', builtin: true, created: Date.now() });
  if (!c.migrated) {
    c.migrated = true;
    c.owner = (old.admins || [])[0] || '';
    c.admins = (old.admins || []).slice(1);
    c.groups = [...(old.groups || [])];
    c.speakers = { ...((db.groups.stage || {}).speakers || {}) };
  }
  c.name = 'myChat world chat'; c.builtin = true; c.lounge = 'world'; c.stage = 'stage';
  c.admins ||= []; c.groups ||= []; c.speakers ||= {}; c.members ||= []; c.banned ||= [];
})();
const cm = (id) => db.communities[id];
const isOwner = (c, n) => !!c && !!n && c.owner === n; // the auto admin
const isCA = (c, n) => !!c && !!n && (c.owner === n || c.admins.includes(n)); // auto admin or admin
const inComm = (c, n) => !!c && !!find(n) && (c.builtin ? !c.banned.includes(n) : c.members.includes(n));
const commOf = (g) => (g && g.comm ? cm(g.comm) : null); // the community a lounge / Main Stage belongs to
const commMembers = (c) => (c.builtin ? Object.values(db.users).map((u) => u.name).filter((n) => !c.banned.includes(n)) : c.members.filter((n) => find(n)));
const speakersOf = (c) => { // only speakers that are still valid (their group is in the community and they are still in it)
  const out = {};
  for (const [n, gid] of Object.entries(c.speakers || {})) { const g = db.groups[gid]; if (g && c.groups.includes(gid) && g.members.includes(n) && inComm(c, n)) out[n] = gid; }
  return out;
};
const stageTagOf = (c, n) => (c ? speakersOf(c)[n] ?? '' : ''); // group id the person speaks for ('' = admin)
const syncComm = (c) => {
  if (!c.builtin) c.members = [...new Set(c.members.filter((n) => find(n)))];
  c.groups = c.groups.filter((id) => db.groups[id] && !db.groups[id].world);
  c.admins = [...new Set(c.admins.filter((n) => n !== c.owner && inComm(c, n)))];
  c.speakers = speakersOf(c);
  const members = commMembers(c), lg = db.groups[c.lounge], sg = db.groups[c.stage];
  if (lg) lg.members = members.slice();
  if (sg) { sg.members = members.slice(); sg.speakers = c.speakers; sg.admins = [...new Set([...Object.keys(c.speakers), ...(c.owner ? [c.owner] : []), ...c.admins])]; }
};
const newCommunity = (name, owner) => {
  let id; do { id = 'k' + crypto.randomBytes(3).toString('hex'); } while (db.communities[id] || db.groups[id + 'l'] || db.groups[id + 's']);
  const base = { owner: '', world: true, comm: id, history: true, joined: {}, admins: [], members: [] };
  db.groups[id + 'l'] = { ...base, id: id + 'l', name: '💬 ' + name };
  db.groups[id + 's'] = { ...base, id: id + 's', name: '🎤 ' + name + ' · Main Stage', stage: true, announce: true, speakers: {} };
  const c = (db.communities[id] = { id, name, owner, admins: [], groups: [], speakers: {}, members: [owner], banned: [], lounge: id + 'l', stage: id + 's', created: Date.now() });
  syncComm(c);
  return c;
};
{ // start-up: env admins, first account = auto admin of the built-in community, make every room match its community
  const wc = cm(BUILTIN);
  String(process.env.WORLD_ADMINS || '').split(',').map((x) => find(x.trim())).filter(Boolean).forEach((u) => { if (u.name !== wc.owner && !wc.admins.includes(u.name)) wc.admins.push(u.name); });
  if (!wc.owner) { const first = Object.values(db.users)[0]; if (first) { wc.owner = first.name; wc.admins = wc.admins.filter((n) => n !== first.name); } }
  Object.values(db.communities).forEach(syncComm);
}
const commView = (c, n) => { // what one person sees of a community
  const ca = isCA(c, n), sp = c.speakers;
  const v = {
    id: c.id, name: c.name, builtin: !!c.builtin, lounge: c.lounge, stage: c.stage, owner: c.owner, admins: c.admins,
    admin: ca, auto: isOwner(c, n), count: commMembers(c).length,
    groups: c.groups.map((id) => db.groups[id]).filter(Boolean).map((g) => ({
      id: g.id, name: g.name, avatar: g.avatar || null, count: g.members.length, mine: g.members.includes(n), manage: ca || isAdmin(g, n),
      speakers: Object.keys(sp).filter((u) => sp[u] === g.id), ...(ca ? { members: g.members } : {}),
    })),
  };
  if (ca) { v.members = commMembers(c); v.banned = c.banned; }
  return v;
};
const communitiesFor = (n) => {
  const all = Object.values(db.communities).sort((a, b) => (b.builtin ? 1 : 0) - (a.builtin ? 1 : 0) || a.created - b.created);
  return {
    mine: all.filter((c) => inComm(c, n)).map((c) => commView(c, n)),
    more: all.filter((c) => !c.builtin && !inComm(c, n) && !c.banned.includes(n)).map((c) => ({ id: c.id, name: c.name, owner: c.owner, count: c.members.length })),
  };
};
const pushComm = () => Object.values(db.users).forEach((u) => io.to(room(u.name)).emit('communities', communitiesFor(u.name)));
const refreshComm = (c, gone = []) => { // call after any change: re-sync the rooms, tell everyone affected
  syncComm(c); save();
  const lg = db.groups[c.lounge], sg = db.groups[c.stage];
  emitTo(lg.members, 'group', lg); emitTo(sg.members, 'group', sg);
  gone.forEach((n) => { emitTo([n], 'group:removed', lg.id); emitTo([n], 'group:removed', sg.id); });
  pushComm();
};
const sendCommHistory = (c, n) => [db.groups[c.lounge], db.groups[c.stage]].forEach((g) => emitTo([n], 'group:history', { id: g.id, messages: db.messages.filter((m) => m.group === g.id && visible(g, n, m)).slice(-200) }));
const settingsFor = (n) => ({ allowDelete: find(n).allowDelete !== false, lockSet: !!find(n).lockHash });
// Group history: if g.history is false, a member only sees messages from when they joined (g.joined[name]).
const blocked = (a, b) => (db.blocks[a] || []).includes(b); // has a blocked b?
const keyFor = (m, me) => (m.group ? 'g:' + m.group : 'u:' + (m.from === me ? m.to : m.from));
// Status: photo / text posts that vanish after 24 hours. Viewer lists are only shown to the poster.
const STATUS_MS = Number(process.env.STATUS_MS) || 24 * 3600 * 1000;
const audOk = (st, n) => !st.aud || st.aud.mode === 'all' || (st.aud.mode === 'only') === st.aud.list.includes(n); // only: must be listed; except: must not be
const statusVisible = (st, n) => st.exp > Date.now() && (st.from === n || (!(blocked(n, st.from) || blocked(st.from, n)) && audOk(st, n)));
const statusFor = (st, n) => {
  const own = n === st.from, lim = !!st.maxViews && !own, used = (st.counts || {})[n] || 0; // limited: others only get the content one view at a time
  return {
    id: st.id, from: st.from, kind: st.kind, bg: st.bg, ts: st.ts, exp: st.exp,
    text: lim ? '' : st.text, caption: lim ? '' : st.caption, file: !st.file || lim ? null : { url: st.file.url, type: st.file.type },
    ...(own ? { viewers: st.viewers, aud: st.aud, maxViews: st.maxViews || 0 }
      : { seen: lim ? used > 0 : st.viewers.some((v) => v.name === n), ...(lim ? { limited: true, max: st.maxViews, left: Math.max(0, st.maxViews - used) } : {}) }),
  };
};
const statusesFor = (n) => db.statuses.filter((st) => statusVisible(st, n)).map((st) => statusFor(st, n));
function view(m) { // what clients may see of a message (view-once files lose their address)
  if (m && m.tg !== undefined && !m.tag) { const tgG = db.groups[m.tg]; m = { ...m, tag: m.tg === '' ? 'Admin' : tgG ? tgG.name : 'a former group' }; } // Main Stage: show the speaker's group
  if (m && m.group && !m.system) { const mc = commOf(db.groups[m.group]); if (mc && mc.owner && m.from === mc.owner) m = { ...m, auto: true }; } // the auto admin gets a gray "auto" label
  if (!m || !m.once || !m.file) return m;
  return { ...m, file: { name: 'View once', type: m.file.type, size: m.file.size, once: true, dur: m.file.dur, viewedBy: Object.keys(m.views || {}).filter((n) => m.views[n] > 0), views: m.views || {}, max: m.maxViews || 1, gone: !m.file.url } };
}
const isDel = (m, n) => m.deleted || (m.delFor || []).includes(n);
function forUser(m, n) { // each person's own version of a message (delete rules)
  if (!m) return m;
  if (isDel(m, n)) {
    const t = { ...m, text: '', file: null, poll: null, once: undefined, reactions: undefined, deleted: true };
    if (n !== m.from) t.keptBy = undefined; // only the sender learns who kept a copy
    return t;
  }
  if (m.delAttempt && n !== m.from) return { ...m, kept: true, keptBy: undefined };
  return m;
}
function clean(ev, d, n) {
  if (ev === 'message' || ev === 'message:update') return forUser(view(d), n);
  if (ev === 'group:history') return { ...d, messages: d.messages.map((m) => forUser(view(m), n)) };
  return d;
}
function finishOnce(m) { // delete the file for good
  const name = path.basename(m.file.url);
  fs.unlink(path.join(UP, name), () => {}); onceNames.delete(name);
  m.file.url = null; save();
  emitTo(audienceOf(m), 'message:update', m);
}
const audienceOf = (m) => (m.group ? db.groups[m.group]?.members || [] : [m.from, m.to]);
const ttlText = (s) => ({ 3600: '1 hour', 86400: '24 hours', 604800: '7 days' })[s];
const timersFor = (me) => {
  const t = {};
  for (const k in db.dmTimers) { const [x, y] = k.split('|'); if (x === me || y === me) t['u:' + (x === me ? y : x)] = db.dmTimers[k]; }
  return t;
};
// Disappearing messages: purge expired ones (and their files) every few seconds
setInterval(() => {
  const now = Date.now();
  const dead = db.statuses.filter((s) => s.exp <= now);
  if (dead.length) {
    db.statuses = db.statuses.filter((s) => s.exp > now);
    dead.forEach((s) => { if (s.file) { fs.unlink(path.join(UP, path.basename(s.file.url)), () => {}); onceNames.delete(path.basename(s.file.url)); } });
    save(); io.emit('status:gone', { ids: dead.map((s) => s.id) });
  }
  for (const m of db.messages) {
    if (!(m.once && m.file && m.file.url)) continue;
    const recips = audienceOf(m).filter((n) => n !== m.from);
    if (m.onceExp <= now || (recips.length && recips.every((n) => ((m.views || {})[n] || 0) >= (m.maxViews || 1)) && now - (m.lastView || 0) > 120000)) finishOnce(m);
  }
  const lounges = new Set(Object.values(db.groups).filter((g) => g.world && !g.stage).map((g) => g.id)), per = {};
  for (const m of db.messages) if (m.group && lounges.has(m.group)) (per[m.group] ||= []).push(m); // keep each community lounge small: newest 2000 only
  for (const gid in per) {
    if (per[gid].length <= 2000) continue;
    const old = new Set(per[gid].slice(0, per[gid].length - 2000).map((m) => m.id));
    db.messages.filter((m) => old.has(m.id)).forEach((m) => m.file && m.file.url && fs.unlink(path.join(UP, path.basename(m.file.url)), () => {}));
    db.messages = db.messages.filter((m) => !old.has(m.id)); save();
  }
  const gone = db.messages.filter((m) => m.expires && m.expires <= now);
  if (!gone.length) return;
  db.messages = db.messages.filter((m) => !(m.expires && m.expires <= now));
  gone.forEach((m) => {
    if (m.file && m.file.url) fs.unlink(path.join(UP, path.basename(m.file.url)), () => {});
    emitTo(audienceOf(m), 'message:gone', { ids: [m.id] });
  });
  save();
}, Number(process.env.PURGE_MS) || 15000);
const norm = (c) => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
// Recovery code: shown once to the user, stored only as a hash. Lets them reset a forgotten password.
const setRecovery = async (u) => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const raw = Array.from(crypto.randomBytes(12), (b) => alphabet[b % alphabet.length]).join('');
  u.rsalt = crypto.randomBytes(16).toString('hex'); u.rhash = (await hashA(raw, u.rsalt)).toString('hex');
  return raw.match(/.{4}/g).join('-');
};
const isAdmin = (g, n) => g.owner === n || (g.admins || []).includes(n);
const visible = (g, name, m) => g.history !== false || m.id >= ((g.joined || {})[name] || 0);
const sysMsg = (g, text) => {
  const m = { id: db.nextId++, from: '', to: null, group: g.id, text, file: null, replyTo: null, system: true, ts: Date.now(), status: null };
  db.messages.push(m); save(); emitTo(g.members, 'message', m);
};

io.on('connection', (socket) => {
  let me = null, myToken = null;

  const enter = (name, token, cb) => {
    me = name; myToken = token; socket.join(room(me));
    const delivered = {};
    for (const m of db.messages) {
      if (!m.group && !m.drop && m.to === me && m.status === 'sent') { m.status = 'delivered'; (delivered[m.from] ||= []).push(m.id); }
    }
    for (const f in delivered) emitTo([f], 'status', { ids: delivered[f], status: 'delivered' });
    const groups = groupsOf(me), gids = groups.map((g) => g.id);
    const history = db.messages.filter((m) => (m.group ? gids.includes(m.group) && visible(db.groups[m.group], me, m) : m.from === me || m.to === me))
    const myLounges = new Set(groups.filter((g) => g.world && !g.stage).map((g) => g.id)), keep = new Set(), byG = {};
    for (const m of db.messages) if (myLounges.has(m.group)) (byG[m.group] ||= []).push(m.id);
    for (const gid in byG) byG[gid].slice(-200).forEach((id) => keep.add(id)); // only the latest 200 messages of each community lounge
    const mine = history.filter((m) => !(m.drop && m.to === me) && m.id > ((db.cleared[me] || {})[keyFor(m, me)] || 0) && !(db.hidden[me] || {})[m.id] && !(myLounges.has(m.group) && (blocked(me, m.from) || !keep.has(m.id))));
    save();
    const wp = (db.prefs[me] ||= { pinned: [], muted: [] }); // the world chat starts muted for everyone
    if (!wp.worldSeeded) { wp.worldSeeded = true; if (!wp.muted.includes('g:world')) wp.muted.push('g:world'); }
    cb({ me, token, users: userList(), groups, history: mine.map((m) => forUser(view(m), me)), reads: db.reads[me] || {}, prefs: db.prefs[me] || { pinned: [], muted: [] }, timers: timersFor(me), blocked: db.blocks[me] || [], settings: settingsFor(me), communities: communitiesFor(me), statuses: statusesFor(me), statusAud: find(me).statusAud || { mode: 'all', list: [] }, statusDef: find(me).statusDef || { hours: 24, limit: 0 } });
    io.emit('users', userList());
  };

  socket.on('auth', async ({ mode, name, pass, token, code } = {}, cb) => {
    if (typeof cb !== 'function') return;
    try {
      const ip = ipOf(socket.request);
      const ipWait = blockedFor('ip:' + ip);
      if (ipWait) return cb({ error: waitMsg(ipWait) });
      if (token) {
        const tu = typeof token === 'string' ? tokenUser(token) : null;
        if (tu) return enter(tu.name, token, cb);
        hit('ip:' + ip, 30, 15 * MIN, 15 * MIN);
        return cb({ error: 'expired' });
      }
      name = String(name || '').trim().slice(0, 40); pass = String(pass || '');
      if (pass.length > 200) return cb({ error: 'Password is too long.' });
      let u = find(name), recovery = null;
      const kn = 'n:' + name.toLowerCase(), kin = 'in:' + ip + '|' + name.toLowerCase();
      const fail = (msg) => { hit('ip:' + ip, 30, 15 * MIN, 15 * MIN); hit(kin, 6, 15 * MIN, 15 * MIN); hit(kn, 30, 15 * MIN, 15 * MIN); return cb({ error: msg }); };
      if (mode !== 'signup') { const w = Math.max(blockedFor(kn), blockedFor(kin)); if (w) return cb({ error: waitMsg(w) }); }
      if (mode === 'reset') {
        const ok = await sameHash(norm(code), u && u.rsalt, u && u.rhash);
        if (!ok) return fail('Wrong username or recovery code.');
        if (pass.length < 6) return cb({ error: 'Password must be at least 6 characters.' });
        u.salt = crypto.randomBytes(16).toString('hex'); u.hash = (await hashA(pass, u.salt)).toString('hex');
        dropTokens(u.name); // a reset signs out every other device
        const fresh = await setRecovery(u), tk = newToken(u.name);
        hits.delete(kin); hits.delete(kn);
        return enter(u.name, tk, (res) => cb({ ...res, recovery: fresh }));
      }
      if (mode === 'signup') {
        const sw = blockedFor('su:' + ip);
        if (sw) return cb({ error: 'Too many sign-ups from this network. Try again in ' + Math.max(1, Math.ceil(sw / MIN)) + ' min.' });
        if (!/^[A-Za-z0-9_]{2,20}$/.test(name)) return cb({ error: 'Name: 2-20 letters, numbers or _' });
        if (pass.length < 6) return cb({ error: 'Password must be at least 6 characters.' });
        if (u) return cb({ error: 'That name is taken.' });
        const salt = crypto.randomBytes(16).toString('hex');
        const fresh = { name, salt, hash: (await hashA(pass, salt)).toString('hex'), created: Date.now() };
        recovery = await setRecovery(fresh);
        if (find(name)) return cb({ error: 'That name is taken.' }); // someone else took it while we were hashing
        u = db.users[name.toLowerCase()] = fresh;
        const wc = cm(BUILTIN); if (!wc.owner) wc.owner = name; // the very first account becomes the auto admin of myChat world chat
        syncComm(wc);
        hit('su:' + ip, 5, 60 * MIN, 60 * MIN); // 5 new accounts per hour per network
      } else if (!(await sameHash(pass, u && u.salt, u && u.hash))) {
        return fail('Wrong name or password.');
      } else hits.delete(kin);
      const tok = newToken(u.name);
      enter(u.name, tok, recovery ? (res) => cb({ ...res, recovery }) : cb);
    } catch (e) { cb({ error: 'Server is busy. Try again in a moment.' }); }
  });

  const onMessage = ({ to, group, text, file, replyTo, statusReply, forwarded } = {}, cb) => {
    if (!me) return;
    cb = typeof cb === 'function' ? cb : () => {};
    text = String(text || '').trim().slice(0, 2000);
    let members, stageTag;
    if (group) {
      const g = db.groups[group];
      if (!g || !g.members.includes(me)) return;
      if (g.announce && !isAdmin(g, me)) return cb({ error: 'Only admins can send messages in this group.' });
      if (g.world) {
        if (Date.now() - (lastWorld[me] || 0) < 1500) return cb({ error: 'Slow down a little: one message every second or two in the world chat.' });
        lastWorld[me] = Date.now();
      }
      if (g.stage) stageTag = stageTagOf(commOf(g), me);
      members = g.world ? g.members.filter((n) => n === me || !blocked(n, me)) : g.members; // people who blocked you do not get your world messages
    } else {
      const u = find(to);
      if (!u || u.name === me) return;
      to = u.name; members = [me, to];
      if (blocked(me, to)) return cb({ error: 'Unblock this user to send messages.' });
    }
    const rid = Number(replyTo), rm = rid && db.messages.find((x) => x.id === rid);
    const reply = rm && (group ? rm.group === group : !rm.group && [rm.from, rm.to].includes(me) && [rm.from, rm.to].includes(to)) ? rid : null;
    let f = null;
    if (file && file.data) {
      const buf = Buffer.from(String(file.data), 'base64');
      if (!buf.length || buf.length > 20e6) return cb({ error: 'File must be under 20 MB.' });
      const ft = String(file.type || '').split(';')[0];
      const type = MEDIA[ft] ? ft : 'application/octet-stream';
      if (type !== 'application/octet-stream' && !sniffOk(type, buf)) return cb({ error: BAD_FILE });
      const id = crypto.randomBytes(16).toString('hex'), ext = MEDIA[type] || 'bin';
      fs.writeFileSync(path.join(UP, id + '.' + ext), buf);
      f = { name: String(file.name || 'file').slice(0, 80), type, size: buf.length, url: '/uploads/' + id + '.' + ext };
      if (type.startsWith('audio/')) { // waveform + length for the voice-note player
        if (Array.isArray(file.wave)) f.wave = file.wave.slice(0, 64).map((v) => Math.max(0, Math.min(100, Math.round(Number(v) || 0))));
        f.dur = Math.min(Math.round(Number(file.dur) || 0), 3600) || undefined;
      }
    }
    if (!text && !f) return;
    const drop = !group && blocked(to, me); // recipient blocked sender: keep it on the sender's side only
    const sst = !group && statusReply ? db.statuses.find((s) => s.id === statusReply) : null; // replying to someone's status
    const sref = sst && sst.from === to && statusVisible(sst, me) ? { kind: sst.kind, text: (sst.kind === 'text' ? sst.text : sst.caption || '').slice(0, 80), bg: sst.bg } : undefined;
    const once = !!(f && file.once && (f.type.startsWith('image/') || f.type.startsWith('audio/'))); // view once: photos and voice notes only
    const maxViews = once ? Math.max(1, Math.min(5, Number(file.once) | 0 || 1)) : undefined; // how many times each person may open it
    const ttl = group ? db.groups[group].ttl : db.dmTimers[[me, to].sort().join('|')] || 0;
    const m = { id: db.nextId++, from: me, to: group ? null : to, group: group || null, text, file: f, replyTo: reply, expires: ttl ? Date.now() + ttl * 1000 : null, ts: Date.now(), status: group ? null : !drop && online(to) ? 'delivered' : 'sent', drop: drop || undefined, once: once || undefined, maxViews, onceExp: once ? Date.now() + 14 * 864e5 : undefined, sref, fwd: forwarded ? true : undefined };
    if (stageTag !== undefined) m.tg = stageTag;
    db.messages.push(m); save();
    if (once) onceNames.add(path.basename(f.url));
    emitTo(drop ? [me] : members, 'message', m);
  };
  socket.on('message', onMessage);

  socket.on('group:create', ({ name, members, history, announce } = {}, cb) => {
    if (!me || typeof cb !== 'function') return;
    name = String(name || '').trim().slice(0, 30);
    const list = [...new Set([me, ...(Array.isArray(members) ? members : [])].map(find).filter(Boolean).map((u) => u.name))];
    if (!name || list.length < 2) return cb({ error: 'Name the group and pick at least one member.' });
    const g = { id: crypto.randomBytes(6).toString('hex'), name, members: list, owner: me, history: history !== false, joined: {}, admins: [], announce: !!announce };
    db.groups[g.id] = g; save();
    emitTo(list, 'group', g);
    sysMsg(g, me + ' created the group');
    cb({ id: g.id });
  });

  socket.on('typing', ({ to, group } = {}) => {
    if (!me) return;
    const targets = group ? (db.groups[group]?.members || []).filter((n) => n !== me) : [to];
    emitTo(targets.filter((n) => !blocked(n, me)), 'typing', { from: me, group: group || null });
  });

  socket.on('read', ({ to, group } = {}) => {
    if (!me) return;
    const r = (db.reads[me] ||= {}), k = group ? 'g:' + group : 'u:' + to;
    let last = r[k] || 0; const ids = [];
    for (const m of db.messages) {
      if (group ? m.group === group : !m.group && !m.drop && m.from === to && m.to === me) {
        if (m.id > last) last = m.id;
        if (!group && m.status !== 'read') { m.status = 'read'; ids.push(m.id); }
      }
    }
    r[k] = last; save();
    if (ids.length) emitTo([to], 'status', { ids, status: 'read' });
  });

  const audience = (m) => (m.group ? db.groups[m.group]?.members || [] : [m.from, m.to]);
  socket.on('message:edit', ({ id, text } = {}) => {
    const m = db.messages.find((x) => x.id === id);
    text = String(text || '').trim().slice(0, 2000);
    if (!me || !m || m.from !== me || isDel(m, me) || (!text && !m.file) || m.poll) return;
    m.text = text; m.edited = true; save(); emitTo(audience(m), 'message:update', m);
  });
  // Delete for everyone: removed for the sender and for everyone who allows it; others keep their copy.
  socket.on('message:delete', ({ id } = {}, cb) => {
    cb = typeof cb === 'function' ? cb : () => {};
    const m = db.messages.find((x) => x.id === id);
    if (!me || !m || m.system) return;
    if (m.from !== me) { // an admin of the community may remove any message in its lounge or Main Stage (not the auto admin's, unless they are the auto admin)
      const mc = m.group ? commOf(db.groups[m.group]) : null;
      if (!mc || !isCA(mc, me) || m.deleted) return;
      if (isOwner(mc, m.from) && !isOwner(mc, me)) return cb({ error: 'Only the auto admin can remove the auto admin\'s messages.' });
      if (m.file && m.file.url) fs.unlink(path.join(UP, path.basename(m.file.url)), () => {});
      m.deleted = true; m.text = ''; m.file = null; m.poll = null; m.modBy = me;
      save(); emitTo(audience(m), 'message:update', m);
      return cb({ ok: true, kept: [] });
    }
    if (isDel(m, me)) return;
    const people = audience(m), delFor = (m.delFor ||= []), kept = [];
    people.forEach((n) => {
      if (n === me || (find(n) || {}).allowDelete !== false) { if (!delFor.includes(n)) delFor.push(n); }
      else kept.push(n);
    });
    m.delAttempt = true; m.keptBy = kept;
    if (!kept.length) { // nobody keeps a copy: erase the content for good
      if (m.file && m.file.url) fs.unlink(path.join(UP, path.basename(m.file.url)), () => {});
      m.deleted = true; m.text = ''; m.file = null; m.poll = null;
    }
    save(); emitTo(people, 'message:update', m);
    cb({ kept });
  });

  // Delete for me: hides one message from this person's chat only
  socket.on('message:hide', ({ id } = {}) => {
    const m = db.messages.find((x) => x.id === id);
    if (!me || !m || m.system || !audience(m).includes(me)) return;
    if (m.group && !visible(db.groups[m.group], me, m)) return;
    (db.hidden[me] ||= {})[m.id] = 1; save(); emitTo([me], 'hidden', { id });
  });

  // "Let others delete my copy" switch
  socket.on('settings:set', ({ allowDelete } = {}) => {
    if (!me || typeof allowDelete !== 'boolean') return;
    find(me).allowDelete = allowDelete; save(); emitTo([me], 'settings', settingsFor(me));
  });

  socket.on('profile:avatar', ({ type, data } = {}, cb) => {
    cb = typeof cb === 'function' ? cb : () => {};
    if (!me || !IMG[type]) return cb({ error: 'Choose a PNG, JPG, GIF or WebP image.' });
    const buf = Buffer.from(String(data || ''), 'base64');
    if (!buf.length || buf.length > 2e6) return cb({ error: 'Picture must be under 2 MB.' });
    if (!sniffOk(type, buf)) return cb({ error: BAD_FILE });
    const id = crypto.randomBytes(16).toString('hex');
    fs.writeFileSync(path.join(UP, id + '.' + IMG[type]), buf);
    find(me).avatar = '/uploads/' + id + '.' + IMG[type]; save();
    io.emit('users', userList()); cb({ ok: true });
  });

  socket.on('group:update', ({ id, name, add, remove, history, announce, admins } = {}, cb) => {
    cb = typeof cb === 'function' ? cb : () => {};
    const g = db.groups[id];
    if (!me || !g || g.world || g.stage || !isAdmin(g, me)) return cb({ error: 'Only a group admin can do that.' });
    const old = [...g.members], rem = Array.isArray(remove) ? remove : [];
    const notes = [], nn = String(name || '').trim().slice(0, 30);
    if (nn && nn !== g.name) { g.name = nn; notes.push(me + ' renamed the group to ' + nn); }
    if (typeof history === 'boolean' && history !== (g.history !== false)) {
      g.history = history; notes.push(me + (history ? ' now lets' : ' no longer lets') + ' new members see earlier messages');
    }
    if (typeof announce === 'boolean' && announce !== !!g.announce) {
      g.announce = announce; notes.push(me + (announce ? ' made this group admin-only' : ' allowed everyone to send messages'));
    }
    g.joined ||= {};
    const added = [];
    (Array.isArray(add) ? add : []).map(find).filter(Boolean).forEach((u) => {
      if (!g.members.includes(u.name)) { g.members.push(u.name); g.joined[u.name] = db.nextId; added.push(u.name); }
    });
    g.members = g.members.filter((n) => n === me || n === g.owner || !rem.includes(n));
    if (Array.isArray(admins)) {
      const next = [...new Set(admins.filter((n) => g.members.includes(n) && n !== g.owner))].sort();
      if (JSON.stringify(next) !== JSON.stringify([...(g.admins || [])].sort())) { g.admins = next; notes.push(me + ' changed the group admins'); }
    }
    const gone = old.filter((n) => !g.members.includes(n));
    save();
    emitTo(g.members, 'group', g);
    emitTo(gone, 'group:removed', g.id);
    notes.forEach((t) => sysMsg(g, t));
    if (added.length) sysMsg(g, me + ' added ' + added.join(', '));
    if (gone.length) sysMsg(g, me + ' removed ' + gone.join(', '));
    added.forEach((n) => emitTo([n], 'group:history', { id: g.id, messages: db.messages.filter((m) => m.group === g.id && visible(g, n, m)) }));
    Object.values(db.communities).filter((c) => c.groups.includes(g.id)).forEach((c) => refreshComm(c));
    cb({ ok: true });
  });
  socket.on('group:leave', (id) => {
    const g = db.groups[id];
    if (!me || !g || g.world || !g.members.includes(me)) return;
    const wasIn = Object.values(db.communities).filter((c) => c.groups.includes(id));
    g.members = g.members.filter((n) => n !== me); g.admins = (g.admins || []).filter((n) => n !== me);
    if (!g.members.length) delete db.groups[id];
    else { if (g.owner === me) g.owner = g.members[0]; emitTo(g.members, 'group', g); sysMsg(g, me + ' left'); }
    save(); emitTo([me], 'group:removed', id);
    wasIn.forEach((c) => refreshComm(c));
  });

  // Call signaling (WebRTC): the server only relays messages between the two users
  ['call:offer', 'call:answer', 'call:ice', 'call:end', 'call:busy'].forEach((ev) =>
    socket.on(ev, (d = {}) => { const u = me && find(d.to); if (u && !blocked(u.name, me) && !blocked(me, u.name)) emitTo([u.name], ev, { ...d, from: me }); }));

  socket.on('pref:set', ({ key, pinned, muted } = {}) => {
    if (!me || !/^[ug]:[A-Za-z0-9_]{1,20}$/.test(String(key))) return;
    const p = (db.prefs[me] ||= { pinned: [], muted: [] });
    const flip = (list, on) => { const i = list.indexOf(key); if (on && i < 0) list.push(key); if (on === false && i >= 0) list.splice(i, 1); };
    if (typeof pinned === 'boolean') flip(p.pinned, pinned);
    if (typeof muted === 'boolean') flip(p.muted, muted);
    save(); emitTo([me], 'prefs', p);
  });

  // "Seen by" for a group message: only its sender can ask
  socket.on('seen', ({ id } = {}, cb) => {
    const m = db.messages.find((x) => x.id === id), g = m && m.group && db.groups[m.group];
    if (typeof cb !== 'function' || !me || !g || m.from !== me) return;
    const others = g.members.filter((n) => n !== me && visible(g, n, m));
    const seen = others.filter((n) => ((db.reads[n] || {})['g:' + g.id] || 0) >= m.id);
    cb({ seen, pending: others.filter((n) => !seen.includes(n)) });
  });

  socket.on('recovery:new', async (_, cb) => {
    if (!me || typeof cb !== 'function') return;
    if (blockedFor('rc:' + me)) return cb({ error: 'Too many requests. Try again later.' });
    hit('rc:' + me, 5, 60 * MIN, 60 * MIN);
    let code; try { code = await setRecovery(find(me)); } catch (e) { return cb({ error: 'Server is busy. Try again.' }); }
    save(); cb({ code });
  });

  socket.on('timer:set', ({ to, group, seconds } = {}, cb) => {
    cb = typeof cb === 'function' ? cb : () => {};
    if (!me || ![0, 3600, 86400, 604800].includes(seconds)) return;
    if (group) {
      const g = db.groups[group];
      if (!g || g.world || !isAdmin(g, me)) return cb({ error: 'Only a group admin can do that.' });
      g.ttl = seconds; save(); emitTo(g.members, 'group', g);
      sysMsg(g, me + (seconds ? ' set messages to disappear after ' + ttlText(seconds) : ' turned off disappearing messages'));
    } else {
      const u = find(to);
      if (!u || u.name === me) return;
      db.dmTimers[[me, u.name].sort().join('|')] = seconds; save();
      emitTo([me], 'timer', { key: 'u:' + u.name, seconds }); emitTo([u.name], 'timer', { key: 'u:' + me, seconds });
    }
  });

  socket.on('group:avatar', ({ id, type, data } = {}, cb) => {
    cb = typeof cb === 'function' ? cb : () => {};
    const g = db.groups[id];
    if (!me || !g || g.world || g.stage || !isAdmin(g, me)) return cb({ error: 'Only a group admin can do that.' });
    if (!IMG[type]) return cb({ error: 'Choose a PNG, JPG, GIF or WebP image.' });
    const buf = Buffer.from(String(data || ''), 'base64');
    if (!buf.length || buf.length > 2e6) return cb({ error: 'Picture must be under 2 MB.' });
    if (!sniffOk(type, buf)) return cb({ error: BAD_FILE });
    const fid = crypto.randomBytes(16).toString('hex');
    fs.writeFileSync(path.join(UP, fid + '.' + IMG[type]), buf);
    if (g.avatar) fs.unlink(path.join(UP, path.basename(g.avatar)), () => {});
    g.avatar = '/uploads/' + fid + '.' + IMG[type]; save();
    emitTo(g.members, 'group', g); sysMsg(g, me + ' changed the group picture'); cb({ ok: true });
  });

  socket.on('poll:create', ({ group, q, options } = {}, cb) => {
    cb = typeof cb === 'function' ? cb : () => {};
    const g = db.groups[group];
    if (!me || !g || !g.members.includes(me)) return;
    if (g.announce && !isAdmin(g, me)) return cb({ error: 'Only admins can send messages in this group.' });
    q = String(q || '').trim().slice(0, 200);
    const opts = [...new Set((Array.isArray(options) ? options : []).map((o) => String(o).trim().slice(0, 80)).filter(Boolean))].slice(0, 6);
    if (!q || opts.length < 2) return cb({ error: 'A poll needs a question and at least 2 different options.' });
    const m = { id: db.nextId++, from: me, to: null, group, text: '', file: null, replyTo: null, expires: g.ttl ? Date.now() + g.ttl * 1000 : null, ts: Date.now(), status: null, poll: { q, options: opts.map((t) => ({ t, votes: [] })), closed: false } };
    if (g.stage) m.tg = stageTagOf(commOf(g), me);
    db.messages.push(m); save(); emitTo(g.members, 'message', m);
  });
  socket.on('poll:vote', ({ id, option } = {}) => {
    const m = db.messages.find((x) => x.id === id), g = m && m.poll && db.groups[m.group];
    if (!me || !g || !g.members.includes(me) || m.poll.closed || !visible(g, me, m) || !m.poll.options[option]) return;
    const had = m.poll.options[option].votes.includes(me);
    m.poll.options.forEach((o) => (o.votes = o.votes.filter((n) => n !== me)));
    if (!had) m.poll.options[option].votes.push(me);
    save(); emitTo(g.members, 'message:update', m);
  });
  socket.on('poll:close', ({ id } = {}) => {
    const m = db.messages.find((x) => x.id === id);
    if (!me || !m || !m.poll || m.from !== me || m.poll.closed) return;
    m.poll.closed = true; save(); emitTo(audienceOf(m), 'message:update', m);
  });

  socket.on('block:set', ({ name, blocked: on } = {}) => {
    const u = find(name);
    if (!me || !u || u.name === me || typeof on !== 'boolean') return;
    const list = (db.blocks[me] ||= []), i = list.indexOf(u.name);
    if (on && i < 0) list.push(u.name);
    if (!on && i >= 0) list.splice(i, 1);
    save(); emitTo([me], 'blocks', list);
    [me, u.name].forEach((n) => emitTo([n], 'statuses', statusesFor(n))); // blocking hides statuses both ways
  });

  // "Delete chat" hides everything up to now for this user only
  socket.on('chat:clear', ({ to, group } = {}) => {
    if (!me) return;
    const other = find(to);
    if (group ? !(db.groups[group] && db.groups[group].members.includes(me)) : !other) return;
    const key = group ? 'g:' + group : 'u:' + other.name, upTo = db.nextId - 1;
    (db.cleared[me] ||= {})[key] = upTo;
    const r = (db.reads[me] ||= {}); r[key] = Math.max(r[key] || 0, upTo);
    save(); emitTo([me], 'cleared', { key, upTo });
  });

  socket.on('once:open', ({ id } = {}, cb) => {
    if (typeof cb !== 'function' || !me) return;
    const m = db.messages.find((x) => x.id === id), gone = { error: 'This media is no longer available.' };
    if (!m || !m.once || !m.file || !m.file.url || m.drop || m.from === me || isDel(m, me) || !audienceOf(m).includes(me)) return cb(gone);
    if (m.group && !visible(db.groups[m.group], me, m)) return cb(gone);
    const views = (m.views ||= {}), used = views[me] || 0, max = m.maxViews || 1;
    if (used >= max) return cb({ error: 'You have used all the views of this.' });
    views[me] = used + 1; m.lastView = Date.now();
    const tok = crypto.randomBytes(16).toString('hex');
    onceTokens.set(tok, { file: path.basename(m.file.url), exp: Date.now() + 120000 });
    setTimeout(() => onceTokens.delete(tok), 121000);
    save(); emitTo(audienceOf(m), 'message:update', m);
    cb({ url: '/once/' + tok, type: m.file.type, left: max - views[me] });
  });

  // Emoji reactions: tap again to remove yours
  socket.on('react', ({ id, emoji } = {}) => {
    const m = db.messages.find((x) => x.id === id);
    if (!me || !m || m.system || m.drop || isDel(m, me) || typeof emoji !== 'string' || emoji.length > 8 || !/\p{Extended_Pictographic}/u.test(emoji)) return;
    const people = audience(m);
    if (!people.includes(me) || (m.group && !visible(db.groups[m.group], me, m))) return;
    if (!m.group) { const other = people.find((n) => n !== me); if (blocked(me, other) || blocked(other, me)) return; }
    const r = (m.reactions ||= {});
    if (!r[emoji] && Object.keys(r).length >= 12) return;
    const list = (r[emoji] ||= []), i = list.indexOf(me);
    if (i >= 0) list.splice(i, 1); else list.push(me);
    if (!list.length) delete r[emoji];
    if (!Object.keys(r).length) delete m.reactions;
    save(); emitTo(people, 'message:update', m);
  });

  socket.on('status:post', ({ kind, text, bg, caption, file, aud, hours, limit } = {}, cb) => {
    cb = typeof cb === 'function' ? cb : () => {};
    if (!me) return;
    if (db.statuses.filter((s) => s.from === me).length >= 30) return cb({ error: 'You have too many active statuses. Delete one first.' });
    const st = { id: db.nextId++, from: me, kind: kind === 'image' ? 'image' : 'text', text: '', bg: Math.max(0, Math.min(7, Number(bg) | 0)), caption: '', file: null, ts: Date.now(), viewers: [] };
    const hrs = [24, 48, 72, 120, 168].includes(Number(hours)) ? Number(hours) : 24; // lasts 24 hours up to 7 days
    st.exp = st.ts + (hrs === 24 ? STATUS_MS : hrs * 3600000);
    st.maxViews = [1, 2, 3, 5].includes(Number(limit)) ? Number(limit) : 0; st.counts = {}; // 0 = unlimited views
    const mode = ['all', 'except', 'only'].includes(aud && aud.mode) ? aud.mode : 'all';
    const list = [...new Set((aud && Array.isArray(aud.list) ? aud.list : []).map(find).filter(Boolean).map((u) => u.name).filter((n) => n !== me))].slice(0, 200);
    if (mode !== 'all' && !list.length) return cb({ error: 'Pick at least one person.' });
    st.aud = mode === 'all' ? { mode, list: [] } : { mode, list };
    if (st.kind === 'text') {
      st.text = String(text || '').trim().slice(0, 300);
      if (!st.text) return cb({ error: 'Type something for your status.' });
    } else {
      if (!file || !IMG[file.type]) return cb({ error: 'Choose a PNG, JPG, GIF or WebP photo.' });
      const buf = Buffer.from(String(file.data || ''), 'base64');
      if (!buf.length || buf.length > 10e6) return cb({ error: 'Photo must be under 10 MB.' });
      if (!sniffOk(file.type, buf)) return cb({ error: BAD_FILE });
      const fid = crypto.randomBytes(16).toString('hex');
      fs.writeFileSync(path.join(UP, fid + '.' + IMG[file.type]), buf);
      st.file = { url: '/uploads/' + fid + '.' + IMG[file.type], type: file.type, size: buf.length };
      st.caption = String(caption || '').trim().slice(0, 200);
    }
    find(me).statusAud = st.aud; find(me).statusDef = { hours: hrs, limit: st.maxViews }; // remembered as your next default
    if (st.maxViews && st.file) onceNames.add(path.basename(st.file.url)); // limited photos are only served through short-lived links
    db.statuses.push(st); save();
    Object.values(db.users).forEach((u) => statusVisible(st, u.name) && emitTo([u.name], 'status:new', statusFor(st, u.name)));
    cb({ id: st.id });
  });
  // Open a status: counts one view for limited statuses and returns the content
  socket.on('status:open', ({ id } = {}, cb) => {
    if (typeof cb !== 'function' || !me) return;
    const st = db.statuses.find((s) => s.id === id);
    if (!st || st.from === me || !statusVisible(st, me)) return cb({ error: 'This status is no longer available.' });
    const counts = (st.counts ||= {}), used = counts[me] || 0;
    if (st.maxViews && used >= st.maxViews) return cb({ error: 'You have used all your views of this status.' });
    counts[me] = used + 1;
    let v = st.viewers.find((x) => x.name === me); if (!v) st.viewers.push(v = { name: me, ts: Date.now() }); v.n = counts[me];
    save(); emitTo([st.from], 'status:update', statusFor(st, st.from)); emitTo([me], 'status:update', statusFor(st, me));
    let url = null;
    if (st.file && st.maxViews) {
      const tok = crypto.randomBytes(16).toString('hex');
      onceTokens.set(tok, { file: path.basename(st.file.url), exp: Date.now() + 120000 }); setTimeout(() => onceTokens.delete(tok), 121000);
      url = '/once/' + tok;
    } else if (st.file) url = st.file.url;
    cb({ kind: st.kind, text: st.text, caption: st.caption, bg: st.bg, url, left: st.maxViews ? st.maxViews - counts[me] : null });
  });
  socket.on('status:mute', ({ name, muted } = {}) => {
    const u = find(name);
    if (!me || !u || u.name === me || typeof muted !== 'boolean') return;
    const p = (db.prefs[me] ||= { pinned: [], muted: [] }), list = (p.statusMuted ||= []), i = list.indexOf(u.name);
    if (muted && i < 0) list.push(u.name);
    if (!muted && i >= 0) list.splice(i, 1);
    save(); emitTo([me], 'prefs', p);
  });
  socket.on('status:view', ({ id } = {}) => {
    const st = db.statuses.find((s) => s.id === id);
    if (!me || !st || st.from === me || st.maxViews || !statusVisible(st, me) || st.viewers.some((v) => v.name === me)) return;
    st.viewers.push({ name: me, ts: Date.now() }); save();
    emitTo([st.from], 'status:update', statusFor(st, st.from)); emitTo([me], 'status:update', statusFor(st, me));
  });
  socket.on('status:delete', ({ id } = {}) => {
    const i = db.statuses.findIndex((s) => s.id === id && s.from === me);
    if (!me || i < 0) return;
    const [st] = db.statuses.splice(i, 1);
    if (st.file) { fs.unlink(path.join(UP, path.basename(st.file.url)), () => {}); onceNames.delete(path.basename(st.file.url)); }
    save(); io.emit('status:gone', { ids: [st.id] });
  });

  // Forward a message to up to 5 chats. Files are copied, so deleting the original never breaks the copies.
  socket.on('forward', ({ id, targets } = {}, cb) => {
    cb = typeof cb === 'function' ? cb : () => {};
    const src = db.messages.find((x) => x.id === id), no = { error: 'This message cannot be forwarded.' };
    if (!me || !src || src.system || src.poll || src.once || src.drop || isDel(src, me) || (db.hidden[me] || {})[src.id] || !audience(src).includes(me)) return cb(no);
    if (src.group && !visible(db.groups[src.group], me, src)) return cb(no);
    const list = (Array.isArray(targets) ? targets : []).slice(0, 5);
    if (!list.length) return cb({ error: 'Pick where to send it.' });
    let b64 = null;
    if (src.file) {
      if (!src.file.url) return cb({ error: 'The file is no longer available.' });
      try { b64 = fs.readFileSync(path.join(UP, path.basename(src.file.url))).toString('base64'); } catch (e) { return cb({ error: 'The file is no longer available.' }); }
    }
    let sent = 0;
    list.forEach((t) => {
      const before = db.messages.length;
      onMessage({ ...(t && t.group ? { group: String(t.group) } : { to: t && t.to }), text: src.text, forwarded: true, file: src.file ? { name: src.file.name, type: src.file.type, wave: src.file.wave, dur: src.file.dur, data: b64 } : undefined }, () => {});
      if (db.messages.length > before) sent++;
    });
    cb({ sent, total: list.length });
  });

  // ---- World communities ----
  const cbOf = (cb) => (typeof cb === 'function' ? cb : () => {});
  const NOADMIN = 'Only a community admin can do that.', NOAUTO = 'Only the auto admin can do that.';
  const cleanName = (s) => String(s || '').trim().replace(/\s+/g, ' ').slice(0, 30);
  const nameTaken = (name, except) => Object.values(db.communities).some((c) => c.id !== except && c.name.toLowerCase() === name.toLowerCase());
  socket.on('community:create', ({ name } = {}, cb) => {
    cb = cbOf(cb); if (!me) return;
    name = cleanName(name);
    if (name.length < 2) return cb({ error: 'Give your community a name (at least 2 characters).' });
    if (nameTaken(name)) return cb({ error: 'A community with that name already exists.' });
    if (Object.values(db.communities).filter((c) => c.owner === me && !c.builtin).length >= 3) return cb({ error: 'You can create up to 3 communities.' });
    const c = newCommunity(name, me);
    save();
    emitTo([me], 'group', db.groups[c.lounge]); emitTo([me], 'group', db.groups[c.stage]);
    sysMsg(db.groups[c.lounge], me + ' created this community');
    pushComm(); cb({ ok: true, id: c.id });
  });
  socket.on('community:join', ({ id } = {}, cb) => {
    cb = cbOf(cb); const c = cm(id);
    if (!me || !c || c.builtin) return cb({ error: 'Community not found.' });
    if (c.banned.includes(me)) return cb({ error: 'You were removed from this community.' });
    if (!c.members.includes(me)) c.members.push(me);
    refreshComm(c); sendCommHistory(c, me);
    sysMsg(db.groups[c.lounge], me + ' joined');
    cb({ ok: true });
  });
  socket.on('community:leave', ({ id } = {}, cb) => {
    cb = cbOf(cb); const c = cm(id);
    if (!me || !c || c.builtin || !c.members.includes(me)) return cb({ error: 'You are not in this community.' });
    if (isOwner(c, me)) return cb({ error: 'You created this community, so you cannot leave it. Delete it instead.' });
    c.members = c.members.filter((n) => n !== me);
    refreshComm(c, [me]);
    sysMsg(db.groups[c.lounge], me + ' left');
    cb({ ok: true });
  });
  socket.on('community:group:add', ({ cid, id } = {}, cb) => {
    cb = cbOf(cb); const c = cm(cid), g = db.groups[id];
    if (!me || !c || !g || g.world || g.stage || !isAdmin(g, me)) return cb({ error: 'Only a group admin can add the group to a community.' });
    if (!inComm(c, me)) return cb({ error: 'Join the community first.' });
    if (!c.groups.includes(id)) { c.groups.push(id); sysMsg(g, me + ' added this group to ' + c.name); }
    refreshComm(c); cb({ ok: true });
  });
  socket.on('community:group:remove', ({ cid, id } = {}, cb) => {
    cb = cbOf(cb); const c = cm(cid), g = db.groups[id];
    if (!me || !c || !g || !c.groups.includes(id) || !(isCA(c, me) || isAdmin(g, me))) return cb({ error: 'Only a group admin or a community admin can do that.' });
    c.groups = c.groups.filter((x) => x !== id);
    sysMsg(g, me + ' removed this group from ' + c.name);
    refreshComm(c); cb({ ok: true });
  });
  // An admin removes a person from one of the community's groups
  socket.on('community:group:kick', ({ cid, group, name } = {}, cb) => {
    cb = cbOf(cb); const c = cm(cid), g = db.groups[group], u = find(name);
    if (!me || !c || !isCA(c, me)) return cb({ error: NOADMIN });
    if (!g || !c.groups.includes(g.id) || !u || !g.members.includes(u.name)) return cb({ error: 'That person is not in this group.' });
    if (u.name === me) return cb({ error: 'Use Leave group to remove yourself.' });
    if (isOwner(c, u.name)) return cb({ error: 'The auto admin cannot be removed.' });
    if (isCA(c, u.name) && !isOwner(c, me)) return cb({ error: 'Only the auto admin can remove another admin.' });
    g.members = g.members.filter((n) => n !== u.name); g.admins = (g.admins || []).filter((n) => n !== u.name);
    if (g.owner === u.name) g.owner = g.members[0] || '';
    if (!g.members.length) delete db.groups[g.id];
    else { emitTo(g.members, 'group', g); sysMsg(g, u.name + ' was removed from the group by ' + me + ' (community admin)'); }
    save(); emitTo([u.name], 'group:removed', g.id);
    refreshComm(c); cb({ ok: true });
  });
  // An admin removes (and bans) a person from the whole community: lounge, Main Stage and speaker status
  socket.on('community:kick', ({ cid, name } = {}, cb) => {
    cb = cbOf(cb); const c = cm(cid), u = find(name);
    if (!me || !c || !isCA(c, me)) return cb({ error: NOADMIN });
    if (!u || !inComm(c, u.name)) return cb({ error: 'That person is not in the community.' });
    if (u.name === me) return cb({ error: 'You cannot remove yourself.' });
    if (isOwner(c, u.name)) return cb({ error: 'The auto admin cannot be removed.' });
    if (isCA(c, u.name) && !isOwner(c, me)) return cb({ error: 'Only the auto admin can remove another admin.' });
    if (!c.banned.includes(u.name)) c.banned.push(u.name);
    c.members = c.members.filter((n) => n !== u.name); c.admins = c.admins.filter((n) => n !== u.name);
    refreshComm(c, [u.name]);
    sysMsg(db.groups[c.lounge], u.name + ' was removed from the community by ' + me);
    cb({ ok: true });
  });
  socket.on('community:unban', ({ cid, name } = {}, cb) => {
    cb = cbOf(cb); const c = cm(cid), u = find(name);
    if (!me || !c || !isCA(c, me)) return cb({ error: NOADMIN });
    if (!u || !c.banned.includes(u.name)) return cb({ error: 'That person is not removed.' });
    c.banned = c.banned.filter((n) => n !== u.name);
    refreshComm(c);
    if (c.builtin) sendCommHistory(c, u.name); // they are back in automatically; other communities: they can join again
    cb({ ok: true });
  });
  socket.on('community:speaker', ({ cid, name, group, on } = {}, cb) => {
    cb = cbOf(cb); const c = cm(cid), u = find(name), g = db.groups[group];
    if (!me || !c || !isCA(c, me)) return cb({ error: NOADMIN });
    if (!u) return cb({ error: 'No such user.' });
    const sg = db.groups[c.stage];
    if (on === false) {
      if (c.speakers[u.name]) { delete c.speakers[u.name]; sysMsg(sg, u.name + ' is no longer a speaker'); }
    } else {
      if (!g || !c.groups.includes(g.id) || !g.members.includes(u.name) || !inComm(c, u.name)) return cb({ error: 'The person must be in the community and in a group that is part of it.' });
      c.speakers[u.name] = g.id; sysMsg(sg, u.name + ' can now speak on the Main Stage for ' + g.name);
    }
    refreshComm(c); cb({ ok: true });
  });
  // Only the auto admin adds / removes admins
  socket.on('community:admin', ({ cid, name, on } = {}, cb) => {
    cb = cbOf(cb); const c = cm(cid), u = find(name);
    if (!me || !c || !isOwner(c, me)) return cb({ error: NOAUTO });
    if (!u) return cb({ error: 'No such user.' });
    if (u.name === c.owner) return cb({ error: 'The auto admin is always an admin.' });
    const lg = db.groups[c.lounge];
    if (on === false) {
      if (!c.admins.includes(u.name)) return cb({ error: u.name + ' is not an admin.' });
      c.admins = c.admins.filter((x) => x !== u.name);
      sysMsg(lg, u.name + ' is no longer an admin');
    } else if (!c.admins.includes(u.name)) {
      if (!inComm(c, u.name)) return cb({ error: u.name + ' has to be in the community first.' });
      c.admins.push(u.name);
      sysMsg(lg, u.name + ' is now an admin');
    }
    refreshComm(c); cb({ ok: true });
  });
  socket.on('community:rename', ({ cid, name } = {}, cb) => {
    cb = cbOf(cb); const c = cm(cid);
    if (!me || !c || !isOwner(c, me)) return cb({ error: NOAUTO });
    if (c.builtin) return cb({ error: 'This community always keeps its name.' });
    name = cleanName(name);
    if (name.length < 2) return cb({ error: 'Give the community a name (at least 2 characters).' });
    if (nameTaken(name, c.id)) return cb({ error: 'A community with that name already exists.' });
    c.name = name; db.groups[c.lounge].name = '💬 ' + name; db.groups[c.stage].name = '🎤 ' + name + ' · Main Stage';
    refreshComm(c); cb({ ok: true });
  });
  socket.on('community:delete', ({ cid } = {}, cb) => {
    cb = cbOf(cb); const c = cm(cid);
    if (!me || !c || !isOwner(c, me)) return cb({ error: NOAUTO });
    if (c.builtin) return cb({ error: 'The built-in community cannot be deleted.' });
    const ids = [c.lounge, c.stage], members = commMembers(c);
    db.messages.filter((m) => ids.includes(m.group)).forEach((m) => m.file && m.file.url && fs.unlink(path.join(UP, path.basename(m.file.url)), () => {}));
    db.messages = db.messages.filter((m) => !ids.includes(m.group));
    ids.forEach((id) => { delete db.groups[id]; });
    delete db.communities[c.id];
    save(); ids.forEach((id) => emitTo(members, 'group:removed', id));
    pushComm(); cb({ ok: true });
  });

  // ---- Chat lock: a separate password (never the login password) that must be entered to open locked chats ----
  const lockWait = () => blockedFor('lk:' + me);
  const lockFail = () => hit('lk:' + me, 6, 15 * MIN, 15 * MIN);
  socket.on('lock:setup', async ({ pass, old, acct } = {}, cb) => {
    cb = cbOf(cb); if (!me) return; const u = find(me); pass = String(pass || '');
    if (lockWait()) return cb({ error: waitMsg(lockWait()) });
    if (pass.length < 4 || pass.length > 100) return cb({ error: 'The lock password must be 4 to 100 characters.' });
    try {
      if (u.lockHash) { // changing it: current lock password, or the login password if it was forgotten
        const ok = (old && await sameHash(String(old).slice(0, 200), u.lockSalt, u.lockHash)) || (acct && await sameHash(String(acct).slice(0, 200), u.salt, u.hash));
        if (!ok) { lockFail(); return cb({ error: 'Wrong current lock password (you can also enter your login password).' }); }
      }
      if (await sameHash(pass, u.salt, u.hash)) return cb({ error: 'The lock password must be different from your login password.' });
      u.lockSalt = crypto.randomBytes(16).toString('hex'); u.lockHash = (await hashA(pass, u.lockSalt)).toString('hex');
      hits.delete('lk:' + me); save(); emitTo([me], 'settings', settingsFor(me)); cb({ ok: true });
    } catch (e) { cb({ error: 'Server is busy. Try again.' }); }
  });
  socket.on('lock:verify', async ({ pass } = {}, cb) => {
    cb = cbOf(cb); if (!me) return; const u = find(me);
    if (lockWait()) return cb({ error: waitMsg(lockWait()) });
    try {
      if (!u.lockHash || !(await sameHash(String(pass || '').slice(0, 100), u.lockSalt, u.lockHash))) { lockFail(); return cb({ error: 'Wrong lock password.' }); }
      hits.delete('lk:' + me); cb({ ok: true });
    } catch (e) { cb({ error: 'Server is busy. Try again.' }); }
  });
  socket.on('lock:chat', async ({ key, on, pass } = {}, cb) => {
    cb = cbOf(cb); if (!me) return; const u = find(me); key = String(key || '');
    if (!/^[ug]:[A-Za-z0-9_]{1,20}$/.test(key) || (key[0] === 'g' && (db.groups[key.slice(2)] || {}).world)) return cb({ error: 'This chat cannot be locked.' });
    const p = (db.prefs[me] ||= { pinned: [], muted: [] }); p.locked ||= [];
    if (on) {
      if (!u.lockHash) return cb({ error: 'Create a lock password first.' });
      if (!p.locked.includes(key)) p.locked.push(key);
    } else {
      if (lockWait()) return cb({ error: waitMsg(lockWait()) });
      try {
        if (!u.lockHash || !(await sameHash(String(pass || '').slice(0, 100), u.lockSalt, u.lockHash))) { lockFail(); return cb({ error: 'Wrong lock password.' }); }
      } catch (e) { return cb({ error: 'Server is busy. Try again.' }); }
      hits.delete('lk:' + me); p.locked = p.locked.filter((x) => x !== key);
    }
    save(); emitTo([me], 'prefs', p); cb({ ok: true });
  });

  socket.on('logout', () => { if (myToken) { delete db.tokens[sha(myToken)]; save(); } });
  socket.on('disconnect', () => { if (!me) return; if (!online(me)) { find(me).lastSeen = Date.now(); save(); } io.emit('users', userList()); });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Chat running at http://localhost:${PORT}`));
