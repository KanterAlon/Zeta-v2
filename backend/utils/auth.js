const { clerkClient } = require('@clerk/clerk-sdk-node');

async function getUserEmail(req) {
  const userId = req.auth?.userId;
  if (!userId) throw new Error('Usuario no autenticado');
  const user = await clerkClient.users.getUser(userId);
  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error('Usuario no autenticado');
  return email;
}

module.exports = { getUserEmail };
