// src/components/auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const response = await AuthService.requestPasswordReset(email);
      setIsSubmitted(true);
      setMessage(response.data.message);
    } catch (err) {
      // Most likely won't happen due to our error handling in service
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-circle"></div>
          <h2>SOLARIS</h2>
        </div>
        
        {!isSubmitted ? (
          <>
            <h1 className="auth-title">Reset your password</h1>
            <p className="auth-subtitle">Enter your email to receive a password reset link</p>
            
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div className="auth-error">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <button type="submit" className="auth-button" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="auth-success">
            <div className="success-icon">✓</div>
            <h1>Check your email</h1>
            <p>{message || 'If the email exists in our system, a password reset link has been sent.'}</p>
            <p className="email-note">
              Please check your inbox at <strong>{email}</strong> and follow the instructions.
            </p>
          </div>
        )}
        
        <div className="auth-footer">
          <p>Remember your password? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;