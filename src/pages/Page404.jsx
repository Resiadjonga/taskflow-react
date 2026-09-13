import { Link } from 'react-router-dom';
import '../styles/page404.css';

export const Page404 = () => {
  return (
    <div className="auth-wrapper page404-container">
      <div className="auth-card-wide page404-card">
        <h1 className="logo-title">
          Task<span className="logo-highlight">Flow</span>
        </h1>
        
        <div className="error-code">
          404
        </div>

        <h2 className="error-title">
          Page introuvable
        </h2>
        
        <p className="error-description">
          La page que vous essayez d'atteindre n'existe pas ou a été déplacée vers une autre adresse.
        </p>

        <Link to="/dashboard" className="btn-submit-green error-btn">
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};