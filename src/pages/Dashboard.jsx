import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { utilisateur, avatar, mettreAJourAvatar, seDeconnecter } = useAuth();
  const navigate = useNavigate();

  // États pour les projets, les tâches et la modale de création
  const [projets, setProjets] = useState([]);
  const [taches, setTaches] = useState([]); // <-- Ajout de l'état pour stocker les tâches dynamiques
  const [showModal, setShowModal] = useState(false);
  const [nomProjet, setNomProjet] = useState('');
  const [progression, setProgression] = useState(0);

  // Gestion de l'upload de l'avatar via l'AuthContext
  const handleAvatarClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      mettreAJourAvatar(imageUrl);
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

  // Charger la liste des projets
  const chargerProjets = async () => {
    try {
      const response = await fetch('http://localhost:3000/projets');
      const data = await response.json();
      setProjets(data);
    } catch (err) {
      console.error('Erreur lors du chargement des projets:', err);
    }
  };

  // Charger la liste des tâches pour rendre les statistiques dynamiques
  const chargerTaches = async () => {
    try {
      // Ajuste l'URL du port selon ton API backend (ex: port 3001 pour les tâches)
      const response = await fetch('http://localhost:3000/taches');
      const data = await response.json();
      setTaches(data);
    } catch (err) {
      console.error('Erreur lors du chargement des tâches:', err);
    }
  };

  useEffect(() => {
    chargerProjets();
    chargerTaches();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    const nouveauProjet = {
      nom: nomProjet,
      progression: Number(progression),
      userId: utilisateur?.id || 1
    };

    try {
      const response = await fetch('http://localhost:3000/projets', {
        method: method, // Note: s'assure d'utiliser POST pour la création
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nouveauProjet)
      });

      if (response.ok) {
        const projetCree = await response.json();
        setProjets((prevProjets) => [...prevProjets, projetCree]);
        setNomProjet('');
        setProgression(0);
        setShowModal(false);
      }
    } catch (err) {
      alert("Erreur lors de la création du projet.");
    }
  };

  // --- CALCULS DYNAMIQUES DES TÂCHES ---
  const totalTaches = taches.length;

  // Filtrage intelligent gérant les variations d'écriture (accents, majuscules, espaces)
  const tachesAFaire = taches.filter((t) => {
    const statut = (t.statut || '').toLowerCase().replace(/[\s_]+/g, '');
    return statut === 'afaire' || statut === 'àfaire';
  }).length;

  const tachesEnCours = taches.filter((t) => {
    const statut = (t.statut || '').toLowerCase().replace(/[\s_]+/g, '');
    return statut === 'encours';
  }).length;

  const tachesTerminees = taches.filter((t) => {
    const statut = (t.statut || '').toLowerCase().replace(/[\s_]+/g, '');
    return statut === 'terminee' || statut === 'terminée';
  }).length;

  // Calcul du pourcentage global de tâches terminées
  const pourcentageTerminees = totalTaches > 0 ? ((tachesTerminees / totalTaches) * 100).toFixed(1) : 0;

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
          <Link to="/dashboard" className="menu-item active">Tableau de bord</Link>
          <Link to="/projets" className="menu-item">Mes projets</Link>
          <Link to="/taches" className="menu-item">Toutes les taches</Link>
          <Link to="/parametres" className="menu-item">Parametres</Link>
        </nav>

        <div className="dash-user-profile">
          <input 
            type="file" 
            id="fileInput" 
            style={{ display: 'none' }} 
            accept="image/*" 
            onChange={handleFileChange}
          />

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

      {/* Contenu Principal */}
      <main className="dash-content">
        <header className="dash-header">
          <div>
            <h2>Tableau de bord</h2>
            <p className="dash-subtitle">
              Bonjour {utilisateur?.nom || 'Resia'}, voici l'etat de vos projets.
            </p>
          </div>
          <button className="btn-new-project" onClick={() => setShowModal(true)}>
            + Nouveau projet
          </button>
        </header>

        {/* Modale de Création */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Créer un nouveau projet</h3>
              <form onSubmit={handleCreateProject} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Nom du projet</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Refonte site web"
                    value={nomProjet}
                    onChange={(e) => setNomProjet(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Progression initiale (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-input"
                    value={progression}
                    onChange={(e) => setProgression(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn-submit-green">
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Statistiques Dynamiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">PROJETS</span>
            <span className="stat-value text-teal">{projets.length}</span>
            <span className="stat-sub">projets enregistrés</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">TOTAL TACHES</span>
            <span className="stat-value text-dark">{totalTaches}</span>
            <span className="stat-sub">tous projets confondus</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">EN COURS</span>
            <span className="stat-value text-orange">{tachesEnCours}</span>
            <span className="stat-sub">tâches en cours</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">TERMINEES</span>
            <span className="stat-value text-teal">{tachesTerminees}</span>
            <span className="stat-sub">{pourcentageTerminees} % du total</span>
          </div>
        </div>

        {/* Section Avancement par Projet et Graphique */}
        <div className="charts-grid">
          <div className="dash-card">
            <h3>Repartition des taches par statut</h3>
            <div className="bar-chart">
              <div className="chart-column">
                <span className="col-val">{tachesAFaire}</span>
                <div className="bar grey" style={{ height: `${Math.max(tachesAFaire * 10, 15)}px` }}></div>
                <span className="col-label">A faire</span>
              </div>
              <div className="chart-column">
                <span className="col-val">{tachesEnCours}</span>
                <div className="bar orange" style={{ height: `${Math.max(tachesEnCours * 10, 15)}px` }}></div>
                <span className="col-label">En cours</span>
              </div>
              <div className="chart-column">
                <span className="col-val">{tachesTerminees}</span>
                <div className="bar teal" style={{ height: `${Math.max(tachesTerminees * 10, 15)}px` }}></div>
                <span className="col-label">Terminee</span>
              </div>
            </div>
          </div>

          <div className="dash-card">
            <h3>Avancement par projet</h3>
            <div className="progress-list">
              {projets.length > 0 ? (
                projets.map((projet) => (
                  <div key={projet.id} className="progress-item">
                    <div className="progress-info">
                      <strong>{projet.nom}</strong>
                      <span>{projet.progression} %</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${projet.progression}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="card-empty-text">Aucun projet trouvé.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};