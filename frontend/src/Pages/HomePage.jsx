import React from 'react';
import HeroSection from '../components/HeroSection';
import InfoButtons from '../components/InfoButtons';
import NutritionEvaluation from '../components/NutritionEvaluation';
import Functionalities from '../components/Functionalities';
import CommunityPosts from '../components/CommunityPosts(unused)';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <InfoButtons />
      <NutritionEvaluation />
      <Functionalities />
      {/* Sección que muestra publicaciones de la comunidad, ideal para fomentar la participación del usuario: <CommunityPosts/>*/}
      <ContactSection />
    </>
  );
};

export default HomePage;
