import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/login.css";
import loginlogo from "../assets/loginlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (isSigningIn) return;
    setIsSigningIn(true);

    setTimeout(() => {
      setIsSigningIn(false);
      navigate("/home");
    }, 1400);
  };

  return (
    <div className="login-bg">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-logo-area">
            <img src={loginlogo} alt="Connexara Logo" className="login-logo-img" />
            <span className="login-brand">Connexaara</span>
          </div>

          <div className="login-card-header">
            <h1 className="login-title">Sign In</h1>
            <p className="login-subtitle">Please enter your login details</p>
          </div>

          <div className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-checkbox"
                />
                <span className="checkmark"></span>
                <span className="remember-text">Remember me</span>
              </label>
            </div>

            <button
              type="button"
              className="signin-btn"
              onClick={handleSubmit}
              disabled={isSigningIn}
            >
              {isSigningIn ? "Signing you in..." : "Sign In"}
            </button>
          </div>

          {isSigningIn && (
            <div className="login-loading-overlay" aria-live="polite">
              <div className="login-loading-panel">
                <div className="login-spinner" />
                <p className="login-loading-text">Signing you in...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
