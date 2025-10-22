// v7 AI-personalized showcase
const LANGS = ["tr","en","de","fr","es","ru","ar","jp"];
let i18n = null;

function detectBrowserLang(){
  const nav = navigator.languages && navigator.languages[0] || navigator.language || "tr";
  const code = nav.slice(0,2).toLowerCase();
  return LANGS.includes(code) ? code : "en";
}

async function loadLanguage(lang){
  const res = await fetch(`lang/${lang}.json`);
  i18n = await res.json();
  document.getElementById("search-btn").textContent = i18n.search;
  document.getElementById("slogan").innerHTML = i18n.slogan;
  document.getElementById("popular-title").textContent = i18n.popular;
  document.getElementById("footer").textContent = i18n.footer;
  startPlaceholderRotation(i18n.placeholder_items || []);
}

function startPlaceholderRotation(items){
  const input = document.getElementById("search-input");
  if(!items || items.length===0) return;
  let idx = 0;
  input.placeholder = items[0];
  setInterval(()=>{
    idx = (idx+1) % items.length;
    input.placeholder = items[idx];
  }, 2500);
}

function saveSearch(query){
  if(!query) return;
  const history = JSON.parse(localStorage.getItem("searchHistory")||"[]");
  history.push({query, time: Date.now()});
  localStorage.setItem("searchHistory", JSON.stringify(history));
}

function detectCategory(query){
  if(!query) return "Genel";
  const q = query.toLowerCase();
  const map = {
    "Çiçek": ["çiçek","flower","bouquet","gül","rose","orchid"],
    "Otel": ["otel","tatil","rezervasyon","hotel"],
    "Bilet": ["bilet","uçak","ucak","train","tren","ticket"],
    "Moda": ["giyim","elbise","moda","kıyafet","ayakkabı","fashion","shoe"],
    "Yemek": ["restoran","yemek","cafe","food","restaurant","deliver"],
    "Teknoloji": ["telefon","laptop","kulaklık","electronics","tekno","tech"],
    "Aksesuar": ["aksesuar","saat","takı","jewelry","accessory"]
  };
  for(const [cat, words] of Object.entries(map)){
    if(words.some(w => q.includes(w))) return cat;
  }
  return "Genel";
}

async function getRegion(){
  try{
    const r = await fetch("https://ipapi.co/json/");
    const j = await r.json();
    const code = (j && j.country_code) || "GLOBAL";
    localStorage.setItem("userRegion", code);
    return code;
  }catch(e){
    return localStorage.getItem("userRegion") || "GLOBAL";
  }
}

function calculateCommission(category, region){
  const base = {"Elektronik":0.06,"Moda":0.08,"Turizm":0.10,"Gayrimenkul":0.03,"Aksesuar":0.07,"Yemek":0.05,"Çiçek":0.08,"Bilet":0.07,"Otel":0.09,"Teknoloji":0.06};
  let rate = base[category] ?? 0.07;
  if(region==="EU") rate -= 0.01;
  if(region==="ASIA") rate += 0.02;
  return Math.max(0.02, Math.min(rate, 0.15));
}
function getFindalleasyPrice(originalPrice, category, region){
  const rate = calculateCommission(category, region);
  return (originalPrice * (1 - rate)).toFixed(2);
}

function getDealsForCategory(category, region){
  const data = {
    "Çiçek":[
      {title:"Gül Buketi", price:120, image:"assets/flowers1.svg", link:"https://example.com/flowers"},
      {title:"Orkide", price:140, image:"assets/flowers1.svg", link:"https://example.com/flowers2"},
      {title:"Lale Demeti", price:115, image:"assets/flowers1.svg", link:"https://example.com/flowers3"}
    ],
    "Otel":[
      {title:"Bodrum Otel 3*", price:950, image:"assets/hotel1.svg", link:"https://example.com/hotel1"},
      {title:"İstanbul Butik", price:880, image:"assets/hotel1.svg", link:"https://example.com/hotel2"}
    ],
    "Moda":[
      {title:"Sneaker", price:699, image:"assets/fashion1.svg", link:"https://example.com/fashion1"},
      {title:"Ceket", price:749, image:"assets/fashion1.svg", link:"https://example.com/fashion2"}
    ],
    "Yemek":[
      {title:"Steak Menü", price:280, image:"assets/food1.svg", link:"https://example.com/food1"},
      {title:"Sushi Set", price:260, image:"assets/food1.svg", link:"https://example.com/food2"}
    ],
    "Bilet":[
      {title:"İstanbul → İzmir (Uçak)", price:1450, image:"assets/ticket1.svg", link:"https://example.com/ticket1"},
      {title:"Ankara → Eskişehir (Tren)", price:320, image:"assets/ticket1.svg", link:"https://example.com/ticket2"}
    ],
    "Teknoloji":[
      {title:"Kulaklık", price:399, image:"assets/tech1.svg", link:"https://example.com/tech1"},
      {title:"Bluetooth Hoparlör", price:349, image:"assets/tech1.svg", link:"https://example.com/tech2"}
    ],
    "Genel":[
      {title:"Seçme Ürün", price:199, image:"assets/tech1.svg", link:"#"},
      {title:"Popüler Fırsat", price:299, image:"assets/fashion1.svg", link:"#"},
    ]
  };
  return data[category] || data["Genel"];
}

