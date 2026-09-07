import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoutePrivee } from './components/RoutePrivee';
import { Connexion } from './pages/Connexion';
import { Inscription } from './pages/Inscription';
import { Dashboard } from './pages/Dashboard';
import { Projets } from './pages/Projets';
import { Taches } from './pages/Taches';
import { Parametres } from './pages/Paramettre';
import './App.css'; 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />
          
          <Route path="/dashboard" element={<RoutePrivee><Dashboard /></RoutePrivee>} />
          <Route path="/projets" element={<RoutePrivee><Projets /></RoutePrivee>} />
          <Route path="/taches" element={<RoutePrivee><Taches /></RoutePrivee>} />
          <Route path="/parametres" element={<Parametres />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
         
      
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;