import { useNavigate } from "react-router-dom";
import '../css/NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-text">Oops! Page not found.</p>
        <button className="notfound-button" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
      <div className="notfound-animation">
        <span className="notfound-star">*</span>
        <span className="notfound-star">*</span>
        <span className="notfound-star">*</span>
      </div>
    </div>
  );
}
