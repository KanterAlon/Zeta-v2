import React, { useState } from 'react';
import axios from 'axios';
import '../styles/contact-page.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: 'Duda',
    message: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', reason: 'Duda', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-image-section">
        <img src="/img/img_contacto.svg" alt="Contacto" />
      </div>
      <div className="contact-form-section">
        <h2>Contacto</h2>
        <p>Envíanos tus dudas, inquietudes o sugerencias.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Tu nombre"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="email@ejemplo.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="reason">Motivo</label>
            <select id="reason" name="reason" value={formData.reason} onChange={handleChange}>
              <option value="Duda">Duda</option>
              <option value="Inquietud">Inquietud</option>
              <option value="Sugerencia">Sugerencia</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensaje</label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Escribe tu mensaje"
            />
          </div>
          <button type="submit" className="send-message-button">Enviar</button>
          {status === 'success' && <p>Mensaje enviado correctamente.</p>}
          {status === 'error' && <p>Ocurrió un error al enviar tu mensaje.</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
