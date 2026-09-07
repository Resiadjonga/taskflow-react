import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = ({ children }) => {
  const { utilisateur, avatar, mettreAJourAvatar, seDeconnecter } = useAuth();
  const navigate = useNavigate();

  // Gestion de l'upload de l'avatar
  const handleAvatarClick = () => {
    document.getElementById('fileInputLayout').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      mettreAJourAvatar(imageUrl); // Sauvegarde globale via le contexte
    }
  };

  // Gestion de la déconnexion avec confirmation
  const handleLogout = () => {
    const confirmation = window.confirm("Voulez-vous vraiment vous déconnecter ?");
    if (confirmation) {
      seDeconnecter();
      navigate('/connexion');
    }
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
          {/* Input file caché pour importer une image */}
          <input 
            type="file" 
            id="fileInputLayout" 
            style={{ display: 'none' }} 
            accept="image/*" 
            onChange={handleFileChange}
          />

          {/* Avatar cliquable */}
          <div 
            className="avatar" 
            onClick={handleAvatarClick} 
            style={{ cursor: 'pointer', overflow: 'hidden' }}
            title="Cliquez pour changer la photo de profil"
          >
            {avatar ? (
              <img src={avatar} alt="Profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initiales
            )}
          </div>

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