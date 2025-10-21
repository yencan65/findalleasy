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
}};