import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const RoutePrivee = ({ children }) => {
  const { utilisateur } = useContext(AuthContext);

  if (!utilisateur) {
    return <Navigate to="/connexion" replace />;
  }

  return children;
};