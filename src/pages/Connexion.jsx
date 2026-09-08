import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import App from '../App';

export const Connexion = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [loading, setLoading] = useState(false);

  const { seConnecter } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setLoading(true);

    try {
      // Interroge JSON Server pour trouver l'utilisateur avec cet email
      const response = await fetch(`http://localhost:3000/utilisateurs?email=${email}`);
      const users = await response.json();

      // Vérification : L'utilisateur existe-t-il ET le mot de passe correspond-il ?
      if (users.length > 0 && users[0].motDePasse === motDePasse) {
        seConnecter(users[0]); // Sauvegarde l'utilisateur dans le Context
        navigate('/dashboard'); // Redirige vers le tableau de bord
      } else {
        setErreur('Email ou mot de passe incorrect.');
      }
    } catch (err) {
      setErreur('Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Panneau Gauche : Présentation */}
      <div className="auth-sidebar">
        <div className="sidebar-content">
          <h1 className="logo-title">
            Task<span className="logo-highlight">Flow</span>
          </h1>
          <p className="sidebar-description">
            Organisez vos projets, suivez vos taches,<br />
            et gardez le controle de votre avancement.
          </p>

          <div className="sidebar-features">
            <p>Creez autant de projets que necessaire</p>
            <p>Suivez chaque tache de bout en bout</p>
            <p>Visualisez votre progression en un coup d'oeil</p>
          </div>
        </div>
      </div>

      {/* Panneau Droit : Formulaire */}
      <div className="auth-main">
        <div className="auth-card-wide">
          <h2 className="auth-title-left">Connexion</h2>
          <p className="auth-subtitle-left">Entrez vos identifiants pour continuer</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Adresse e-mail</label>
              <input
                type="email"
                className="form-input"
                placeholder="rebeccameta@primetek.cd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
              />
            </div>

            {/* Affiche l'erreur si l'authentification échoue */}
            {erreur && <div className="error-banner">{erreur}</div>}

            <button type="submit" className="btn-submit-green" disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="auth-footer">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="auth-link-bold">
              Creer un compte
            </Link>
          </p>

          <div className="info-box">
            <strong>Ecran 1 — Connexion / Inscription.</strong> Le message rouge n'apparait qu'en cas d'erreur.
          </div>
        </div>
      </div>
    </div>
  );
};

