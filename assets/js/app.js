// Öneriler + arama + vitrin + sesli/görsel arama

const STORAGE_KEY_HISTORY = "fae_search_history";
const MAX_SUGGEST = 8;

const $ = sel => document.querySelector(sel);

function getHistory(){ return JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || "[]"); }
function saveHistory(q){
  if(!q) return;
  const set = new Set(getHistory());
  set.add(q.trim());
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify([...set].slice(-20)));
}

/* ---- Vitrin render (4 kart) ---- */
window.renderLocalizedShowcase = function(items){
  const grid = $("#grid");
  grid.innerHTML = "";
  (items||[]).slice(0,4).forEach(x=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${x.t}</h3>
      <p>${x.d}</p>
      <div class="meta">${x.meta||""}</div>
    `;
    grid.appendChild(card);
  });
};

/* ---- Arama + öneriler ---- */
const input = $("#searchInput");
const suggestList = $("#suggestList");
const searchBtn = $("#searchBtn");

function showSuggestions(q){
  const data = getHistory().filter(x=>x.toLowerCase().includes(q.toLowerCase()));
  suggestList.innerHTML = "";
  if (!q || data.length===0){ suggestList.hidden = true; return; }
  data.slice(-MAX_SUGGEST).reverse().forEach(item=>{
    const li = document.createElement("li");
    li.textContent = item;
    li.onclick = ()=>{ input.value=item; suggestList.hidden=true; doSearch(); };
    suggestList.appendChild(li);
  });
  suggestList.hidden = false;
}
let t; input.addEventListener("input", e=>{
  clearTimeout(t); t=setTimeout(()=>showSuggestions(e.target.value), 120);
});
document.addEventListener("click",(e)=>{
  if(!suggestList.contains(e.target) && e.target!==input) suggestList.hidden = true;
});

function doSearch(){
  const q = input.value.trim();
  if(!q) return;
  saveHistory(q);

  // Dil odaklı mevcut liste üzerinden filtre
  const lang = localStorage.getItem("fae_lang") || (navigator.language||"tr").slice(0,2);
  const dict = window.messages[lang] || window.messages.tr;
  const pool = dict.items || [];
  const filt = pool.filter(p => (p.t+" "+p.d+" "+(p.meta||"")).toLowerCase().includes(q.toLowerCase()));
  window.renderLocalizedShowcase(filt.length ? filt.slice(0,4) : (dict.items||[]));
}
searchBtn.addEventListener("click", doSearch);
input.addEventListener("keydown", e=>{ if(e.key==="Enter") doSearch(); });

/* ---- Sesli arama ---- */
$("#voiceBtn").addEventListener("click", ()=>{
  try{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ alert("Tarayıcı sesli aramayı desteklemiyor."); return; }
    const rec = new SR();
    const lang = (localStorage.getItem("fae_lang") || (navigator.language||"tr-TR"));
    rec.lang = lang.length===2 ? (lang+"-"+lang.toUpperCase()) : lang;
    rec.onresult = (e)=>{
      const text = e.results[0][0].transcript;
      input.value = text;
      doSearch();
    };
    rec.onerror = ()=>alert("Mikrofon izni gerekli olabilir.");
    rec.start();
  }catch(err){ alert("Sesli arama kullanılamıyor."); }
});

/* ---- Görsel arama (dosya adından anahtar kelime) ---- */
$("#imageInput").addEventListener("change", (e)=>{
  const file = e.target.files?.[0];
  if(!file) return;
  const guess = file.name.replace(/\.[^/.]+$/,"").replace(/[_-]/g," ");
  if(guess && guess.length>2){ input.value = guess; doSearch(); }
  else { alert("Görsel arama için dosya adından anahtar kelime üretilemedi."); }
});
