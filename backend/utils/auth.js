function getUserEmail(req) {
  const email = req.session?.Usuario;
  if (!email) throw new Error('Usuario no autenticado');
  return email;
}

module.exports = { getUserEmail };
