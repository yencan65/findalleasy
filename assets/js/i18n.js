// basit i18n – tarayıcı dilini algılar ve bazı metinleri değiştirir
const messages = {
  tr: {
    tagline: "Yazman Yeterli, Gerisini Biz Hallederiz",
    search: "Ara",
    trending: "En Çok Tercih Edilenler",
    footer: "Global, Akıllı, Hızlı."
  },
  en: {
    tagline: "Just Type, We Handle the Rest",
    search: "Search",
    trending: "Top Picks",
    footer: "Global, Smart, Fast."
  },
  de: { tagline:"Tippen reicht, wir übernehmen", search:"Suchen", trending:"Top-Auswahl", footer:"Global, Smart, Schnell." },
  fr: { tagline:"Tape, on s’occupe du reste", search:"Rechercher", trending:"Meilleurs choix", footer:"Global, Intelligent, Rapide." },
  es: { tagline:"Escribe y nosotros hacemos el resto", search:"Buscar", trending:"Más elegidos", footer:"Global, Inteligente, Rápido." },
  ru: { tagline:"Пишите — остальное сделаем мы", search:"Поиск", trending:"Популярное", footer:"Глобально, Умно, Быстро." },
  ar: { tagline:"اكتب ونحن نتكفّل بالباقي", search:"ابحث", trending:"الأكثر رواجًا", footer:"عالمي، ذكي، سريع." }
};

(function applyI18n(){
  const lang = (navigator.language || "tr").slice(0,2);
  const dict = messages[lang] || messages.tr;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
})();
