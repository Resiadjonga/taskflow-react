import { useState, useCallback } from 'react';

export const useApi = (baseUrl = 'http://localhost:3000') => {
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  const executerRequete = useCallback(async (endpoint, options = {}) => {
    setChargement(true);
    setErreur(null);

    try {
      const reponse = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!reponse.ok) {
        throw new Error(`Erreur HTTP : ${reponse.status}`);
      }

      const data = await reponse.json();
      return data;
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setChargement(false);
    }
  }, [baseUrl]);

  return { executerRequete, chargement, erreur };
};