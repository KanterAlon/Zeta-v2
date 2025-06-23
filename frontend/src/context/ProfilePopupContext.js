import React, { createContext, useContext, useState } from 'react';

const ProfilePopupContext = createContext();

export const useProfilePopup = () => useContext(ProfilePopupContext);

export const ProfilePopupProvider = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);

  return (
    <ProfilePopupContext.Provider value={{ isProfileOpen, openProfile, closeProfile }}>
      {children}
    </ProfilePopupContext.Provider>
  );
};
