export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '100vh',
      backgroundColor: 'white',
      padding: '20px'
    }}>
      {/* Center Logo */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src="/messenger_logo.jpg"
          alt="Messenger Logo"
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Bottom From Meta - Placed at very bottom */}
      <div style={{
        textAlign: 'center',
        marginBottom: '0px'
      }}>
        <p style={{
          color: '#9CA3AF',
          fontSize: '14px',
          marginBottom: '0px'
        }}>from</p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src="/meta-logo.jpg"
            alt="Meta Logo"
            style={{
              width: '70px',
              height: '70px',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
    </div>
  );
}