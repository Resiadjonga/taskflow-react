import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = ({ children }) => {
  const { utilisateur, seDeconnecter } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    seDeconnecter();
    navigate('/connexion');
  };

  const initiales = utilisateur?.nom
    ? utilisateur.nom.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'SN';

  return (
    <div className="dash-container">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <h1 className="logo-title">
            Task<span className="logo-highlight">Flow</span>
          </h1>
          <p className="brand-subtitle">Gestion de projets</p>
        </div>

        <nav className="dash-menu">
          <Link to="/dashboard" className="menu-item">Tableau de bord</Link>
          <Link to="/projets" className="menu-item">Mes projets</Link>
          <Link to="/taches" className="menu-item">Toutes les taches</Link>
          <Link to="/parametres" className="menu-item">Parametres</Link>
        </nav>

        <div className="dash-user-profile">
          <div className="avatar">{initiales}</div>
          <div className="user-details">
            <p className="user-name">{utilisateur?.nom || 'Resia D.'}</p>
            <button onClick={handleLogout} className="btn-logout-link">
              Se deconnecter
            </button>
          </div>
        </div>
      </aside>

      <main className="dash-content">
        {children}
      </main>
    </div>
  );
};