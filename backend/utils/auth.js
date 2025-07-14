function getUserEmail(req) {
  const email = req.session?.user?.email;
  if (!email) throw new Error('Usuario no autenticado');
  return email;
}

module.exports = { getUserEmail };
