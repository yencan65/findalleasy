// Basit i18n: sayfadaki ana metinler + dil seçicisi
const messages = {
  tr: {
    taglinePrefix:"Yazman Yeterli,",
    taglineStrong:"Biz Hallediyoruz",
    search:"Ara",
    trending:"Bölgenizde Bugün Popüler",
    refreshNote:"Liste günlük yenilenir.",
    footer:"Global, Akıllı, Hızlı."
  },
  en: {
    taglinePrefix:"Just Type,",
    taglineStrong:"We Handle It",
    search:"Search",
    trending:"Popular Near You Today",
    refreshNote:"The list refreshes daily.",
    footer:"Global, Smart, Fast."
  },
  de: {
    taglinePrefix:"Tippen reicht,",
    taglineStrong:"wir kümmern uns",
    search:"Suchen", trending:"Heute beliebt in Ihrer Nähe",
    refreshNote:"Liste wird täglich aktualisiert.",
    footer:"Global, Smart, Schnell."
  },
  fr: {
    taglinePrefix:"Tapez,",
    taglineStrong:"on s’occupe du reste",
    search:"Rechercher", trending:"Populaire près de chez vous aujourd’hui",
    refreshNote:"La liste est mise à jour chaque jour.",
    footer:"Global, Intelligent, Rapide."
  },
  es: {
    taglinePrefix:"Escribe,",
    taglineStrong:"nosotros nos encargamos",
    search:"Buscar", trending:"Popular cerca de ti hoy",
    refreshNote:"La lista se actualiza a diario.",
    footer:"Global, Inteligente, Rápido."
  },
  ru: {
    taglinePrefix:"Напишите,",
    taglineStrong:"остальное сделаем мы",
    search:"Поиск", trending:"Популярно рядом сегодня",
    refreshNote:"Список обновляется ежедневно.",
    footer:"Глобально, Умно, Быстро."
  },
  ar: {
    taglinePrefix:"اكتب،",
    taglineStrong:"ونتكفّل بالباقي",
    search:"ابحث", trending:"الأكثر رواجًا بالقرب منك اليوم",
    refreshNote:"تتجدّد القائمة يوميًا.",
    footer:"عالمي، ذكي، سريع."
  }
};

function applyI18n(lang){
  const dict = messages[lang] || messages.tr;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(dict[key]) el.textContent = dict[key];
  });
  // Buton & yerelleştirme
  const btn = document.getElementById("searchBtn");
  if(btn) btn.textContent = dict.search;
}

(function initLang(){
  const langSelect = document.getElementById("langSelect");
  // Varsayılan tarayıcı dili
  const browser = (navigator.language||"tr").slice(0,2);
  const saved = localStorage.getItem("fae_lang");
  const current = saved || browser;
  langSelect.value = messages[current] ? current : "tr";
  applyI18n(langSelect.value);
  langSelect.addEventListener("change", ()updateDynamicLanguage(langSelect.value);
=>{
    localStorage.setItem("fae_lang", langSelect.value);
    applyI18n(langSelect.value);
  });
})();
// Dil değiştiğinde placeholder ve vitrin verilerini de yenile
function updateDynamicLanguage(lang){
  const input = document.getElementById("searchInput");
  // placeholderları yeni dilde ayarla
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

  // vitrin başlığını güncelle
  const tEl=document.querySelector("[data-i18n='trending']");
  if(tEl && messages[lang]) tEl.textContent=messages[lang].trending;
}
