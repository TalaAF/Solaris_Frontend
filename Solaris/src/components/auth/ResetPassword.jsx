// src/components/auth/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(null);
  const [passwordFeedback, setPasswordFeedback] = useState({ message: '', isValid: false });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get token from query parameter instead of URL param
  const token = searchParams.get('token');
  
  // Validate token when component mounts
  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setError('No reset token provided. Please request a new password reset link.');
      return;
    }
    
    const validateToken = async () => {
      try {
        const response = await AuthService.validateResetToken(token);
        setIsValidToken(response.data.valid);
        
        if (!response.data.valid) {
          setError('This password reset link is invalid or has expired.');
        }
      } catch (err) {
        setIsValidToken(false);
        setError('An error occurred validating your reset link.');
      }
    };
    
    validateToken();
  }, [token]);
  
  // Validate password as user types
  useEffect(() => {
    if (password.length > 0) {
      const validation = AuthService.validatePassword(password);
      setPasswordFeedback(validation);
    } else {
      setPasswordFeedback({ message: '', isValid: false });
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    // Validate password strength
    const validation = AuthService.validatePassword(password);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Updated to include confirmPassword parameter
      await AuthService.resetPassword(token, password, confirmPassword);
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading while validating token
  if (isValidToken === null) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-loading">
            <div className="loading-spinner"></div>
            <p>Validating your reset link...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-circle"></div>
          <h2>SOLARIS</h2>
        </div>
        
        {!isSuccess ? (
          <>
            <h1 className="auth-title">Set new password</h1>
            <p className="auth-subtitle">Create a new password for your account</p>
            
            {!isValidToken ? (
              <div className="auth-error token-error">
                <p>{error}</p>
                <p>Please request a new password reset link.</p>
                <Link to="/forgot-password" className="auth-button">
                  Request New Link
                </Link>
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="auth-error">{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a new password"
                    required
                    disabled={!isValidToken}
                  />
                  <div className="password-strength">
                    <div className={`strength-bar ${password.length > 0 ? (passwordFeedback.isValid ? 'strong' : 'weak') : ''}`}></div>
                    <span className="strength-text">
                      {password.length > 0 ? 
                        (passwordFeedback.message.includes('strong') ? 'Strong' : 'Weak') : ''}
                    </span>
                  </div>
                  {password.length > 0 && !passwordFeedback.isValid && (
                    <div className="password-requirements">
                      <small>{passwordFeedback.message}</small>
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                    disabled={!isValidToken}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="auth-button" 
                  disabled={isSubmitting || !isValidToken || !passwordFeedback.isValid}
                >
                  {isSubmitting ? 'Setting Password...' : 'Reset Password'}
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="auth-success">
            <div className="success-icon">✓</div>
            <h1>Password Reset Successful!</h1>
            <p>
              Your password has been reset successfully.
              You will be redirected to the login page in a moment.
            </p>
            <Link to="/login" className="auth-button">
              Sign In Now
            </Link>
          </div>
        )}
        
        <div className="auth-footer">
          <p>Remember your password? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;