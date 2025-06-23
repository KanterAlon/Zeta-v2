const nodemailer = require('nodemailer');

const sendContactEmail = async (req, res) => {
  const { name, email, reason, message } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: 'wearezeta.contacto@gmail.com',
      subject: `Contacto desde Zeta - ${reason}`,
      html: `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Motivo:</strong> ${reason}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Error sending contact email:', err);
    res.status(500).json({ success: false, message: 'Error al enviar el correo' });
  }
};

module.exports = { sendContactEmail };
