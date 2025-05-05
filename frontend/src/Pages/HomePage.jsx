import React from 'react';
import HeroSection from '../components/HeroSection';
import InfoButtons from '../components/InfoButtons';
import NutritionEvaluation from '../components/NutritionEvaluation';
import Functionalities from '../components/Functionalities';
import CommunityPosts from '../components/CommunityPosts';
import ContactSection from '../components/ContactSection';

const HomePage = () => {
  return (
    <div class="index-main">
      <HeroSection />
      <InfoButtons />
      <NutritionEvaluation />
      <Functionalities />
      <CommunityPosts />
      <ContactSection />
    </div>
  );
};

export default HomePage;
