export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 16px',
      background: '#030712'
    }}>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(20,184,166,0.1)',
        border: '1px solid rgba(20,184,166,0.2)',
        borderRadius: '9999px',
        padding: '6px 16px',
        marginBottom: '24px'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#2dd4bf',
          display: 'inline-block'
        }}></span>
        <span style={{ color: '#5eead4', fontSize: '14px', fontWeight: 500 }}>
          AI-Powered Property Search
        </span>
      </div>

      <h1 style={{
        fontSize: 'clamp(36px, 6vw, 64px)',
        fontWeight: 700,
        lineHeight: 1.1,
        marginBottom: '24px',
        letterSpacing: '-1px'
      }}>
        Find Your{' '}
        <span style={{ color: '#2dd4bf' }}>Perfect Home</span>
        <br />
        in Kenya
      </h1>

      <p style={{
        color: '#9ca3af',
        fontSize: '18px',
        maxWidth: '480px',
        lineHeight: 1.7,
        marginBottom: '40px'
      }}>
        Tell Nyumba what you are looking for in plain English.
        Our AI finds properties that match your lifestyle,
        budget, and location across Kenya.
      </p>

      <p style={{ color: '#6b7280', fontSize: '14px' }}>
        Click the chat button in the bottom right corner to get started
      </p>

      <div style={{
        marginTop: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>2,400+</div>
          <div>Properties listed</div>
        </div>
        <div style={{ width: '1px', height: '32px', background: '#374151' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>47</div>
          <div>Nairobi neighborhoods</div>
        </div>
        <div style={{ width: '1px', height: '32px', background: '#374151' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'white' }}>98%</div>
          <div>Match accuracy</div>
        </div>
      </div>

    </main>
  );
}