import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ProfilePopup from './ProfilePopup';
import { useProfilePopup } from '../context/ProfilePopupContext';

const Layout = ({ children }) => {
  const { isProfileOpen, closeProfile } = useProfilePopup();
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ProfilePopup
        isOpen={isProfileOpen}
        onClose={closeProfile}
        onSaved={closeProfile}
      />
    </>
  );
};

export default Layout;
