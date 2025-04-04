import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');



  // Cargar usuarios al iniciar
  useEffect(() => {
    axios.get('http://localhost:3001/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error('Error al obtener usuarios:', err));
  }, []);

  // Agregar usuario
  const handleAgregar = () => {
    if (!nombre || !email) return;
    axios.post('http://localhost:3001/usuarios', { nombre, email })
      .then(res => {
        setUsuarios([...usuarios, res.data]);
        setNombre('');
        setEmail('');
      })
      .catch(err => console.error('Error al agregar usuario:', err));
  };

  return (
    <div className="App">
      <h1>Lista de Usuarios</h1>
      <ul>
        {usuarios.map(user => (
          <li key={user.id}>{user.nombre} ({user.email})</li>
        ))}
      </ul>

      <h2>Agregar Usuario</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={handleAgregar}>Agregar</button>
    </div>
  );
}

export default App;