function selectBestDeal(products){
  return products.slice().sort((a,b)=>a.price-b.price)[0];
}

function getRelatedForCategory(category){
  const related = {
    "Çiçek":["Kutulu Çikolata","Tebrik Kartı","Mini Saksı"],
    "Otel":["Spa","Transfer","Tur Paketi"],
    "Moda":["Çanta","Saat","Takı"],
    "Yemek":["Tatlı","İçecek","Kahve"],
    "Bilet":["Yakın Oteller","Araç Kiralama","Seyahat Sigortası"],
    "Teknoloji":["Kılıf","Powerbank","Garanti+"]
  };
  return related[category] || ["Popüler","Önerilen","Trend"];
}

function rankCategoriesForUser(region){
  const hist = JSON.parse(localStorage.getItem("searchHistory")||"[]");
  const counts = {};
  hist.slice(-30).forEach(h => {
    const c = detectCategory(h.query);
    counts[c] = (counts[c]||0)+1;
  });
  let ranked = Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
  return ranked.length ? ranked : (window.REGIONAL || ["Otel","Bilet","Moda","Yemek","Çiçek"]);
}

function renderVitrinCards(region){
  const grid = document.getElementById("vitrin-grid");
  grid.innerHTML = "";
  const cats = rankCategoriesForUser(region);
  const uniqueCats = [...new Set(cats)].slice(0,5);
  while(uniqueCats.length<4){ uniqueCats.push("Teknoloji"); }
  uniqueCats.slice(0,5).forEach(cat => {
    const deals = getDealsForCategory(cat, region);
    const best = selectBestDeal(deals);
    const findPrice = getFindalleasyPrice(best.price, cat, region);
    const related = getRelatedForCategory(cat);

    const card = document.createElement("div");
    card.className = "vitrin-card";
    card.innerHTML = `
      <img src="${best.image}" alt="${cat}">
      <div class="vitrin-content">
        <h3>${cat} — En Uygun Seçenek</h3>
        <p>${best.title} • <strong>${findPrice}</strong></p>
        <div class="ai-related">
          ${related.map(r=>`<span>${r}</span>`).join("")}
        </div>
      </div>
    `;
    card.onclick = ()=> window.location.href = best.link;
    grid.appendChild(card);
  });
}

async function bootstrap(){
  const lang = detectBrowserLang();
  document.getElementById("language-select").value = lang;
  await loadLanguage(lang);

  // region + regional trends
  const region = await getRegion();
  try{
    const t = await fetch("assets/trends.json").then(r=>r.json());
    window.REGIONAL = t[region] || t["GLOBAL"];
  }catch(e){
    window.REGIONAL = ["Otel","Bilet","Moda","Yemek","Çiçek"];
  }

  renderVitrinCards(region);
  setInterval(()=>renderVitrinCards(region), 60000);
}

document.addEventListener("DOMContentLoaded", bootstrap);

document.getElementById("language-select").addEventListener("change", async (e)=>{
  await loadLanguage(e.target.value);
});

document.getElementById("search-btn").addEventListener("click", ()=>{
  const q = document.getElementById("search-input").value.trim();
  if(!q) return;
  saveSearch(q);
  const region = localStorage.getItem("userRegion") || "GLOBAL";
  renderVitrinCards(region);
});

document.getElementById("voice-btn").addEventListener("click", ()=>{
  alert("Sesli arama bu sürümde placeholder. API ile bağlayacağız.");
});
document.getElementById("image-btn").addEventListener("click", ()=>{
  alert("Görsel arama bu sürümde placeholder. API ile bağlayacağız.");
});
