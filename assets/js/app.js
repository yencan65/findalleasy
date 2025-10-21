/* ===========================
   Yardımcılar
=========================== */
const STORAGE_KEY_HISTORY = "fae_search_history";
const STORAGE_KEY_POPULAR = "fae_popular_cache";
const STORAGE_KEY_POPULAR_DATE = "fae_popular_date";
const MAX_SUGGEST = 8;

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function getHistory(){ return JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY) || "[]"); }
function saveHistory(q){
  if(!q) return;
  const set = new Set(getHistory());
  set.add(q.trim());
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify([...set].slice(-20)));
}

function todayStr(){
  const d = new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}

function userRegion(){
  // Basit bölge tespiti: dil + zaman bölgesi kıtası
  const lang = (navigator.language||"tr-TR");
  const cc = lang.split("-")[1] || ""; // TR, US, DE...
  if(cc) return cc.toUpperCase();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  if(tz.includes("Europe")) return "EU";
  if(tz.includes("America")) return "US";
  if(tz.includes("Asia")) return "AS";
  return "INTL";
}

/* ===========================
   Dönen hizmetler (placeholder rotasyonu)
=========================== */
const SERVICES = [
  "Otel","Bilet","Turlar","Yemek","Moda","Aksesuar","Gayrimenkul","Hediyelik Eşyalar"
];
(function rotatePlaceholder(){
  const input = $("#searchInput");
  let i = 0;
  setInterval(()=>{
    const next = SERVICES[i % SERVICES.length];
    input.setAttribute("placeholder", next);
    i++;
  }, 1800);
})();

/* ===========================
   Bölgesel popüler veri (örnek data kümeleri)
   Not: Görselleri assets/img/pop/*.jpg olarak ekleyebilirsin.
=========================== */
const POPULAR_DATA = {
  TR: [
    {t:"Bodrum Ultra Her Şey Dahil Otel", d:"Yaz sezonu yüksek talep", img:"assets/img/pop/tr-hotel.jpg", meta:"Turizm • Otel"},
    {t:"İstanbul → Paris Uçak Bileti", d:"Avrupa uçuşlarında fırsat", img:"assets/img/pop/tr-flight.jpg", meta:"Ulaşım • Bilet"},
    {t:"Gurme Tadım Menüsü", d:"Şef restoranlarında ilgi artıyor", img:"assets/img/pop/tr-food.jpg", meta:"Yeme-İçme • Menü"},
    {t:"Minimalist Ceket", d:"Sonbahar trendleri", img:"assets/img/pop/tr-coat.jpg", meta:"Moda • Ceket"},
    {t:"Hediyelik El İşleri", d:"Turistik bölgelerde artış", img:"assets/img/pop/tr-gift.jpg", meta:"Hediyelik • El işi"}
  ],
  DE: [
    {t:"Berlin City Hotel", d:"Hafta sonu kaçamakları", img:"assets/img/pop/de-hotel.jpg", meta:"Tourism • Hotel"},
    {t:"Frankfurt → Madrid Flight", d:"Düşen bilet fiyatları", img:"assets/img/pop/de-flight.jpg", meta:"Transport • Flight"},
    {t:"Vegan Menü", d:"Bitki bazlı tercihler yükselişte", img:"assets/img/pop/de-vegan.jpg", meta:"Food • Vegan"},
    {t:"Akıllı Saat", d:"Giyilebilir teknoloji", img:"assets/img/pop/de-watch.jpg", meta:"Electronics • Watch"},
    {t:"Kışlık Mont", d:"Yeni sezon", img:"assets/img/pop/de-coat.jpg", meta:"Fashion • Coat"}
  ],
  US: [
    {t:"Miami Beach Resort", d:"Kışa sıcak kaçış", img:"assets/img/pop/us-resort.jpg", meta:"Travel • Hotel"},
    {t:"NYC → LAX Ticket", d:"İç hatlarda promosyon", img:"assets/img/pop/us-flight.jpg", meta:"Transport • Ticket"},
    {t:"Tasting Menu", d:"Michelin listelerinde popüler", img:"assets/img/pop/us-tasting.jpg", meta:"Dining • Tasting"},
    {t:"Noise-cancelling Kulaklık", d:"Ofis/uzaktan çalışmada tercih", img:"assets/img/pop/us-headset.jpg", meta:"Electronics • Audio"},
    {t:"Gift Sets", d:"Özel günler yaklaşırken", img:"assets/img/pop/us-gift.jpg", meta:"Gifts • Set"}
  ],
  INTL: [
    {t:"Şehir Oteli", d:"Merkezde uygun fiyat", img:"assets/img/pop/intl-hotel.jpg", meta:"Travel • Hotel"},
    {t:"Uçak Bileti", d:"Popüler güzergâhlarda fırsat", img:"assets/img/pop/intl-flight.jpg", meta:"Transport • Flight"},
    {t:"Yerel Lezzetler", d:"Gastronomi turları", img:"assets/img/pop/intl-food.jpg", meta:"Food • Local"},
    {t:"Akıllı Aksesuar", d:"Fiyat/performans", img:"assets/img/pop/intl-gadget.jpg", meta:"Electronics • Accessory"},
    {t:"El Yapımı Hediyeler", d:"Hediye trendi", img:"assets/img/pop/intl-gift.jpg", meta:"Gifts • Handmade"}
  ]
};

