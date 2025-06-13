import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import axios from 'axios';

export default function ClerkSync() {
  const { isLoaded, userId, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded || !userId) return;
    (async () => {
      try {
        const token = await getToken();
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/clerk/sync`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } catch (err) {
        console.error('Failed to sync user', err);
      }
    })();
  }, [isLoaded, userId, getToken]);

  return null;
}
