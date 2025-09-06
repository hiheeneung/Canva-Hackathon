import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    reEnterPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup data:', formData);
    // Handle signup logic here
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1 className="signup-title">Create an account</h1>
          <p className="signup-subtitle">Let's create your account.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">FIRST NAME</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">LAST NAME</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">EMAIL ADDRESS</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email here"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">PASSWORD</label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password here"
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className={`eye-icon ${showPassword ? 'visible' : 'hidden'}`}>
                  {showPassword ? '👁️' : '👁️'}
                </span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reEnterPassword" className="form-label">RE-ENTER PASSWORD</label>
            <div className="input-container">
              <input
                type={showReEnterPassword ? "text" : "password"}
                id="reEnterPassword"
                name="reEnterPassword"
                value={formData.reEnterPassword}
                onChange={handleChange}
                placeholder="Enter password here"
                className="form-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowReEnterPassword(!showReEnterPassword)}
                aria-label={showReEnterPassword ? "Hide password" : "Show password"}
              >
                <span className={`eye-icon ${showReEnterPassword ? 'visible' : 'hidden'}`}>
                  {showReEnterPassword ? '👁️' : '👁️'}
                </span>
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="checkbox-input"
                required
              />
              <span className="checkbox-label">
                By registering an account, you agree to our terms & conditions
              </span>
            </label>
          </div>

          <button type="submit" className="submit-button">
            CREATE ACCOUNT
          </button>
        </form>

        <div className="signup-footer">
          <a href="/login" className="footer-link">
            ALREADY HAVE AN ACCOUNT? <span className="underline">LOG IN HERE</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
