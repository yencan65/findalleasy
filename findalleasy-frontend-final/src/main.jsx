import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #001F3F, #0074D9)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>FindAllEasy</h1>
      <h3>Yazman yeterli, gerisini biz hallederiz.</h3>
      <button style={{
        background: '#0074D9',
        border: 'none',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '20px'
      }} onClick={() => new Audio('/snap.mp3').play()}>
        Parmak Şıklat 🔊
      </button>
      <footer style={{ position: 'absolute', bottom: '20px', fontSize: '12px', opacity: 0.8, textAlign: 'center' }}>
        ©2025 Yapay zeka destekli global fiyat karşılaştırma asistanın.<br/>
        Güvenilir satıcıyla birlikte en uygun fiyatı senin için bulur.<br/>Parmak şıklatman yeter.
      </footer>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)