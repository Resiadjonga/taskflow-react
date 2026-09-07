import { createContext, useState, useContext, useEffect } from 'react';

// 1. Création du contexte
export const AuthContext = createContext();

// 2. Provider qui gère l'état global de l'utilisateur et de l'avatar
export const AuthProvider = ({ children }) => {
  // Récupérer l'utilisateur depuis le localStorage s'il existe
  const [utilisateur, setUtilisateur] = useState(() => {
    const savedUser = localStorage.getItem('utilisateur');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Gérer l'avatar avec persistance dans le localStorage
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem('avatarProfil') || null;
  });

  const mettreAJourAvatar = (newAvatarUrl) => {
    setAvatar(newAvatarUrl);
    localStorage.setItem('avatarProfil', newAvatarUrl);
  };

  const seConnecter = (donneesUtilisateur) => {
    setUtilisateur(donneesUtilisateur);
    localStorage.setItem('utilisateur', JSON.stringify(donneesUtilisateur));
  };

  const seDeconnecter = () => {
    setUtilisateur(null);
    setAvatar(null);
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('avatarProfil');
  };

  return (
    <AuthContext.Provider value={{ utilisateur, avatar, mettreAJourAvatar, seConnecter, seDeconnecter }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Le fameux Hook useAuth
export const useAuth = () => {
  return useContext(AuthContext);
};