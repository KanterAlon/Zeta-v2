import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [patologias, setPatologias] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    edad: '',
    sexo: '',
    peso: '',
    altura: '',
    patologiaId: '',
    newPatologia: '',
    actividadId: '',
    newActividad: '',
    frecuencia: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, aRes, perfilRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/patologias`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/actividades`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/user/me`, { withCredentials: true })
        ]);

        setPatologias(pRes.data);
        setActividades(aRes.data);
        const perfil = perfilRes.data.perfil || {};
        setForm({
          edad: perfil.edad || '',
          sexo: perfil.sexo === true ? '1' : perfil.sexo === false ? '0' : '',
          peso: perfil.peso || '',
          altura: perfil.altura || '',
          patologiaId: perfil.patologias?.[0]?.id || '',
          newPatologia: '',
          actividadId: perfil.actividades?.[0]?.id || '',
          newActividad: '',
          frecuencia: perfil.actividades?.[0]?.frecuencia || ''
        });
      } catch (err) {
        console.error('Error al cargar datos de perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      edad: form.edad ? parseInt(form.edad) : null,
      sexo: form.sexo !== '' ? form.sexo === '1' : null,
      peso: form.peso ? parseFloat(form.peso) : null,
      altura: form.altura ? parseFloat(form.altura) : null,
      patologias: form.newPatologia ? [{ nombre: form.newPatologia }] : form.patologiaId && form.patologiaId !== 'custom' ? [{ id: parseInt(form.patologiaId) }] : [],
      actividades: (form.newActividad || form.actividadId) ? [{
        id: form.newActividad ? undefined : form.actividadId === 'custom' ? undefined : parseInt(form.actividadId),
        nombre: form.actividadId === 'custom' ? form.newActividad : undefined,
        frecuencia: form.frecuencia ? parseInt(form.frecuencia) : 0
      }] : []
    };
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/update`, payload, { withCredentials: true });
      alert('Perfil actualizado');
    } catch (err) {
      console.error(err);
      alert('Error al guardar');
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <section className="profile-page">
      <div className="profile-container">
        <h1>Mi Perfil</h1>
        <form onSubmit={handleSubmit} className="profile-form">
          <input type="number" name="edad" placeholder="Edad" value={form.edad} onChange={handleChange} />
          <select name="sexo" value={form.sexo} onChange={handleChange}>
            <option value="">Sexo</option>
            <option value="1">Masculino</option>
            <option value="0">Femenino</option>
          </select>
          <input type="number" name="peso" placeholder="Peso (kg)" value={form.peso} onChange={handleChange} />
          <input type="number" name="altura" placeholder="Altura (cm)" value={form.altura} onChange={handleChange} />

          <select name="patologiaId" value={form.patologiaId} onChange={handleChange}>
            <option value="">Selecciona patología</option>
            {patologias.map(p => (
              <option key={p.id_patologia} value={p.id_patologia}>{p.nombre_patologia}</option>
            ))}
            <option value="custom">Otra...</option>
          </select>
          {form.patologiaId === 'custom' && (
            <input type="text" name="newPatologia" placeholder="Tu patología" value={form.newPatologia} onChange={handleChange} />
          )}

          <select name="actividadId" value={form.actividadId} onChange={handleChange}>
            <option value="">Actividad física</option>
            {actividades.map(a => (
              <option key={a.id_actividad} value={a.id_actividad}>{a.nombre_actividad}</option>
            ))}
            <option value="custom">Otra...</option>
          </select>
          {form.actividadId === 'custom' && (
            <input type="text" name="newActividad" placeholder="Tu actividad" value={form.newActividad} onChange={handleChange} />
          )}
          <input type="number" name="frecuencia" placeholder="Horas semanales" value={form.frecuencia} onChange={handleChange} />

          <button type="submit" className="publish-btn">Guardar</button>
        </form>
      </div>
    </section>
  );
};

export default ProfilePage;
