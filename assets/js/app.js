/* ---------- Basit veri (örnek vitrin) ---------- */
const PRODUCTS = [
  {id:1, title:"Otel – Antalya Ultra Her Şey Dahil", img:"assets/img/hero1.jpg", desc:"Yaz tatiline lüks başlangıç", price:"$149"},
  {id:2, title:"Uçak Bileti – İstanbul → Paris", img:"assets/img/hero2.jpg", desc:"Avrupa en uygun", price:"$89"},
  {id:3, title:"Restoran – Şef Tadım Menüsü", img:"assets/img/hero3.jpg", desc:"Gastronomi keşfi", price:"$39"},
  {id:4, title:"Moda – Minimalist Ceket", img:"assets/img/hero4.jpg", desc:"Yeni sezon", price:"$59"},
  {id:5, title:"Aksesuar – Smart Watch", img:"assets/img/hero5.jpg", desc:"Sağlık & fitness", price:"$79"}
];

/* ----------- Vitrini doldur ----------- */
function renderGrid(list=PRODUCTS){
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  list.slice(0,5).forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="price">${p.price}</div>
    `;
    grid.appendChild(card);
  });
}
renderGrid();

/* ----------- Arama + akıllı öneriler ----------- */
const input = document.getElementById("searchInput");
const suggestList = document.getElementById("suggestList");
const voiceBtn = document.getElementById("voiceBtn");
const imageInput = document.getElementById("imageInput");
const searchBtn = document.getElementById("searchBtn");
const chips = document.getElementById("chipList");

const STORAGE_KEY = "fae_search_history";
const getHistory = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const saveHistory = (q) => {
  if(!q) return;
  const set = new Set(getHistory());
  set.add(q.trim());
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set].slice(-20)));
};

/* önerileri göster */
function showSuggestions(q){
  const data = getHistory().filter(x=>x.toLowerCase().includes(q.toLowerCase()));
  suggestList.innerHTML = "";
  if (!q || data.length===0){ suggestList.hidden = true; return; }
  data.slice(-8).reverse().forEach(item=>{
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

/* arama çalıştır */
function doSearch(){
  const q = input.value.trim();
  if (!q) return;
  saveHistory(q);

  // basit filtreli vitrin
  const filtered = PRODUCTS.filter(p => p.title.toLowerCase().includes(q.toLowerCase()));
  renderGrid(filtered.length ? filtered : PRODUCTS);
}
searchBtn.addEventListener("click", doSearch);
input.addEventListener("keydown", e=>{ if(e.key==="Enter") doSearch(); });

/* chip'lere tıklandığında inputu doldurup ara */
chips.querySelectorAll(".chip").forEach(ch=>{
  ch.addEventListener("click", ()=>{
    input.value = ch.textContent;
    doSearch();
  });
});

/* ----------- Sesli arama (Web Speech API) ----------- */
voiceBtn.addEventListener("click", ()=>{
  try{
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) { alert("Tarayıcı sesli aramayı desteklemiyor."); return; }
    const rec = new SR();
    rec.lang = (navigator.language||"tr-TR");
    rec.onresult = (e)=>{
      const text = e.results[0][0].transcript;
      input.value = text;
      doSearch();
    };
    rec.onerror = ()=>alert("Mikrofon izni gerekli olabilir.");
    rec.start();
  }catch(err){ alert("Sesli arama kullanılamıyor."); }
});

/* ----------- Görsel arama (yerel önizleme + anahtar kelime) ----------- */
imageInput.addEventListener("change", async (e)=>{
  const file = e.target.files?.[0];
  if(!file) return;
  // basit yaklaşım: dosya adına göre arama
  const guess = file.name.replace(/\.[^/.]+$/,"").replace(/[_-]/g," ");
  if(guess && guess.length>2){ input.value = guess; doSearch(); }
  else { alert("Görsel arama için dosya adından anahtar kelime üretilemedi."); }
});
