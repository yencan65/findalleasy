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
  langSelect.addEventListener("change", ()=>{
    localStorage.setItem("fae_lang", langSelect.value);
    applyI18n(langSelect.value);
  });
})();
