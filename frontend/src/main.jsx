import React from 'react'
import ReactDOM from 'react-dom/client'
import AIAsistan from './components/AIAsistan'

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(120deg,#001F3F,#0c2746,#0ea5e9)',
      backgroundSize:'300% 300%', animation:'shift 12s ease infinite', color:'#fff', textAlign:'center'
    }}>
      <h1 style={{ fontSize:44, marginBottom:8 }}>FindAllEasy</h1>
      <h3 style={{ marginTop:0, opacity:.9, textDecoration:'underline', textUnderlineOffset:4 }}>Yazman yeterli, gerisini biz hallederiz.</h3>
      <button onClick={() => new Audio('/snap.mp3').play()} style={{
        marginTop:16, background:'#0ea5e9', border:'none', color:'#fff', padding:'10px 18px', borderRadius:10, cursor:'pointer', fontWeight:700
      }}>Parmak Şıklat 🔊</button>
      <footer style={{ position:'absolute', bottom:18, fontSize:12, opacity:.9 }}>
        ©2025 Yapay zeka destekli global fiyat karşılaştırma asistanın. Güvenilir satıcıyla birlikte en uygun fiyatı
        senin için bulur. Parmak şıklatman yeter.
      </footer>
      <AIAsistan />
      <style>{`@keyframes shift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`}</style>
    </div>
  )
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
