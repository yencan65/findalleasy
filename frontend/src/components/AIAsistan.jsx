import React, { useState } from 'react';

export default function AIAsistan() {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState('');

  return (
    <div style={{ position:'fixed', right: 24, bottom: 24, zIndex: 9999 }}>
      {!open && (
        <button onClick={() => setOpen(true)} style={{
          width: 56, height: 56, borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg,#0074D9,#00BFFF)', color:'#fff',
          boxShadow:'0 8px 20px rgba(0,0,0,.25)', cursor:'pointer', fontWeight:700
        }}>AI</button>
      )}
      {open && (
        <div style={{
          width: 320, height: 420, background:'#111827', color:'#E5E7EB',
          borderRadius: 14, boxShadow:'0 10px 30px rgba(0,0,0,.35)', overflow:'hidden', position:'relative'
        }}>
          <div style={{ background:'#0ea5e9', color:'#fff', padding:'10px 12px', fontWeight:700 }}>FindAllEasy Asistan</div>
          <div style={{ padding:12, fontSize:13, opacity:.9 }}>
            Merhaba! Öneri istiyorsan aşağıya yaz, ben de en iyi aramayı başlatmana yardım edeyim.
          </div>
          <div style={{ position:'absolute', right:8, top:8 }}>
            <button onClick={()=>setOpen(false)} style={{ border:'none', background:'transparent', color:'#fff', fontSize:16, cursor:'pointer' }}>✖</button>
          </div>
          <div style={{ position:'absolute', bottom:12, left:12, right:12, display:'flex', gap:8 }}>
            <input
              placeholder="örn. İstanbul otel kampanya"
              value={val}
              onChange={e=>setVal(e.target.value)}
              style={{ flex:1, padding:'8px 10px', borderRadius:8, border:'1px solid #374151', background:'#1f2937', color:'#e5e7eb' }}
            />
            <button onClick={() => { new Audio('/snap.mp3').play(); alert('Öneri: ' + (val||'popüler fırsatlar')); }}
              style={{ padding:'8px 12px', borderRadius:8, border:'none', background:'#0ea5e9', color:'#fff', fontWeight:700, cursor:'pointer' }}>
              Gönder
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
