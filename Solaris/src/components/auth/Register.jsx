// components/auth/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { register, error, isRegistering } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous errors
    setPasswordError('');
    
    // Form validation
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-circle"></div>
          <h2>SOLARIS</h2>
        </div>
        
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join Solaris to access your medical education content</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
            <div className="password-strength">
              <div className={`strength-bar ${password.length > 0 ? (password.length >= 8 ? 'strong' : 'weak') : ''}`}></div>
              <span className="strength-text">{password.length > 0 ? (password.length >= 8 ? 'Strong' : 'Weak') : ''}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          {passwordError && <div className="auth-error">{passwordError}</div>}
          {error && <div className="auth-error">{error}</div>}
          
          <button type="submit" className="auth-button" disabled={isRegistering}>
            {isRegistering ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
        
        <div className="auth-terms">
          By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
        
        <div className="auth-copyright">
          © 2025 Solaris Medical Education. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Register;