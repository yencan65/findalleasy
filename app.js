// v8 minimalist final
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
  document.getElementById("slogan").innerHTML = i18n.slogan.replace('<u>', '<u class=\"brand-underline\">');
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
    "Moda": ["giyim","elbise","moda","kıyafet","ayakkabı","fashion","shoe"],
    "Yemek": ["restoran","yemek","cafe","food","restaurant","deliver"]
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
  const base = {"Moda":0.08,"Turizm":0.10,"Aksesuar":0.07,"Yemek":0.05,"Çiçek":0.08,"Otel":0.09};
  let rate = base[category] ?? 0.07;
  if(region==="EU") rate -= 0.01;
  if(region==="ASIA") rate += 0.02;
  return Math.max(0.02, Math.min(rate, 0.15));
}
function getFindalleasyPrice(originalPrice, category, region){
  const rate = calculateCommission(category, region);
  return (originalPrice * (1 - rate)).toFixed(2);
}

function getDealsForCategory(category){
  const data = {
    "Otel":[{title:"Butik Otel", price:880, image:"assets/hotel_min.svg", link:"#"}],
    "Yemek":[{title:"Şık Restoran", price:260, image:"assets/food_min.svg", link:"#"}],
    "Moda":[{title:"Minimal Elbise", price:749, image:"assets/fashion_min.svg", link:"#"}],
    "Çiçek":[{title:"Zarif Buket", price:120, image:"assets/flowers_min.svg", link:"#"}],
    "Genel":[{title:"Önerilen", price:199, image:"assets/fashion_min.svg", link:"#"}]
  };
  return data[category] || data["Genel"];
}

function renderVitrin(region){
  const grid = document.getElementById("vitrin-grid");
  grid.innerHTML = "";
  const cats = (window.REGIONAL || ["Otel","Yemek","Moda","Çiçek"]).slice(0,4);
  cats.forEach(cat => {
    const deal = getDealsForCategory(cat)[0];
    const price = getFindalleasyPrice(deal.price, cat, region);
    const card = document.createElement("div");
    card.className = "vitrin-card";
    card.innerHTML = `
      <img src="${deal.image}" alt="${cat}">
      <div class="vitrin-content">
        <h3>${cat} — ${price}</h3>
      </div>`;
    card.onclick = ()=> window.location.href = deal.link;
    grid.appendChild(card);
  });
}

async function bootstrap(){
  const lang = detectBrowserLang();
  document.getElementById("language-select").value = lang;
  await loadLanguage(lang);

  const region = await getRegion();
  try{
    const t = await fetch("assets/trends.json").then(r=>r.json());
    window.REGIONAL = t[region] || t["GLOBAL"];
  }catch(e){
    window.REGIONAL = ["Otel","Yemek","Moda","Çiçek"];
  }
  renderVitrin(region);
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
  renderVitrin(region);
});

document.getElementById("voice-btn").addEventListener("click", ()=>{
  alert("Sesli arama bu sürümde placeholder. API ile bağlayacağız.");
});
document.getElementById("image-btn").addEventListener("click", ()=>{
  alert("Görsel arama bu sürümde placeholder. API ile bağlayacağız.");
});
