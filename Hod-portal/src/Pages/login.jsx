import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/login.css";
import loginlogo from "../assets/loginlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { login } from "../api/authService";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (error) setError(""); // clear error on new input
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isSigningIn) return;

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSigningIn(true);
    setError("");

    try {
      await login(formData.email.trim(), formData.password);
      navigate("/home");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setIsSigningIn(false);
    }
  };

  // Allow pressing Enter in the password field to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
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
            {/* ── Error Banner ── */}
            {error && (
              <div className="login-error-banner" role="alert">
                <FontAwesomeIcon icon={faTriangleExclamation} className="login-error-icon" />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className={`input-wrapper${error ? " input-error" : ""}`}>
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
                  onKeyDown={handleKeyDown}
                  className="form-input"
                  autoComplete="email"
                  disabled={isSigningIn}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className={`input-wrapper${error ? " input-error" : ""}`}>
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
                  onKeyDown={handleKeyDown}
                  className="form-input"
                  autoComplete="current-password"
                  disabled={isSigningIn}
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
