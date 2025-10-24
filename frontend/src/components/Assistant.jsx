import { useEffect, useState } from 'react'

export default function Assistant(){
  const [open,setOpen] = useState(false)
  useEffect(()=>{ const id=setTimeout(()=>setOpen(true), 6000); return ()=>clearTimeout(id) },[])

  if(!open) return (
    <button onClick={()=>setOpen(true)} style={styles.fab} aria-label="AI Asistan">
      ✨
    </button>
  )

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={{fontWeight:700, marginBottom:6}}>AI Asistan</div>
        <div style={{opacity:.9, marginBottom:10}}>Hangi ürünü arıyorsun? Parmak şıklatman kadar kolay bulalım.</div>
        <button style={styles.btn} onClick={()=>alert('Örnek: kişisel öneriler listelendi')}>Öneri iste</button>
        <button style={{...styles.btn, background:'#2b2b55'}} onClick={()=>setOpen(false)}>Kapat</button>
      </div>
    </div>
  )
}

const styles = {
  fab: { position:'fixed', right:18, bottom:18, width:54, height:54, borderRadius:999,
         background:'linear-gradient(45deg,#6A00FF,#007BFF)', color:'#fff', border:0, fontSize:22 },
  wrap: { position:'fixed', right:18, bottom:18 },
  card: { width:280, padding:14, borderRadius:14, background:'#16162b', color:'#fff', border:'1px solid #2a2a52' },
  btn: { padding:'10px 12px', borderRadius:10, border:0, background:'#3a3aa0', color:'#fff', marginRight:8 }
}
