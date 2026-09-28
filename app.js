/* 短劇場 demo — feed / library / coins / history (localStorage only) */
const DRAMAS = [
 {id:'18', title:'李子熟了', genre:'古裝甜寵', dur:'1:21', secs:81, free:true,
  desc:'樹梢上的少女，書生樹下的守候。一顆青李子的甜，引出一段心動的古裝小甜劇。'},
 {id:'33', title:'一錘定音', genre:'武俠動作', dur:'1:59', secs:119, free:true,
  desc:'流星錘破空而出，江湖恩仇一錘了斷。短短兩分鐘，拳拳到肉的武俠快感。'},
 {id:'45', title:'張果老點化', genre:'神話傳說', dur:'4:15', secs:255, free:true,
  desc:'八仙之一張果老，紙馬一點即化生。仙凡之間，一場關於緣分的神話短劇。'},
 {id:'4c', title:'鐵甲牛魔', genre:'玄幻', dur:'4:11', secs:251, free:false,
  desc:'披甲巨獸踏破山門，煞氣沖天。玄幻巨製，帶你進入妖獸橫行的異世界。'},
 {id:'4d', title:'神獸小廚神', genre:'美食玄幻', dur:'4:04', secs:244, free:false,
  desc:'白毛神獸親自掌勺，小精靈跑堂打下手。一場奇幻又治癒的深夜食堂。'},
 {id:'63', title:'雖遠必誅', genre:'歷史戰爭', dur:'5:22', secs:322, free:false,
  desc:'長城烽火連天，將軍橫刀立馬：「明犯強漢者，雖遠必誅！」熱血歷史戰爭短劇。'},
 {id:'76', title:'喂，大橘2', genre:'AI武俠', dur:'3:14', secs:194, free:false,
  desc:'肥橘大俠重出江湖，提壺仗劍走天涯。AI 生成武俠喜劇，笑中帶淚。'},
 {id:'8b', title:'妹妹', genre:'親情催淚', dur:'6:41', secs:401, free:false,
  desc:'「希望妹妹能救他們」——一場關於親情與守護的催淚短劇，請準備紙巾。'},
 {id:'e3', title:'動漫回憶殺', genre:'懷舊', dur:'5:03', secs:303, free:false,
  desc:'1993 到 2026，從龍珠到鬼滅，一代人的動漫青春，都在這五分鐘裡。'},
 {id:'ef', title:'大聖一棒', genre:'西遊玄幻', dur:'4:03', secs:243, free:false,
  desc:'「休走，吃俺老孫一棒！」金甲大聖踏浪而來，西遊玄幻燃爆全場。'},
];
const COST = 10, START_COINS = 100, DAILY = 50;
const $ = s => document.querySelector(s);
const store = {
  get(k, d){ try{ const v = localStorage.getItem('sd_'+k); return v===null?d:JSON.parse(v);}catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem('sd_'+k, JSON.stringify(v)); }catch(e){} }
};
let coins = store.get('coins', START_COINS);
let unlocked = store.get('unlocked', DRAMAS.filter(d=>d.free).map(d=>d.id));
let likes = store.get('likes', {});
let hist = store.get('hist', []);
const isLocked = id => !unlocked.includes(id);
const byId = id => DRAMAS.find(d=>d.id===id);

function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove('show'), 1800);
}
function saveCoins(){ store.set('coins', coins);
  $('#coinNum').textContent = coins; $('#coinNum2').textContent = coins; }
