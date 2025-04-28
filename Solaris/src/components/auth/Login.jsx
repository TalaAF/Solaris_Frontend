// components/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const { login, error, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is already handled in AuthContext
      console.error('Login failed:', err);
    }
  };

  const handleDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password'); // Demo password
    try {
      await login(demoEmail, 'password');
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-circle"></div>
          <h2>SOLARIS</h2>
        </div>
        
        <h1 className="auth-title">Welcome to Solaris</h1>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-tabs">
            <button 
              type="button" 
              className={`tab-button ${!showDemo ? 'active' : ''}`} 
              onClick={() => setShowDemo(false)}
            >
              Credentials
            </button>
            <button 
              type="button" 
              className={`tab-button ${showDemo ? 'active' : ''}`} 
              onClick={() => setShowDemo(true)}
            >
              Demo Accounts
            </button>
          </div>
          
          {!showDemo ? (
            <>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">
                  Password
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot password?
                  </Link>
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                />
              </div>
              
              {error && <div className="auth-error">{error}</div>}
              
              <button type="submit" className="auth-button" disabled={isLoggingIn}>
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
              </button>
            </>
          ) : (
            <div className="demo-accounts">
              <div className="demo-account" onClick={() => handleDemoLogin('student@example.com')}>
                <div className="demo-avatar">
                  <img src="https://i.pravatar.cc/150?img=1" alt="Student" />
                </div>
                <div className="demo-info">
                  <h3>Student</h3>
                  <p>student@example.com</p>
                </div>
              </div>
              
              <div className="demo-account" onClick={() => handleDemoLogin('instructor@example.com')}>
                <div className="demo-avatar">
                  <img src="https://i.pravatar.cc/150?img=2" alt="Instructor" />
                </div>
                <div className="demo-info">
                  <h3>Instructor</h3>
                  <p>instructor@example.com</p>
                </div>
              </div>
              
              <div className="demo-account" onClick={() => handleDemoLogin('admin@example.com')}>
                <div className="demo-avatar">
                  <img src="https://i.pravatar.cc/150?img=3" alt="Admin" />
                </div>
                <div className="demo-info">
                  <h3>Administrator</h3>
                  <p>admin@example.com</p>
                </div>
              </div>
              
              {error && <div className="auth-error">{error}</div>}
            </div>
          )}
        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
        
        <div className="auth-terms">
          By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
        
        <div className="auth-copyright">
          © 2025 Solaris Medical Education. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;