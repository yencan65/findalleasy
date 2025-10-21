(function(){
const $=s=>document.querySelector(s);
const langSel=$('#langSelect');const supported=['tr','en','de','fr','es','ru','ar'];
const navLang=(navigator.language||'tr').slice(0,2);
langSel.value=(supported.includes(navLang)?navLang:'tr');
I18N.load(langSel.value);
langSel.addEventListener('change',e=>I18N.load(e.target.value));

// Placeholder lists per language
window.Placeholders={
  lists:{
    tr:['Otel','Bilet','Yemek','Alışveriş','Moda','Giyim','Aksesuar','Kitap','Kırtasiye','Gayrimenkul'],
    en:['Hotel','Tickets','Food','Shopping','Fashion','Clothing','Accessories','Books','Stationery','Real Estate'],
    de:['Hotel','Tickets','Essen','Einkaufen','Mode','Bekleidung','Accessoires','Bücher','Schreibwaren','Immobilien'],
    fr:['Hôtel','Billets','Restauration','Shopping','Mode','Vêtements','Accessoires','Livres','Papeterie','Immobilier'],
    es:['Hotel','Boletos','Comida','Compras','Moda','Ropa','Accesorios','Libros','Papelería','Inmobiliaria'],
    ru:['Отель','Билеты','Еда','Покупки','Мода','Одежда','Аксессуары','Книги','Канцтовары','Недвижимость'],
    ar:['فندق','تذاكر','طعام','تسوق','موضة','ملابس','إكسسوارات','كتب','قرطاسية','عقارات']
  },
  update(lang){
    const items=this.lists[lang]||this.lists.tr;
    const rotEl=$('#placeholderRotator');
    rotEl.textContent=items.join(' • ');
    clearInterval(this.timer);
    let i=0;
    this.timer=setInterval(()=>{
      $('#searchInput').setAttribute('placeholder', items[i%items.length]);
      i++;
    }, 2000);
  }
};

// Geolocation + IP fallback to choose country list
function loadTrendsByCountry(code){
  fetch('assets/data/trends.json').then(r=>r.json()).then(data=>{
    const list=data[code]||data['GLOBAL']||[];
    const grid=$('#trendGrid'); grid.innerHTML='';
    list.forEach(item=>{
      const el=document.createElement('div');
      el.className='card';
      el.innerHTML = '<h3>'+item.title+'</h3><p>'+item.price+'</p>';
      grid.appendChild(el);
    });
  });
}
const geoHint=$('#geoHint');
if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude,longitude}=pos.coords;
    if(geoHint) geoHint.textContent=I18N.t('geo_detected','Konum algılandı');
    // very light region heuristic; replace with precise reverse geocode in backend
    const code = (latitude>35 && longitude>0) ? 'TR' : 'US';
    loadTrendsByCountry(code);
  },()=>{
    if(geoHint) geoHint.textContent=I18N.t('geo_denied','Konum izni reddedildi');
    fetch('https://ipapi.co/json').then(r=>r.json()).then(loc=>{
      loadTrendsByCountry(loc.country_code||'GLOBAL');
    }).catch(()=>loadTrendsByCountry('GLOBAL'));
  });
}else{
  if(geoHint) geoHint.textContent=I18N.t('geo_unavailable','Konum desteklenmiyor');
  fetch('https://ipapi.co/json').then(r=>r.json()).then(loc=>{
    loadTrendsByCountry(loc.country_code||'GLOBAL');
  }).catch(()=>loadTrendsByCountry('GLOBAL'));
}

// Voice/Image stubs
$('#voiceBtn').addEventListener('click',()=>alert('Sesli arama eklenecek'));
$('#imageBtn').addEventListener('click',()=>alert('Görsel arama eklenecek'));
$('#searchBtn').addEventListener('click',()=>{
  const q=$('#searchInput').value.trim();
  if(!q) return;
  alert((I18N.t('search_for','Aranıyor: '))+q);
});
})();