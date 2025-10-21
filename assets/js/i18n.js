// i18n + dinamik güncellemeler (placeholder & başlık)
window.messages = {
  tr: {
    taglinePrefix:"Sen Yaz,",
    taglineStrong:"Gerisini Biz Hallediyoruz",
    search:"Ara",
    trending:"Bölgenizde Bugün Popüler",
    footer:"Global, Akıllı, Hızlı.",
    placeholders:["Otel","Bilet","Turlar","Yemek","Moda","Aksesuar","Gayrimenkul","Hediyelik Eşyalar"],
    items:[
      {t:"Bölgenizde Popüler Oteller", d:"Yoğun talep gören konaklamalar", meta:"Turizm • Otel"},
      {t:"Uygun Uçuşlar", d:"Öne çıkan bilet fırsatları", meta:"Ulaşım • Bilet"},
      {t:"Gurme Menüler", d:"Gastronomide yükselen trendler", meta:"Yeme-İçme • Menü"},
      {t:"Sezon Trend Ürünler", d:"Fiyat/performans öne çıkanlar", meta:"Moda • Aksesuar"}
    ]
  },
  en: {
    taglinePrefix:"Just Type,",
    taglineStrong:"We Handle the Rest",
    search:"Search",
    trending:"Popular Near You Today",
    footer:"Global, Smart, Fast.",
    placeholders:["Hotels","Tickets","Tours","Food","Fashion","Accessories","Real Estate","Gifts"],
    items:[
      {t:"Popular Hotels", d:"High-demand stays nearby", meta:"Tourism • Hotel"},
      {t:"Best Flight Deals", d:"Highlighted ticket offers", meta:"Transport • Flight"},
      {t:"Chef’s Tasting Menus", d:"Rising trends in dining", meta:"Dining • Tasting"},
      {t:"Seasonal Trend Items", d:"Great value picks", meta:"Fashion • Accessory"}
    ]
  },
  de: {
    taglinePrefix:"Tippen reicht,",
    taglineStrong:"wir kümmern uns um den Rest",
    search:"Suchen",
    trending:"Heute beliebt in Ihrer Nähe",
    footer:"Global, Smart, Schnell.",
    placeholders:["Hotels","Tickets","Touren","Essen","Mode","Zubehör","Immobilien","Geschenke"],
    items:[
      {t:"Beliebte Hotels", d:"Stark nachgefragte Unterkünfte", meta:"Tourismus • Hotel"},
      {t:"Günstige Flüge", d:"Hervorgehobene Ticketangebote", meta:"Transport • Flug"},
      {t:"Gourmet-Menüs", d:"Aufstrebende Food-Trends", meta:"Essen • Menü"},
      {t:"Saisonale Trends", d:"Preis/Leistung Favoriten", meta:"Mode • Accessoire"}
    ]
  },
  fr: {
    taglinePrefix:"Tapez,",
    taglineStrong:"on s’occupe du reste",
    search:"Rechercher",
    trending:"Populaire près de chez vous aujourd’hui",
    footer:"Global, Intelligent, Rapide.",
    placeholders:["Hôtels","Billets","Circuits","Restauration","Mode","Accessoires","Immobilier","Cadeaux"],
    items:[
      {t:"Hôtels Populaires", d:"Hébergements très demandés", meta:"Tourisme • Hôtel"},
      {t:"Vols Avantageux", d:"Offres de billets mises en avant", meta:"Transport • Vol"},
      {t:"Menus Dégustation", d:"Tendances culinaires", meta:"Restauration • Dégustation"},
      {t:"Tendances Saisonnières", d:"Meilleur rapport qualité/prix", meta:"Mode • Accessoire"}
    ]
  },
  es: {
    taglinePrefix:"Escribe,",
    taglineStrong:"nosotros nos encargamos",
    search:"Buscar",
    trending:"Popular cerca de ti hoy",
    footer:"Global, Inteligente, Rápido.",
    placeholders:["Hoteles","Boletos","Tours","Comida","Moda","Accesorios","Bienes Raíces","Regalos"],
    items:[
      {t:"Hoteles Populares", d:"Alojamientos con alta demanda", meta:"Turismo • Hotel"},
      {t:"Vuelos Económicos", d:"Ofertas destacadas de boletos", meta:"Transporte • Vuelo"},
      {t:"Menús Degustación", d:"Tendencias gastronómicas", meta:"Comida • Degustación"},
      {t:"Tendencias de Temporada", d:"Selecciones de gran valor", meta:"Moda • Accesorio"}
    ]
  },
  ru: {
    taglinePrefix:"Напишите,",
    taglineStrong:"остальное сделаем мы",
    search:"Поиск",
    trending:"Популярно рядом сегодня",
    footer:"Глобально, Умно, Быстро.",
    placeholders:["Отели","Билеты","Туры","Еда","Мода","Аксессуары","Недвижимость","Подарки"],
    items:[
      {t:"Популярные отели", d:"Высокий спрос поблизости", meta:"Туризм • Отель"},
      {t:"Выгодные перелёты", d:"Лучшие предложения билетов", meta:"Транспорт • Перелёт"},
      {t:"Дегустационные меню", d:"Набирающие популярность гастротренды", meta:"Еда • Дегустация"},
      {t:"Сезонные тренды", d:"Лучшее соотношение цены и качества", meta:"Мода • Аксессуар"}
    ]
  },
  ar: {
    taglinePrefix:"اكتب،",
    taglineStrong:"ونتكفّل بالباقي",
    search:"ابحث",
    trending:"الأكثر رواجًا بالقرب منك اليوم",
    footer:"عالمي، ذكي، سريع.",
    placeholders:["فنادق","تذاكر","جولات","طعام","موضة","اكسسوارات","عقارات","هدايا"],
    items:[
      {t:"فنادق شائعة", d:"إقامات ذات طلب عالٍ", meta:"سياحة • فندق"},
      {t:"عروض رحلات", d:"أفضل العروض على التذاكر", meta:"نقل • رحلة"},
      {t:"قوائم تذوق", d:"اتجاهات الطهي المتزايدة", meta:"طعام • تذوق"},
      {t:"اتجاهات موسمية", d:"خيارات قيمة", meta:"موضة • إكسسوار"}
    ]
  }
};

function applyI18n(lang){
  const dict = window.messages[lang] || window.messages.tr;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  const btn = document.getElementById("searchBtn");
  if(btn) btn.textContent = dict.search;
}

function updateDynamicLanguage(lang){
  const dict = window.messages[lang] || window.messages.tr;

  // Placeholder rotasyonu
  const input = document.getElementById("searchInput");
  const arr = dict.placeholders || window.messages.tr.placeholders;
  let i=0;
  clearInterval(window.phTimer);
  window.phTimer=setInterval(()=>{
    input.setAttribute("placeholder", arr[i%arr.length]);
    i++;
  }, 1800);

  // Vitrin: 4 kartlık dil odaklı içerik
  window.renderLocalizedShowcase(dict.items || window.messages.tr.items);

  // Başlık vs zaten applyI18n ile güncelleniyor
}

(function initLang(){
  const langSelect = document.getElementById("langSelect");
  const browser = (navigator.language||"tr").slice(0,2);
  const saved = localStorage.getItem("fae_lang");
  const current = saved || browser;
  langSelect.value = window.messages[current] ? current : "tr";
  applyI18n(langSelect.value);
  updateDynamicLanguage(langSelect.value);
  langSelect.addEventListener("change", ()=>{
    localStorage.setItem("fae_lang", langSelect.value);
    applyI18n(langSelect.value);
    updateDynamicLanguage(langSelect.value);
  });
})();
