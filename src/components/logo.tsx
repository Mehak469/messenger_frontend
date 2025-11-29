export default function Logo() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img
        src="/messenger_logo.jpg"
        alt="Messenger Logo"
        style={{ width: '80px', height: '80px', objectFit: 'contain' }}
      />
    </div>
  );
}
