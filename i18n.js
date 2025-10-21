window.I18N={current:'tr',strings:{},
dirMap:{ar:'rtl'},
load:function(lang){
  return fetch('lang/'+lang+'.json').then(r=>r.json()).then(d=>{
    this.current=lang; this.strings=d;
    document.documentElement.lang=lang;
    document.documentElement.dir=this.dirMap[lang]||'ltr';
    this.apply();
  });
},
t:function(key,fallback){return (this.strings[key]||fallback||key);},
apply:function(){
  // Translate static elements
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n'); el.textContent=this.t(k,el.textContent);
  });
  // Headline / slogan
  const h=document.getElementById('headline');
  if(h){ h.textContent=this.t('headline','Sen Yaz, Gerisini Biz Hallederiz'); }
  // Placeholder rotator base
  if(window.Placeholders) window.Placeholders.update(this.current);
}};function updateDynamicLanguage(lang){
  const input = document.getElementById("searchInput");
  const placeholders = {
    tr:["Otel","Bilet","Turlar","Yemek","Moda","Aksesuar","Gayrimenkul","Hediyelik Eşyalar"],
    en:["Hotels","Tickets","Tours","Food","Fashion","Accessories","Real Estate","Gifts"],
    de:["Hotels","Tickets","Touren","Essen","Mode","Zubehör","Immobilien","Geschenke"],
    fr:["Hôtels","Billets","Circuits","Restauration","Mode","Accessoires","Immobilier","Cadeaux"],
    es:["Hoteles","Boletos","Tours","Comida","Moda","Accesorios","Bienes Raíces","Regalos"],
    ru:["Отели","Билеты","Туры","Еда","Мода","Аксессуары","Недвижимость","Подарки"],
    ar:["فنادق","تذاكر","جولات","طعام","موضة","اكسسوارات","عقارات","هدايا"]
  };
  const arr = placeholders[lang] || placeholders.tr;
  let i=0;
  clearInterval(window.phTimer);
  window.phTimer=setInterval(()=>{
    input.setAttribute("placeholder", arr[i%arr.length]);
    i++;
  },1800);
  const tEl=document.querySelector("[data-i18n='trending']");
  if(tEl && messages[lang]) tEl.textContent=messages[lang].trending;
}

document.getElementById("langSelect").addEventListener("change", ()=>{
  const lang=document.getElementById("langSelect").value;
  updateDynamicLanguage(lang);
});
