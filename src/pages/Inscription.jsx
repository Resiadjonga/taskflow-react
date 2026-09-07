import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Inscription = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');

    try {
      setChargement(true);

      const checkResp = await fetch(`http://localhost:3000/utilisateurs?email=${email.trim()}`);
      const existants = await checkResp.json();

      if (existants.length > 0) {
        setErreur('Un compte existe déjà avec cette adresse e-mail.');
        setChargement(false);
        return;
      }

      const reponse = await fetch('http://localhost:3000/utilisateurs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nom.trim(),
          email: email.trim(),
          motDePasse: motDePasse.trim()
        })
      });

      if (!reponse.ok) throw new Error("Impossible d'inscrire l'utilisateur.");

      setSucces(true);

      setTimeout(() => {
        navigate('/connexion');
      }, 2000);

    } catch (err) {
      setErreur(err.message);
      setChargement(false);
    }
  };

  return (
    <div className="inscription-container">
      <div className="inscription-card">
        <h2 className="inscription-title">Créer un compte</h2>
        <p className="inscription-subtitle">Rejoignez TaskFlow dès aujourd'hui</p>
        
        {erreur && <p className="inscription-error">{erreur}</p>}
        
        {succes ? (
          <div style={{ padding: '20px', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: '6px', textAlign: 'center', border: '1px solid #10b981', fontWeight: '600' }}>
            🎉 Inscription effectuée avec succès ! Redirection...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="inscription-form">
            <div className="inscription-group">
              <label>Nom complet</label>
              <input 
                type="text" 
                placeholder="Ex: Rebecca META"
                value={nom} 
                onChange={(e) => setNom(e.target.value)} 
                required 
              />
            </div>
            <div className="inscription-group">
              <label>Adresse e-mail</label>
              <input 
                type="email" 
                placeholder="Ex: rebeccameta@email.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="inscription-group">
              <label>Mot de passe</label>
              <input 
                type="password" 
                placeholder="••••••••••••"
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
              {chargement ? 'Inscription en cours...' : "S'inscrire"}
            </button>
          </form>
        )}

        {!succes && (
          <p className="inscription-footer">
            Déjà un compte ? <Link to="/connexion" className="inscription-link">Se connecter</Link>
          </p>
        )}
      </div>
    </div>
  );
};