import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Parametres = () => {
  const { utilisateur, seDeconnecter } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    if (utilisateur) {
      setNom(utilisateur.nom || '');
      setEmail(utilisateur.email || '');
      setMotDePasse(utilisateur.motDePasse || '');
    }
  }, [utilisateur]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setErreur('');
    setSucces(false);

    if (!utilisateur?.id) {
      setErreur("Utilisateur non identifié.");
      return;
    }

    try {
      setChargement(true);
      const reponse = await fetch(`http://localhost:3001/utilisateurs/${utilisateur.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nom.trim(),
          email: email.trim(),
          motDePasse: motDePasse.trim()
        })
      });

      if (!reponse.ok) throw new Error("Erreur lors de la mise à jour du profil.");

      setSucces(true);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  const handleLogout = () => {
    seDeconnecter();
    navigate('/connexion');
  };

  const initiales = utilisateur?.nom
    ? utilisateur.nom.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'SN';

  return (
    <div className="dash-container">
      {/* Sidebar Gauche */}
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
          <Link to="/parametres" className="menu-item active">Parametres</Link>
        </nav>

        <div className="dash-user-profile">
          <div className="avatar">{initiales}</div>
          <div className="user-details">
            <p className="user-name">{utilisateur?.nom || 'Shammah N.'}</p>
            <button onClick={handleLogout} className="btn-logout-link">
              Se deconnecter
            </button>
          </div>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="dash-content">
        <header className="dash-header">
          <div>
            <h2>Paramètres du compte</h2>
            <p className="dash-subtitle">Gérez vos informations personnelles.</p>
          </div>
        </header>

        <div className="settings-card">
          {erreur && <p className="inscription-error">{erreur}</p>}
          {succes && (
            <div style={{ padding: '15px', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: '6px', marginBottom: '20px', border: '1px solid #10b981', fontWeight: '600' }}>
              ✓ Modifications enregistrées avec succès !
            </div>
          )}

          <form onSubmit={handleUpdate} className="inscription-form">
            <div className="inscription-group">
              <label>Nom complet</label>
              <input 
                type="text" 
                value={nom} 
                onChange={(e) => setNom(e.target.value)} 
                required 
              />
            </div>
            <div className="inscription-group">
              <label>Adresse e-mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="inscription-group">
              <label>Mot de passe</label>
              <input 
                type="text" 
                value={motDePasse} 
                onChange={(e) => setMotDePasse(e.target.value)} 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={chargement} 
              className="inscription-btn"
            >
              {chargement ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};