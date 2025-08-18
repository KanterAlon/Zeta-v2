import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import InfoButtons from '../components/InfoButtons';
import NutritionEvaluation from '../components/NutritionEvaluation';
import Functionalities from '../components/Functionalities';
import CommunityPosts from '../components/CommunityPosts';
import ContactSection from '../components/ContactSection';
import ProfilePopup from '../components/ProfilePopup';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const HomePage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const handleClose = () => {
    localStorage.setItem('healthPopupSeen', 'true');
    setShowPopup(false);
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const checkProfile = async () => {
      try {
        const token = await getToken({ template: 'integration_fallback' });
        if (!token) return;
        const auth = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        if (!auth.data.authenticated) return;
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        const seen = localStorage.getItem('healthPopupSeen');
        if (!seen && !res.data.completo) setShowPopup(true);
      } catch (err) {
        console.error('Error al verificar perfil', err);
      }
    };

    const timer = setTimeout(checkProfile, 300);
    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <div className="index-main">
      <HeroSection />
      <InfoButtons />
      <NutritionEvaluation />
      <Functionalities />
      {/* Sección que muestra publicaciones de la comunidad, ideal para fomentar la participación del usuario: <CommunityPosts/>*/}
      <ContactSection />
      <ProfilePopup isOpen={showPopup} onClose={handleClose} onSaved={handleClose} />
    </div>
  );
};

export default HomePage;
