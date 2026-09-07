import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { utilisateur, seDeconnecter } = useAuth();
  const navigate = useNavigate();

  // Liste dynamique des projets et états de la modale
  const [projets, setProjets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nomProjet, setNomProjet] = useState('');
  const [progression, setProgression] = useState(0);

  // 1. Charger la liste des projets au chargement du composant
  const chargerProjets = async () => {
    try {
      const response = await fetch('http://localhost:3001/projets');
      const data = await response.json();
      setProjets(data);
    } catch (err) {
      console.error('Erreur lors du chargement des projets:', err);
    }
  };

  useEffect(() => {
    chargerProjets();
  }, []);

  // 2. Créer un nouveau projet via POST
  const handleCreateProject = async (e) => {
    e.preventDefault();

    const nouveauProjet = {
      nom: nomProjet,
      progression: Number(progression),
      userId: utilisateur?.id || 1
    };

    try {
      const response = await fetch('http://localhost:3001/projets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nouveauProjet)
      });

      if (response.ok) {
        // Mettre à jour la liste sans recharger la page
        const projetCree = await response.json();
        setProjets((prevProjets) => [...prevProjets, projetCree]);
        
        // Réinitialiser le formulaire et fermer la modale
        setNomProjet('');
        setProgression(0);
        setShowModal(false);
      }
    } catch (err) {
      alert("Erreur lors de la création du projet.");
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
          <Link to="/dashboard" className="menu-item active">Tableau de bord</Link>
          <Link to="/projets" className="menu-item">Mes projets</Link>
          <Link to="/taches" className="menu-item">Toutes les taches</Link>
          <Link to="/parametres" className="menu-item">Parametres</Link>
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
            <h2>Tableau de bord</h2>
            <p className="dash-subtitle">
              Bonjour {utilisateur?.nom || 'Shammah'}, voici l'etat de vos projets.
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
            <span className="stat-value text-dark">27</span>
            <span className="stat-sub">tous projets confondus</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">EN COURS</span>
            <span className="stat-value text-orange">8</span>
            <span className="stat-sub">a terminer cette semaine</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">TERMINEES</span>
            <span className="stat-value text-teal">14</span>
            <span className="stat-sub">51.8 % du total</span>
          </div>
        </div>

        {/* Section Avancement par Projet */}
        <div className="charts-grid">
          <div className="dash-card">
            <h3>Repartition des taches par statut</h3>
            <div className="bar-chart">
              <div className="chart-column">
                <span className="col-val">5</span>
                <div className="bar grey" style={{ height: '50px' }}></div>
                <span className="col-label">A faire</span>
              </div>
              <div className="chart-column">
                <span className="col-val">8</span>
                <div className="bar orange" style={{ height: '80px' }}></div>
                <span className="col-label">En cours</span>
              </div>
              <div className="chart-column">
                <span className="col-val">14</span>
                <div className="bar teal" style={{ height: '130px' }}></div>
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