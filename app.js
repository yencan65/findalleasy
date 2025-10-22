// v9 emotional AI + Apple-style suggestions
const LANGS = ["tr","en"];
let i18n = null;

function detectBrowserLang(){
  const nav = navigator.languages && navigator.languages[0] || navigator.language || "tr";
  const code = nav.slice(0,2).toLowerCase();
  return LANGS.includes(code) ? code : "en";
}

async function loadLanguage(lang){
  const res = await fetch(`lang/${lang}.json`);
  i18n = await res.json();
  document.getElementById("slogan").innerHTML = i18n.slogan.replace('<u>', '<u class=\"brand-underline\">');
  document.getElementById("search-btn").textContent = i18n.search;
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
  }, 2400);
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
    "Teknoloji": ["telefon","laptop","kulaklık","electronics","tekno","tech"]
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
  const base = {"Moda":0.08,"Turizm":0.10,"Aksesuar":0.07,"Yemek":0.05,"Çiçek":0.08,"Otel":0.09,"Teknoloji":0.06,"Bilet":0.07};
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
    "Teknoloji":[{title:"Kulaklık", price:399, image:"assets/fashion_min.svg", link:"#"}],
    "Genel":[{title:"Önerilen", price:199, image:"assets/fashion_min.svg", link:"#"}]
  };
  return data[category] || data["Genel"];
}

// Mood estimation
function estimateMood(sessionCount, hour, lastSearch){
  if((hour>=9 && hour<=12) || (hour>=13 && hour<=17)){
    if(lastSearch) return "Enerjik";
  }
  if(hour>=18 && hour<=22){
    return "Kararsız";
  }
  return "Sakin";
}

function greetingText(lang, hour){
  if(!i18n) return "Merhaba";
  if(hour>=5 && hour<12) return i18n.hello_morning;
  if(hour>=12 && hour<18) return i18n.hello_day;
  if(hour>=18 && hour<24) return i18n.hello_evening;
  return i18n.hello_night;
}

function getSmartSuggestions(region, time, history){
  const textHas = (kw)=> history.some(h => (h.query||"").toLowerCase().includes(kw));
  const chips = [];
  if(time>=18 || time<6) chips.push({icon:"🍽️", text:"Akşam yemeği önerileri", cat:"Yemek"});
  if(region==="TR") chips.push({icon:"🏨", text:"Tatil fırsatları", cat:"Otel"});
  if(textHas("çiçek") || textHas("flower")) chips.push({icon:"🌹", text:"Özel gün için çiçek", cat:"Çiçek"});
  if(time<11) chips.push({icon:"☕", text:"Kahvaltı mekanları", cat:"Yemek"});
  if(!chips.length) chips.push({icon:"👗", text:"Bugün moda öne çıkıyor", cat:"Moda"});
  return chips.slice(0,4);
}

function renderSmartSuggestions(region){
  const el = document.getElementById("ai-suggestions");
  const history = JSON.parse(localStorage.getItem("searchHistory")||"[]");
  const hour = new Date().getHours();
  const chips = getSmartSuggestions(region, hour, history);
  el.innerHTML = "";
  chips.forEach(c=>{
    const chip = document.createElement("div");
    chip.className = "suggestion-chip";
    chip.innerHTML = `<span class="suggestion-icon">${c.icon}</span><span class="suggestion-text">${c.text}</span>`;
    chip.onclick = ()=>{
      saveSearch(c.cat);
      const region = localStorage.getItem("userRegion") || "GLOBAL";
      renderVitrin(region, [c.cat]);
    };
    el.appendChild(chip);
  });
}

function getSmartVitrin(region){
  const hist = JSON.parse(localStorage.getItem("searchHistory")||"[]");
  const hour = new Date().getHours();
  const last = hist.length ? hist[hist.length-1].query : "";
  const mood = estimateMood(hist.length, hour, last);
  let cats = [];
  if(last){
    const c = detectCategory(last);
    cats = [c];
  }
  if(!cats.length){
    if(region==="TR") cats = ["Yemek","Otel","Moda","Çiçek"];
    else if(region==="JP") cats = ["Teknoloji","Yemek","Moda","Otel"];
    else cats = ["Otel","Yemek","Moda","Çiçek"];
  }
  const base = ["Otel","Yemek","Moda","Çiçek","Teknoloji","Bilet"];
  cats = [...new Set(cats.concat(base))].slice(0,4);
  return {cats, mood};
}

function applyMoodUI(mood){
  const body = document.body;
  body.style.transition = "background 300ms ease";
  if(mood==="Enerjik"){
    body.style.background = "linear-gradient(180deg, #0E1A26 0%, #0f2231 100%)";
  }else if(mood==="Kararsız"){
    body.style.background = "linear-gradient(180deg, #0E1A26 0%, #0e1e2a 100%)";
  }else{
    body.style.background = "#0E1A26";
  }
}

function renderVitrin(region, preferFirst=[]){
  const grid = document.getElementById("vitrin-grid");
  grid.innerHTML = "";
  const {cats, mood} = getSmartVitrin(region);
  applyMoodUI(mood);
  const finalCats = preferFirst.length ? [...new Set(preferFirst.concat(cats))].slice(0,4) : cats.slice(0,4);
  finalCats.forEach(cat => {
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

  const hour = new Date().getHours();
  const hist = JSON.parse(localStorage.getItem("searchHistory")||"[]");
  const hello = greetingText(lang, hour);
  const mood = estimateMood(hist.length, hour, hist.length?hist[hist.length-1].query:"");
  const greetingEl = document.getElementById("greeting");
  const name = localStorage.getItem("userName") || "";
  const namePart = name ? (", " + name) : "";
  greetingEl.textContent = `${hello}${namePart}! Bugün senin için akıllı öneriler hazır. (${mood})`;

  renderSmartSuggestions(region);
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
  renderSmartSuggestions(region);
  renderVitrin(region, [detectCategory(q)]);
});

document.getElementById("voice-btn").addEventListener("click", ()=>{
  alert("Sesli arama bu sürümde placeholder. Yakında AI konuşmalı öneri eklenecek.");
});
document.getElementById("image-btn").addEventListener("click", ()=>{
  alert("Görsel arama bu sürümde placeholder. Yakında görselden benzer ürün bulma eklenecek.");
});
