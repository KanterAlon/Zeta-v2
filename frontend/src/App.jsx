import { useState } from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const verificarEmail = async () => {
    if (!email) return;
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:3000/api/existeMail?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setResultado(data.existe ? '✅ El email ya está registrado.' : '❌ El email no existe en la base.');
    } catch (err) {
      setResultado('⚠️ Error al verificar el email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif', maxWidth: 500, margin: '0 auto' }}>
      <h1>Verificador de Email</h1>
      <input
        type="email"
        placeholder="Ingresá tu email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 12 }}
      />
      <button onClick={verificarEmail} disabled={loading} style={{ padding: 8, width: '100%' }}>
        {loading ? 'Verificando...' : 'Verificar email'}
      </button>
      {resultado && (
        <p style={{ marginTop: 16, fontWeight: 'bold', color: resultado.includes('✅') ? 'green' : 'red' }}>
          {resultado}
        </p>
      )}
    </div>
  );
}

export default App;