/* ===========================
   Vitrin render (4 kart, altın kenarlı)
=========================== */
function renderShowcase(items){
  const grid = $("#grid");
  grid.innerHTML = "";
  items.slice(0,4).forEach(x=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      ${x.img ? `<img src="${x.img}" alt="" style="width:100%;height:120px;object-fit:cover;border-radius:12px;margin-bottom:10px">` : ""}
      <h3>${x.t}</h3>
      <p>${x.d}</p>
      <div class="meta">${x.meta||""}</div>
    `;
    grid.appendChild(card);
  });
}

/* Günlük yenileme: her gün farklı 4’lü seç */
function pickDailyPopular(){
  const region = POPULAR_DATA[userRegion()] ? userRegion() : "INTL";
  const pool = POPULAR_DATA[region];
  // basit karıştırma
  const shuffled = [...pool].sort(()=>Math.random()-0.5);
  return shuffled.slice(0,4);
}

(function initDaily(){
  const today = todayStr();
  const last = localStorage.getItem(STORAGE_KEY_POPULAR_DATE);
  if(last !== today){
    const list = pickDailyPopular();
    localStorage.setItem(STORAGE_KEY_POPULAR, JSON.stringify(list));
    localStorage.setItem(STORAGE_KEY_POPULAR_DATE, today);
  }
  const cached = JSON.parse(localStorage.getItem(STORAGE_KEY_POPULAR) || "[]");
  if(cached.length){
    renderShowcase(cached);
  }else{
    renderShowcase(pickDailyPopular());
  }
})();

/* ===========================
   Arama + öneriler
=========================== */
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

  // Basit filtre: popüler listede ara; yoksa INTL’de ara
  const region = POPULAR_DATA[userRegion()] ? userRegion() : "INTL";
  const pool = [...(POPULAR_DATA[region]||[]), ...(POPULAR_DATA.INTL||[])];
  const filt = pool.filter(p => (p.t+" "+p.d+" "+(p.meta||"")).toLowerCase().includes(q.toLowerCase()));
  renderShowcase(filt.length ? filt.slice(0,4) : pickDailyPopular());
}
searchBtn.addEventListener("click", doSearch);
input.addEventListener("keydown", e=>{ if(e.key==="Enter") doSearch(); });

/* ===========================
   Sesli Arama
=========================== */
$("#voiceBtn").addEventListener("click", ()=>{
  try{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ alert("Tarayıcı sesli aramayı desteklemiyor."); return; }
    const rec = new SR();
    const savedLang = localStorage.getItem("fae_lang") || (navigator.language||"tr-TR");
    rec.lang = savedLang.length===2 ? savedLang+"-"+savedLang.toUpperCase() : savedLang;
    rec.onresult = (e)=>{
      const text = e.results[0][0].transcript;
      input.value = text;
      doSearch();
    };
    rec.onerror = ()=>alert("Mikrofon izni gerekli olabilir.");
    rec.start();
  }catch(err){ alert("Sesli arama kullanılamıyor."); }
});

/* ===========================
   Görsel Arama (dosya adına göre anahtar kelime)
=========================== */
$("#imageInput").addEventListener("change", (e)=>{
  const file = e.target.files?.[0];
  if(!file) return;
  const guess = file.name.replace(/\.[^/.]+$/,"").replace(/[_-]/g," ");
  if(guess && guess.length>2){ input.value = guess; doSearch(); }
  else { alert("Görsel arama için dosya adından anahtar kelime üretilemedi."); }
});
