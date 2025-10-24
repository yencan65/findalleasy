import { useEffect, useState } from 'react'
import axios from 'axios'
import useDynamicSlogan from '../hooks/useDynamicSlogan'
import usePlaceholderAI from '../hooks/usePlaceholderAI'
import '../theme/mood.css'
import Footer from '../components/Footer'
import Assistant from '../components/Assistant'
import SmartBanner from '../components/SmartBanner'

export default function Home(){
  const slogan = useDynamicSlogan()
  const placeholder = usePlaceholderAI()
  const [query,setQuery] = useState('')
  const [items,setItems] = useState([])

  const fetchVitrine = async (lastCategory='electronics') => {
    const { data } = await axios.post('/api/ai/vitrine', { lastCategory })
    setItems(data.recommended || [])
  }
  useEffect(()=>{ fetchVitrine() },[])

  const saveSearchCategory = (cat) => {
    const raw = localStorage.getItem('searchHistory') || '[]'
    let arr = []
    try { arr = JSON.parse(raw) } catch(e){ arr=[] }
    arr.push(cat)
    localStorage.setItem('searchHistory', JSON.stringify(arr.slice(-20)))
  }

  const search = () => {
    const cat = /otel|uçak|bilet|tur|tatil/i.test(query) ? 'travel'
              : /elbise|ayakkabı|moda|sneaker/i.test(query) ? 'fashion'
              : /dekor|ev|lamba|mutfak/i.test(query) ? 'home'
              : 'electronics'
    saveSearchCategory(cat)
    fetchVitrine(cat)
  }

  return (
    <div className="container">
      <header className="header">
        <img src="/logo.svg" alt="FindAllEasy" />
      </header>

      <div className="slogan">{slogan}</div>

      <div className="search">
        <input placeholder={placeholder} value={query} onChange={e=>setQuery(e.target.value)}
               onKeyDown={e=> e.key==='Enter' && search()} />
        <button onClick={search}>Ara</button>
      </div>

      <SmartBanner/>

      <div className="grid">
        {items.map(x=> (
          <div key={x.id} className="card">
            <div className="type">Öneri</div>
            <div style={{fontWeight:700}}>{x.title}</div>
            <div style={{opacity:.8, fontSize:13, marginTop:6}}>Sana göre seçildi — parmak şıklatman kadar yakın.</div>
          </div>
        ))}
      </div>

      <Footer/>
      <Assistant/>
    </div>
  )
}
