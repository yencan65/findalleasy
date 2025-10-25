import React from 'react';
import LogoAnimated from './components/LogoAnimated';

function App() {
  return (
    <>
      {/* Sol üstte parmak şıklatma logosu */}
      <LogoAnimated />

      {/* Diğer sayfa içerikleri */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom, #001F3F, #002B5B)',
        color: 'white',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          FindAllEasy
        </h1>
        <p style={{ fontSize: '1.2rem' }}>
          Yazman yeterli, gerisini biz hallederiz.
        </p>
      </main>
    </>
  );
}

export default App;
