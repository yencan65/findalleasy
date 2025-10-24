import { useEffect, useState } from 'react'
import axios from 'axios'

const timeToKey = () => {
  const h = new Date().getHours()
  if (h>=5 && h<=10) return 'morning'   // ✨
  if (h>=11 && h<=16) return 'day'       // ☀️
  if (h>=17 && h<=20) return 'evening'   // 🌙
  return 'night'                          // 🌜
}
const emojiByTime = { morning:'✨', day:'☀️', evening:'🌙', night:'🌜' }

export default function useDynamicSlogan(locale='tr'){
  const [slogan,setSlogan] = useState('Parmak şıklatman kadar kolay.')
  const [emoji,setEmoji] = useState(emojiByTime[timeToKey()])

  const refresh = async () => {
    const timeOfDay = timeToKey()
    setEmoji(emojiByTime[timeOfDay])
    const { data } = await axios.post('/api/ai/slogan', { timeOfDay, locale })
    setSlogan(data.slogan || 'Parmak şıklatman kadar kolay.')
  }

  useEffect(()=>{ refresh(); const id = setInterval(refresh, 20000); return ()=>clearInterval(id) },[])
  return `${emoji} ${slogan}`
}
