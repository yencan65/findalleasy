import { useEffect, useState } from 'react'

const timeKey = () => { const h=new Date().getHours(); if(h>=5&&h<=10)return'morning'; if(h>=11&&h<=16)return'day'; if(h>=17&&h<=20)return'evening'; return'night' }
const msgMap = {
  morning: '✨ Bu sabah bu kategoride özel fırsatlar açıldı, ilgini çekebilir.',
  day:     '☀️ Bu alanda tekrar aradın, senin için fiyatları biraz daha düşürdüm.',
  evening: '🌙 Bu kategoriyi seviyorsun, sana özel seçimler hazırladım.',
  night:   '🌜 Sessizde arayanlardan birisin, özel fırsatlar açık!'
}

export default function SmartBanner(){
  const [show,setShow]=useState(false)
  const [msg,setMsg]=useState('')
  useEffect(()=>{
    if (localStorage.getItem('bannerDismissed')==='1') return
    try {
      const raw = localStorage.getItem('searchHistory') || '[]'
      const hist = JSON.parse(raw).slice(-5)
      const counts = hist.reduce((acc,c)=>{ acc[c]=(acc[c]||0)+1; return acc },{})
      const hit = Object.values(counts).some(v=>v>=3)
      if(hit){ setMsg(msgMap[timeKey()]); setShow(true) }
    } catch(e){}
  },[])
  if(!show) return null
  return (
    <div className="banner">
      <div className="msg"><span>🧠</span><span>{msg}</span></div>
      <button className="close" onClick={()=>{ localStorage.setItem('bannerDismissed','1'); setShow(false) }}>×</button>
    </div>
  )
}
