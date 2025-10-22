const LOCALES=['tr','en','de','fr','es','ru','ar','jp'];
const CURRENCY_BY_COUNTRY={TR:'TRY',DE:'EUR',FR:'EUR',ES:'EUR',GB:'GBP',US:'USD',RU:'RUB',JP:'JPY',AE:'AED'};
const VAT={TR:0.0,DE:0.19,FR:0.20,ES:0.21,GB:0.20,US:0.00,RU:0.20,JP:0.10,AE:0.05};

function detectLang(){const nav=(navigator.language||'en').toLowerCase();for(const l of LOCALES){if(nav.startsWith(l)) return l;}return 'en';}
async function loadLocale(lang){const res=await fetch(`lang/${lang}.json`);return await res.json();}
function greeting(pack){const h=new Date().getHours();if(h>=5&&h<11)return pack.ai_headline_morning; if(h>=11&&h<17)return pack.ai_headline_day; if(h>=17&&h<22)return pack.ai_headline_evening; return pack.ai_headline_night;}
function rotatePlaceholder(items){let i=0;const el=document.getElementById('searchInput');el.placeholder=items[0]||'';setInterval(()=>{i=(i+1)%items.length;el.placeholder=items[i];},2500);}
function fillLangSelect(cur){const s=document.getElementById('langSelect');LOCALES.forEach(code=>{const o=document.createElement('option');o.value=code;o.textContent=code.toUpperCase();if(code===cur)o.selected=true;s.appendChild(o)});s.addEventListener('change',e=>{const lang=e.target.value;localStorage.setItem('fae_lang',lang);applyLang(lang);});}

async function resolveCountry(){
  try{const r=await fetch('https://ipapi.co/json');const j=await r.json();return{code:(j.country||'TR'),name:(j.country_name||'Türkiye')};}
  catch(e){const ln=(navigator.language||'en').toUpperCase();const code=ln.includes('-')?ln.split('-')[1]:(ln==='TR'?'TR':'US');const name=code==='TR'?'Türkiye':(code==='DE'?'Germany':(code==='FR'?'France':(code==='ES'?'Spain':(code==='GB'?'United Kingdom':(code==='RU'?'Russia':(code==='JP'?'Japan':'United States'))))));return{code,name};}
}

async function fetchRates(base='TRY'){
  try{
    const r=await fetch(`https://api.exchangerate.host/latest?base=${base}`);
    return (await r.json()).rates||{};
  }catch(e){return {USD:0.034,EUR:0.031,GBP:0.026,JPY:5.2,RUB:3.2,AED:0.125,TRY:1};}
}

function fmtDelta(pct,lang){
  const v=Math.round(pct);
  if(lang==='tr') return v===0?'benzer':(v<0?`%${Math.abs(v)} daha uygun`:`%${v} daha pahalı`);
  return v===0?'similar':(v<0?`-${Math.abs(v)}% cheaper`:`+${v}% pricier`);
}

async function applyAIEg(langPack){
  const bubbleList=document.querySelectorAll('.info-bubble');
  bubbleList.forEach(b=>b.textContent=langPack.ai_engine_loading||'…');
  const country=await resolveCountry();
  const rates=await fetchRates('TRY');

  const homeIndex=1*(1+VAT.TR); // TRY base
  const cur=CURRENCY_BY_COUNTRY[country.code]||'USD';
  const fx=rates[cur]||1; // how many CUR per 1 TRY (api returns CUR per base)
  const targetIndex=fx*(1+(VAT[country.code]||0));
  const deltaPct=((targetIndex/homeIndex)-1)*100;

  document.querySelectorAll('.card').forEach(c=>{
    const b=c.querySelector('.info-bubble');
    const deltaText = fmtDelta(deltaPct,(document.documentElement.lang||'en').slice(0,2));
    const out=(langPack.ai_engine_note||'Price index {delta}').replace('{country}',country.name).replace('{delta}',deltaText);
    b.textContent=out;
  });
}

async function applyLang(lang){
  const pack = await loadLocale(lang);
  document.documentElement.lang = lang;
  document.getElementById('slogan').innerHTML = pack.slogan_html;
  document.getElementById('aboutText').innerHTML = pack.about_text;
  document.getElementById('aiGreeting').textContent = greeting(pack);
  document.getElementById('searchBtn').textContent = pack.search;
  rotatePlaceholder(pack.placeholder_items);
  await applyAIEg(pack);
}

(async()=>{
  const saved = localStorage.getItem('fae_lang');
  const lang = saved || detectLang();
  const sel = document.getElementById('langSelect');
  fillLangSelect(lang);
  await applyLang(lang);
})();