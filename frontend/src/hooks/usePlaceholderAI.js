import { useEffect, useState } from 'react'

const byTime = () => {
  const h = new Date().getHours()
  if (h>=5 && h<=10) return ['Bugün ne keşfetmek istersin?','Parla, keşfet, şıklat.']
  if (h>=11 && h<=16) return ['Hadi bulalım.','Parmak şıklatman kadar kolay.']
  if (h>=17 && h<=20) return ['Günün son fırsatlarını keşfet.','Rahatla, birlikte bulalım.']
  return ['Sessizde bile fırsatlar var.','Gece ama fırsatlar canlı.']
}

export default function usePlaceholderAI(){
  const [ph, setPh] = useState(byTime()[0])
  useEffect(()=>{
    let i=1; const arr = byTime()
    const id = setInterval(()=>{ setPh(arr[i%arr.length]); i++ }, 7000)
    return ()=>clearInterval(id)
  },[])
  return ph
}
