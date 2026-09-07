import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useApi } from '../Hooks/useApi';

export const Projets = () => {
  const [projets, setProjets] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // États pour la création ou la modification
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [nomProjet, setNomProjet] = useState('');
  const [description, setDescription] = useState('');
  const [progression, setProgression] = useState(0);

  const { executerRequete, chargement, erreur } = useApi();

  const chargerProjets = async () => {
    try {
      const data = await executerRequete('/projets');
      setProjets(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    chargerProjets();
  }, [executerRequete]);

  // Filtrer les projets selon la recherche
  const projetsFiltres = projets.filter((p) =>
    (p.nom || p.titre || '').toLowerCase().includes(recherche.toLowerCase())
  );

  // Ouvrir la modale pour la création
  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setNomProjet('');
    setDescription('');
    setProgression(0);
    setShowModal(true);
  };

  // Ouvrir la modale pour la modification avec les données existantes
  const handleOpenEdit = (projet) => {
    setIsEditing(true);
    setCurrentId(projet.id);
    setNomProjet(projet.nom || projet.titre || '');
    setDescription(projet.description || '');
    setProgression(projet.progression || 0);
    setShowModal(true);
  };

  // Soumission du formulaire (Création POST ou Modification PUT)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const projetData = {
      nom: nomProjet,
      description: description,
      progression: Number(progression),
      userId: 1
    };

    try {
      const url = isEditing 
        ? `http://localhost:3001/projets/${currentId}` 
        : 'http://localhost:3001/projets';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projetData)
      });

      if (response.ok) {
        await chargerProjets(); // Recharge la liste mise à jour depuis le serveur
        setShowModal(false);
      }
    } catch (err) {
      alert("Erreur lors de l'enregistrement du projet.");
    }
  };

  // Supprimer un projet
  const handleSupprimer = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      try {
        const response = await fetch(`http://localhost:3001/projets/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setProjets(projets.filter((p) => p.id !== id));
        }
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  // Ouvrir les détails du projet (redirection ou action personnalisée)
  const handleOuvrir = (projet) => {
    alert(`Ouverture du projet : ${projet.nom || projet.titre}`);
    // Si tu as une page de détail, tu peux utiliser navigate(`/projets/${projet.id}`) ici
  };

  if (chargement) return <Layout><p className="state-message">Chargement des projets...</p></Layout>;
  if (erreur) return <Layout><p className="state-message error">Erreur : {erreur}</p></Layout>;

  return (
    <Layout>
      <div className="projets-header">
        <div>
          <h1 className="projets-title">Mes projets</h1>
          <p className="projets-subtitle">{projets.length} projets — 27 tâches au total</p>
        </div>
        <button className="btn-add-projet" onClick={handleOpenCreate}>
          + Nouveau projet
        </button>
      </div>

      <div className="projets-filter-bar">
        <input 
          type="text" 
          placeholder="Rechercher un projet..." 
          className="projets-search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <select className="projets-sort">
          <option>Trier par : recent</option>
        </select>
      </div>

      {/* Modale unique pour Création et Modification */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? "Modifier le projet" : "Créer un nouveau projet"}</h3>
            <form onSubmit={handleSubmitForm} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nom du projet</label>
                <input
                  type="text"
                  className="form-input"
                  value={nomProjet}
                  onChange={(e) => setNomProjet(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Progression (%)</label>
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
                  {isEditing ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grille des projets */}
      <div className="projets-grid">
        {projetsFiltres.length > 0 ? (
          projetsFiltres.map((p) => (
            <div key={p.id} className="projet-card">
              <div className="card-top">
                <h3 className="projet-name">
                  <span className="dot-status">🟢</span> {p.nom || p.titre}
                </h3>
                <p className="projet-desc">{p.description || "Aucune description fournie."}</p>
              </div>
              <div className="card-bottom">
                <div className="progress-info">
                  <span>8 tâches</span>
                  <span className="progress-percent">{p.progression || 0} %</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${p.progression || 0}%` }}></div>
                </div>
                <div className="card-actions">
                  <button className="btn-card" onClick={() => handleOuvrir(p)}>Ouvrir</button>
                  <button className="btn-card" onClick={() => handleOpenEdit(p)}>Modifier</button>
                  <button className="btn-card danger" onClick={() => handleSupprimer(p.id)}>Supprimer</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="state-message">Aucun projet ne correspond à votre recherche.</p>
        )}

        {/* Carte pointillée */}
        <div className="projet-card projet-card-dashed" onClick={handleOpenCreate}>
          <span>+ Créer un nouveau projet</span>
        </div>
      </div>
    </Layout>
  );
};