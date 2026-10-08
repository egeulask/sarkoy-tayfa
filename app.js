const $=id=>document.getElementById(id);
const intro=$("introScreen"),app=$("app"),home=$("homeScreen"),game=$("gameScreen"),stats=$("statsScreen");
const grid=$("playersGrid"),count=$("selectedCount"),start=$("startBtn"),draw=$("drawBtn"),current=$("currentPlayerBtn"),roundEl=$("roundNumber");
const num=$("number"),resNum=$("resultNumber"),resTitle=$("resultTitle"),resText=$("resultText"),next=$("nextPlayer"),special=$("specialCard");
let selected=[],currentIndex=0,round=1,hasDrawn=false,turnStats={};

const esc=v=>String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const initial=n=>n.slice(0,1).toUpperCase();
function photoHTML(p,cls="player-photo"){return `<div class="${cls}">${p.photo?`<img src="${p.photo}" alt="${esc(p.name)}" onerror="this.style.display='none'">`:""}<div class="photo-placeholder">${initial(p.name)}</div></div>`}
$("enterBtn").onclick=()=>{intro.classList.add("out");app.classList.remove("app-hidden");setTimeout(()=>intro.remove(),850)};
function renderPlayers(){grid.innerHTML=PLAYERS.map((p,i)=>`<button class="player ${selected.includes(i)?"selected":""}" data-i="${i}">${photoHTML(p)}<div class="player-info"><span class="check">✓</span><span class="player-name">${esc(p.name)}</span><span class="player-bio">${esc(p.profile)}</span></div></button>`).join("");
grid.querySelectorAll(".player").forEach(b=>b.onclick=()=>{let i=+b.dataset.i;if(selected.includes(i))selected=selected.filter(x=>x!==i);else selected.push(i);updateSelection();renderPlayers()});
grid.querySelectorAll(".player").forEach(b=>{let i=+b.dataset.i;b.ondblclick=e=>{e.preventDefault();openProfile(i)}})}
function updateSelection(){count.textContent=selected.length;start.disabled=selected.length<2}
function showScreen(s){[home,game,stats].forEach(x=>x.classList.remove("active"));s.classList.add("active")}
function startGame(){currentIndex=0;round=1;hasDrawn=false;turnStats={};selected.forEach(i=>turnStats[i]=0);showScreen(game);setCurrent();resetResult()}
function setCurrent(){let i=selected[currentIndex];current.textContent=PLAYERS[i].name;roundEl.textContent=round;next.textContent=`Sonraki: ${PLAYERS[selected[(currentIndex+1)%selected.length]].name}`}
function resetResult(){num.textContent="?";resNum.textContent="—";resTitle.textContent="Sayı çekmeye hazır mısın?";resText.textContent="Butona bas ve gecenin ne getireceğini gör.";special.classList.add("hidden");draw.querySelector("span").textContent="SAYI ÇEK";hasDrawn=false}
function drawNumber(){let roll=Math.floor(Math.random()*RULES.length),r=RULES[roll],i=selected[currentIndex];turnStats[i]++;num.textContent=String(roll).padStart(2,"0");resNum.textContent=roll;resTitle.textContent=r.title;resText.textContent=r.text;
if(Math.random()<.16){special.classList.remove("hidden");special.innerHTML=`<strong>GECE KARTI</strong><span>${["Bu tur istediğin bir kişiyi seçebilirsin.","Bir sonraki turu sen başlatıyorsun.","Bu tur pas hakkın var."][Math.floor(Math.random()*3)]}</span>`}else special.classList.add("hidden");
$("numberCard").animate([{transform:"scale(.84) rotate(-8deg)"},{transform:"scale(1.08) rotate(4deg)"},{transform:"scale(1) rotate(0)"}],{duration:520,easing:"cubic-bezier(.2,.8,.2,1)"});draw.querySelector("span").textContent="SONRAKİ OYUNCU";hasDrawn=true}
function nextTurn(){currentIndex=(currentIndex+1)%selected.length;if(currentIndex===0)round++;setCurrent();resetResult()}
draw.onclick=()=>hasDrawn?nextTurn():drawNumber();start.onclick=startGame;$("backBtn").onclick=()=>showScreen(home);current.onclick=()=>openProfile(selected[currentIndex]);
function openProfile(i){let p=PLAYERS[i];$("modalProfileContent").innerHTML=`<div class="profile-content">${photoHTML(p,"profile-photo-large")}<h1>${esc(p.name)}</h1><p>${esc(p.profile)}</p><div class="tags">${p.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div></div>`;$("profileModal").classList.remove("hidden")}
function renderRules(){$("rulesList").innerHTML=RULES.map((r,i)=>`<div class="rule-item"><div class="rule-num">${i}</div><div><strong>${esc(r.title)}</strong><p>${esc(r.text)}</p></div></div>`).join("");$("rulesModal").classList.remove("hidden")}
function renderStats(){let arr=selected.map(i=>({i,score:turnStats[i]||0})).sort((a,b)=>b.score-a.score);$("statsContent").innerHTML=arr.map((x,n)=>`<div class="stat-row"><div class="stat-rank">0${n+1}</div><div><div class="stat-name">${esc(PLAYERS[x.i].name)}</div><div class="stat-detail">çekilen görev</div></div><div class="stat-score">${x.score}</div></div>`).join("");showScreen(stats)}
function finalModal(){let total=Object.values(turnStats).reduce((a,b)=>a+b,0),top=selected.slice().sort((a,b)=>(turnStats[b]||0)-(turnStats[a]||0))[0];$("finalContent").innerHTML=`<div class="final-score">${total}</div><div class="final-sub">Toplam görev çekildi</div><div class="final-grid"><div class="final-item"><span>En çok görev çeken</span><b>${esc(PLAYERS[top].name)}</b></div><div class="final-item"><span>Oyuncu sayısı</span><b>${selected.length}</b></div><div class="final-item"><span>Toplam tur</span><b>${round}</b></div></div>`;$("finalModal").classList.remove("hidden")}
$("statsBtn").onclick=renderStats;$("statsBackBtn").onclick=()=>showScreen(game);$("finishBtn").onclick=finalModal;$("closeFinal").onclick=()=>location.reload();$("rulesBtn").onclick=renderRules;$("closeRules").onclick=()=>$("rulesModal").classList.add("hidden");$("closeProfile").onclick=()=>$("profileModal").classList.add("hidden");document.querySelectorAll(".modal-backdrop").forEach(x=>x.onclick=()=>x.parentElement.classList.add("hidden"));
renderPlayers();updateSelection();
