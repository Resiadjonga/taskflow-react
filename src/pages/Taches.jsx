import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useApi } from '../Hooks/useApi';

export const Taches = () => {
  const [taches, setTaches] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('toutes');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [priorite, setPriorite] = useState('Haute');
  const [echeance, setEcheance] = useState('12 septembre 2026');
  const [statut, setStatut] = useState('A faire');
  
  const [tacheDetails, setTacheDetails] = useState(null);

  const { executerRequete, chargement, erreur } = useApi();

  const chargerTaches = async () => {
    try {
      const data = await executerRequete('/taches');
      setTaches(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    chargerTaches();
  }, [executerRequete]);

  const tachesFiltrees = taches.filter((t) => {
    const matchTitre = (t.titre || '').toLowerCase().includes(recherche.toLowerCase());
    if (filtreStatut === 'toutes') return matchTitre;
    if (filtreStatut === 'a faire') return matchTitre && (t.statut === 'A faire' || t.statut === 'À faire');
    if (filtreStatut === 'en cours') return matchTitre && t.statut === 'En cours';
    if (filtreStatut === 'terminees') return matchTitre && (t.statut === 'Terminee' || t.statut === 'Terminée');
    return matchTitre;
  });

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitre('');
    setDescription('');
    setPriorite('Haute');
    setEcheance('12 septembre 2026');
    setStatut('A faire');
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setIsEditing(true);
    setCurrentId(t.id);
    setTitre(t.titre || '');
    setDescription(t.description || '');
    setPriorite(t.priorite || 'Haute');
    setEcheance(t.echeance || '12 septembre 2026');
    setStatut(t.statut || 'A faire');
    setShowModal(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const tacheData = { titre, description, priorite, echeance, statut };

    try {
      const url = isEditing 
        ? `http://localhost:3001/taches/${currentId}` 
        : 'http://localhost:3001/taches';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tacheData)
      });

      if (response.ok) {
        await chargerTaches();
        setShowModal(false);
      }
    } catch (err) {
      alert("Erreur lors de l'enregistrement de la tâche.");
    }
  };

  const handleSupprimer = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
      try {
        const response = await fetch(`http://localhost:3001/taches/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setTaches(taches.filter((t) => t.id !== id));
          setTacheDetails(null);
        }
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  if (chargement) return <Layout><p className="state-message">Chargement des tâches...</p></Layout>;
  if (erreur) return <Layout><p className="state-message error">Erreur : {erreur}</p></Layout>;

  return (
    <Layout>
      <div className="taches-header-container">
        <div>
          <h1 className="taches-main-title">Site vitrine Nguvu</h1>
          <p className="taches-main-subtitle">{taches.length} tâches — 6 terminées — avancement 75 %</p>
        </div>
        <button className="btn-new-task" onClick={handleOpenCreate}>+ Nouvelle tâche</button>
      </div>

      <div className="taches-filters-bar">
        <input 
          type="text" 
          placeholder="Rechercher une tâche par titre..." 
          className="taches-search"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <select className="taches-select-priorite"><option>Priorité : toutes</option></select>
        <select className="taches-select-tri"><option>Trier : echeance</option></select>
      </div>

      <div className="taches-tabs">
        <button className={`tab-btn ${filtreStatut === 'toutes' ? 'active' : ''}`} onClick={() => setFiltreStatut('toutes')}>Toutes ({taches.length})</button>
        <button className={`tab-btn ${filtreStatut === 'a faire' ? 'active' : ''}`} onClick={() => setFiltreStatut('a faire')}>A faire</button>
        <button className={`tab-btn ${filtreStatut === 'en cours' ? 'active' : ''}`} onClick={() => setFiltreStatut('en cours')}>En cours</button>
        <button className={`tab-btn ${filtreStatut === 'terminees' ? 'active' : ''}`} onClick={() => setFiltreStatut('terminees')}>Terminees</button>
      </div>

      <div className="taches-table-card">
        <table className="taches-table">
          <thead>
            <tr className="taches-thead-row">
              <th>TÂCHE</th>
              <th>PRIORITÉ</th>
              <th>ÉCHÉANCE</th>
              <th>STATUT</th>
              <th className="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {tachesFiltrees.length > 0 ? (
              tachesFiltrees.map(t => (
                <tr key={t.id} className="taches-tbody-row">
                  <td>
                    <div className="tache-title-cell">{t.titre}</div>
                    <div className="tache-desc-cell">{t.description || "Validation des champs + envoi"}</div>
                  </td>
                  <td><span className={`badge badge-priority-${(t.priorite || 'haute').toLowerCase()}`}>{t.priorite || 'Haute'}</span></td>
                  <td className="tache-date-cell">{t.echeance || '12/09/2026'}</td>
                  <td><span className={`badge badge-status-${(t.statut || 'a faire').toLowerCase().replace(/\s+/g, '-')}`}>{t.statut || 'A faire'}</span></td>
                  <td className="text-right">
                    <button onClick={() => setTacheDetails(t)} className="btn-action">Voir</button>
                    <button onClick={() => handleOpenEdit(t)} className="btn-action">Modifier</button>
                    <button onClick={() => handleSupprimer(t.id)} className="btn-action btn-delete">Suppr.</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="state-message">Aucune tâche trouvée.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{isEditing ? "Modifier la tâche" : "Créer une nouvelle tâche"}</h3>
            <form onSubmit={handleSubmitForm} className="modal-form">
              <div className="form-group">
                <label className="form-label">Titre de la tâche</label>
                <input type="text" className="form-input" value={titre} onChange={(e) => setTitre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Priorité</label>
                <select className="form-input" value={priorite} onChange={(e) => setPriorite(e.target.value)}>
                  <option value="Haute">Haute</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Statut</label>
                <select className="form-input" value={statut} onChange={(e) => setStatut(e.target.value)}>
                  <option value="A faire">A faire</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminee">Terminee</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-modal-submit">{isEditing ? "Enregistrer" : "Créer"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tacheDetails && (
        <div className="modal-overlay">
          <div className="modal-box modal-detail-box">
            <div className="modal-top">
              <span className={`badge badge-status-${(tacheDetails.statut || 'en cours').toLowerCase().replace(/\s+/g, '-')}`}>
                {tacheDetails.statut}
              </span>
              <button onClick={() => setTacheDetails(null)} className="modal-close-btn">✕</button>
            </div>

            <h2 className="modal-title">{tacheDetails.titre}</h2>
            <p className="modal-subtitle">Projet : Site vitrine Nguvu • Cree le 02/09/2026</p>

            <div className="modal-section">
              <span className="section-label">DESCRIPTION</span>
              <p className="modal-desc">
                {tacheDetails.description || 'Construire le formulaire de la page contact avec validation des champs obligatoires (nom, e-mail, message). Afficher un message de confirmation apres envoi et gerer l’etat de chargement pendant la requete.'}
              </p>
            </div>

            <div className="modal-meta-grid">
              <div>
                <span className="section-label">PRIORITE</span>
                <p><span className={`badge badge-priority-${(tacheDetails.priorite || 'haute').toLowerCase()}`}>{tacheDetails.priorite || 'Haute'}</span></p>
              </div>
              <div>
                <span className="section-label">ECHEANCE</span>
                <p className="meta-value">{tacheDetails.echeance || '12 septembre 2026'}</p>
              </div>
              <div>
                <span className="section-label">DERNIERE MODIFICATION</span>
                <p className="meta-value">Aujourd'hui, 14:12</p>
              </div>
            </div>

            <div className="modal-section">
              <span className="section-label">CHANGER LE STATUT</span>
              <div className="status-changer-buttons">
                <button 
                  type="button"
                  className={`status-opt-btn ${tacheDetails.statut === 'A faire' ? 'active-afaire' : ''}`}
                  onClick={() => setTacheDetails({...tacheDetails, statut: 'A faire'})}
                >
                  A faire
                </button>
                <button 
                  type="button"
                  className={`status-opt-btn ${tacheDetails.statut === 'En cours' ? 'active-encours' : ''}`}
                  onClick={() => setTacheDetails({...tacheDetails, statut: 'En cours'})}
                >
                  En cours
                </button>
                <button 
                  type="button"
                  className={`status-opt-btn ${tacheDetails.statut === 'Terminee' ? 'active-terminee' : ''}`}
                  onClick={() => setTacheDetails({...tacheDetails, statut: 'Terminee'})}
                >
                  Terminee
                </button>
              </div>
            </div>

           <div className="modal-footer detail-footer">
              <div></div> {/* Espaceur pour garder l'alignement à droite */}
              <div className="footer-right-actions">
                <button onClick={() => handleSupprimer(tacheDetails.id)} className="btn-modal-delete">Supprimer</button>
                <button onClick={() => { setTacheDetails(null); handleOpenEdit(tacheDetails); }} className="btn-modal-cancel">Modifier</button>
                <button onClick={async () => {
                  await fetch(`http://localhost:3001/taches/${tacheDetails.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(tacheDetails)
                  });
                  await chargerTaches();
                  setTacheDetails(null);
                }} className="btn-modal-submit">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};