function fmtT(s){ return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'); }

/* ---------- feed ---------- */
function buildFeed(){
  const feed = $('#feed'); feed.innerHTML = '';
  DRAMAS.forEach(d=>{
    const locked = isLocked(d.id);
    const el = document.createElement('div');
    el.className = 'slide' + (locked?' locked':'');
    el.dataset.id = d.id;
    el.innerHTML = `
      <video playsinline webkit-playsinline loop preload="none" poster="posters/${d.id}.jpg"
        ${locked?'':'data-src="videos/'+d.id+'.mp4"'}></video>
      <div class="shade"></div>
      ${locked?`<div class="lockbox">
          <div class="ico">🔒</div><h3>${d.title}</h3>
          <p>${d.genre} · ${d.dur}<br>解鎖後即可完整觀看本集</p>
          <button class="unlock-btn" data-unlock="${d.id}">🪙 ${COST} 金幣解鎖</button>
        </div>`:''}
      <div class="playhint">▶</div>
      <div class="meta">
        <span class="genre">${d.genre}</span>
        <h2>${d.title}</h2><p>${d.desc}</p>
      </div>
      <div class="side">
        <button class="abtn ${likes[d.id]?'liked':''}" data-like="${d.id}">❤<small>${likes[d.id]?'1':''}</small></button>
        <button class="abtn" data-info="${d.id}">ⓘ<small>詳情</small></button>
      </div>
      <div class="progress"><i></i></div>`;
    feed.appendChild(el);
  });
  // events (delegate)
  feed.onclick = e=>{
    const un = e.target.closest('[data-unlock]');
    if(un){ unlockDrama(un.dataset.unlock); return; }
    const lk = e.target.closest('[data-like]');
    if(lk){ const id = lk.dataset.like;
      if(likes[id]) delete likes[id]; else likes[id]=1;
      store.set('likes', likes);
      lk.classList.toggle('liked', !!likes[id]);
      lk.querySelector('small').textContent = likes[id]?'1':'';
      return; }
    const inf = e.target.closest('[data-info]');
    if(inf){ openDetail(inf.dataset.info); return; }
    const slide = e.target.closest('.slide');
    if(slide && !isLocked(slide.dataset.id)){
      const v = slide.querySelector('video');
      const hint = slide.querySelector('.playhint');
      if(v.paused){ v.play(); hint.classList.remove('show'); }
      else{ v.pause(); hint.classList.add('show'); setTimeout(()=>hint.classList.remove('show'),600); }
    }
  };
  // autoplay visible
  const io = new IntersectionObserver(es=>{
    es.forEach(en=>{
      const v = en.target.querySelector('video');
      const bar = en.target.querySelector('.progress i');
      if(en.isIntersecting && en.intersectionRatio > .6){
        if(!isLocked(en.target.dataset.id)){
          if(!v.src && v.dataset.src) v.src = v.dataset.src;
          v.play().catch(()=>{});
          pushHist(en.target.dataset.id);
        }
      } else { v.pause(); if(bar) bar.style.width='0'; }
    });
  },{root:feed, threshold:[0,.6]});
  document.querySelectorAll('.slide').forEach(s=>io.observe(s));
  // progress bars
  feed.addEventListener('timeupdate', e=>{
    const v = e.target, s = v.closest('.slide');
    if(s && v.duration) s.querySelector('.progress i').style.width = (v.currentTime/v.duration*100)+'%';
  }, true);
}
function pushHist(id){
  hist = [id, ...hist.filter(h=>h!==id)].slice(0,20);
  store.set('hist', hist); renderMe();
}
function unlockDrama(id){
  const d = byId(id);
  if(!isLocked(id)) return;
  if(coins < COST){ toast('金幣不足，先去「我的」領取金幣'); return; }
  coins -= COST; unlocked.push(id);
  store.set('unlocked', unlocked); saveCoins();
  toast(`已解鎖《${d.title}》`);
  buildFeed(); renderLib(); renderMe();
}

/* ---------- library ---------- */
let curGenre = '全部';
function renderLib(){
  const genres = ['全部', ...new Set(DRAMAS.map(d=>d.genre))];
  $('#chips').innerHTML = genres.map(g=>
    `<button class="chip ${g===curGenre?'on':''}" data-g="${g}">${g}</button>`).join('');
  const list = DRAMAS.filter(d=>curGenre==='全部'||d.genre===curGenre);
  $('#grid').innerHTML = list.map(d=>`
    <div class="card" data-open="${d.id}">
      <div class="pv"><img loading="lazy" src="posters/${d.id}.jpg" alt="">
        ${isLocked(d.id)?`<span class="lk">🔒 ${COST}🪙</span>`:''}
        <span class="dur">${d.dur}</span></div>
      <div class="t"><h3>${d.title}</h3><span>${d.genre}</span></div>
    </div>`).join('');
}
$('#chips').addEventListener('click', e=>{
  const c = e.target.closest('[data-g]');
  if(c){ curGenre = c.dataset.g; renderLib(); }
});
$('#grid').addEventListener('click', e=>{
  const c = e.target.closest('[data-open]');
  if(c) openDetail(c.dataset.open);
});
function openDetail(id){
  const d = byId(id), locked = isLocked(id);
  $('#sheet').innerHTML = `
    <button class="x" id="mclose">✕</button>
    <img src="posters/${id}.jpg" alt="">
    <div class="in">
      <span class="genre">${d.genre}</span>
      <h2>${d.title}</h2><div class="du">片長 ${d.dur} · 短劇場演示版</div>
      <p class="d">${d.desc}</p>
      ${locked
        ? `<button class="bigbtn unlock" id="mact">🪙 ${COST} 金幣解鎖本集</button>`
        : `<button class="bigbtn play" id="mact">▶ 立即播放</button>`}
    </div>`;
  $('#modal').classList.add('on');
  $('#mclose').onclick = ()=> $('#modal').classList.remove('on');
  $('#mact').onclick = ()=>{
    $('#modal').classList.remove('on');
    if(isLocked(id)) unlockDrama(id);
    else playInFeed(id);
  };
}
$('#modal').addEventListener('click', e=>{
  if(e.target.id==='modal') e.target.classList.remove('on');
});
function playInFeed(id){
  switchView('feed');
  requestAnimationFrame(()=>{
    const s = document.querySelector(`.slide[data-id="${id}"]`);
    if(s) s.scrollIntoView({behavior:'smooth'});
  });
}

/* ---------- me ---------- */
function renderMe(){
  const ul = $('#unlockedList');
  ul.innerHTML = unlocked.length
    ? unlocked.map(id=>{ const d=byId(id); return `
      <div class="hrow" data-open="${id}">
        <img src="posters/${id}.jpg" alt="">
        <div class="tt">${d.title}<span>${d.genre} · ${d.dur}</span></div>
      </div>`;}).join('')
    : `<div class="empty">暫未解鎖任何劇集</div>`;
  const hl = $('#histList');
  hl.innerHTML = hist.length
    ? hist.map(id=>{ const d=byId(id); if(!d) return ''; return `
      <div class="hrow" data-open="${id}">
        <img src="posters/${id}.jpg" alt="">
        <div class="tt">${d.title}<span>${d.genre} · ${d.dur}</span></div>
      </div>`;}).join('')
    : `<div class="empty">暫無觀看記錄</div>`;
  // daily claim state
  const today = new Date().toISOString().slice(0,10);
  const btn = $('#claimBtn');
  if(store.get('claim', '') === today){ btn.disabled = true; btn.textContent = '今日已領取'; }
  else { btn.disabled = false; btn.textContent = `每日領取 +${DAILY}`; }
}
$('#unlockedList').addEventListener('click', e=>{
  const r = e.target.closest('[data-open]'); if(r) openDetail(r.dataset.open);
});
$('#histList').addEventListener('click', e=>{
  const r = e.target.closest('[data-open]'); if(r) openDetail(r.dataset.open);
});
$('#claimBtn').onclick = ()=>{
  const today = new Date().toISOString().slice(0,10);
  if(store.get('claim','') === today) return;
  store.set('claim', today); coins += DAILY; saveCoins(); renderMe();
  toast(`+${DAILY} 金幣已到帳`);
};

/* ---------- tabs ---------- */
function switchView(v){
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on', x.dataset.v===v));
  const map = {feed:'#view-feed', lib:'#view-lib', me:'#view-me'};
  $(map[v]).classList.add('on');
  if(v==='me') renderMe();
  if(v==='lib') renderLib();
  if(v==='feed') document.querySelectorAll('#feed video').forEach(x=>x.pause());
}
document.querySelectorAll('.tab').forEach(t=> t.onclick = ()=>switchView(t.dataset.v));

/* init */
saveCoins(); buildFeed(); renderLib(); renderMe();
