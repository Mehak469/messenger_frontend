export default function Footer() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '0px' }}>
      <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '0px' }}>from</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/meta-logo.jpg"
          alt="Meta Logo"
          style={{ width: '70px', height: '70px', objectFit: 'contain' }}
        />
      </div>
    </div>
  );
}
