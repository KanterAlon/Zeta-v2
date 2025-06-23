import React from 'react';

const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="contact-inner">
        <div className="contact-image">
          <img src="./img/img_contact.svg" alt="Contacto" />
        </div>
        <div className="contact-content">
          <h2 style={{ color: 'var(--primary-color)' }}>¿Te quedó alguna inquietud?</h2>
          <h3>Escribinos que a la brevedad te contestamos.</h3>
          <a href="/contact" className="contact-button">
            <span>Ir a contacto</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
