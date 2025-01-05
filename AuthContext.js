import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from './firebase'; // Assure-toi d'importer ton instance Firebase

// Crée le contexte d'authentification
const AuthContext = createContext();

// Le fournisseur d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // L'état de l'utilisateur, null = non connecté

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser); // Écoute l'état de l'utilisateur sur Firebase

    return () => unsubscribe(); // Clean-up lors du démontage du composant
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour récupérer l'utilisateur dans n'importe quel composant
export const useAuth = () => {
  return useContext(AuthContext);
};
