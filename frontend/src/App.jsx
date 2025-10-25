import React from 'react'
import LogoAnimated from './components/LogoAnimated.jsx'

export default function App() {
  return (
    <>
      <LogoAnimated />
      <main style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(120deg,#001F3F,#072B57,#0ea5e9)',
        color: '#fff', textAlign: 'center', fontFamily: 'Inter, system-ui, Arial'
      }}>
        <h1 style={{ fontSize: '44px', marginBottom: 8 }}>FindAllEasy</h1>
        <p style={{ opacity: .9, marginBottom: 16 }}>Yazman yeterli, gerisini biz hallederiz.</p>
        <div>
          <button onClick={() => new Audio('/snap.mp3').play()} style={{
            background:'#0ea5e9', border:'none', color:'#fff',
            padding:'10px 18px', borderRadius:10, cursor:'pointer', fontWeight:700
          }}>Ara</button>
        </div>
        <footer style={{ position:'absolute', bottom:18, fontSize:12, opacity:.9 }}>
          ©2025 Yapay zeka destekli global fiyat karşılaştırma asistanın.
          Güvenilir satıcıyla birlikte en uygun fiyatı senin için bulur.
          Parmak şıklatman yeter.
        </footer>
      </main>
    </>
  )
}
