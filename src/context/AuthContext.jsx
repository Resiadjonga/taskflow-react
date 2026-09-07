import { createContext, useState, useContext } from 'react';

// 1. Création du contexte
export const AuthContext = createContext();

// 2. Provider qui gère l'état global de l'utilisateur
export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);

  const seConnecter = (donneesUtilisateur) => {
    setUtilisateur(donneesUtilisateur);
  };

  const seDeconnecter = () => {
    setUtilisateur(null);
  };

  return (
    <AuthContext.Provider value={{ utilisateur, seConnecter, seDeconnecter }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Le fameux Hook useAuth
export const useAuth = () => {
  return useContext(AuthContext);
};