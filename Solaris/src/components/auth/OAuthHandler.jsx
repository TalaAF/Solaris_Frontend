import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthService from '../../services/AuthService';

const OAuthHandler = () => {
  const navigate = useNavigate();
  const { setOAuthUser } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({});
  
  useEffect(() => {
    // For debugging - log the full URL and search params
    console.log("OAuth handler loaded with URL:", window.location.href);
    
    // Extract token from URL
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    
    setDebugInfo({
      url: window.location.href,
      search: window.location.search,
      token: token ? "Token exists (hidden for security)" : "No token found",
      params: Object.fromEntries(queryParams.entries())
    });
    
    if (token) {
      const processToken = async () => {
        try {
          console.log("Processing OAuth token...");
          const response = await AuthService.handleOAuthLogin(token);
          console.log("OAuth login response:", response);
          
          if (response && response.data && response.data.user) {
            console.log("OAuth authentication successful");
            setOAuthUser(response.data.user);
            navigate('/dashboard');
          } else {
            console.error("OAuth login response missing user data");
            setError('Failed to process authentication. Missing user data.');
          }
        } catch (err) {
          console.error('OAuth authentication error:', err);
          setError(err.message || 'Authentication failed. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      processToken();
    } else {
      console.error("No token found in URL");
      setError('No authentication token found. Please try signing in again.');
      setLoading(false);
    }
  }, [navigate, setOAuthUser]);
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-circle"></div>
          <h2>SOLARIS</h2>
        </div>
        
        {loading ? (
          <>
            <h1 className="auth-title">Authenticating...</h1>
            <p className="auth-subtitle">Please wait while we complete your sign in.</p>
          </>
        ) : error ? (
          <>
            <h1 className="auth-title">Authentication Error</h1>
            <p className="auth-subtitle">{error}</p>
            
            {/* For troubleshooting only - remove in production */}
            {process.env.NODE_ENV !== 'production' && (
              <div className="debug-info">
                <h3>Debug Info:</h3>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
            
            <button 
              className="auth-button" 
              onClick={() => navigate('/login')}
            >
              Return to Login
            </button>
          </>
        ) : (
          <div>
            <h1 className="auth-title">Authentication Successful</h1>
            <p className="auth-subtitle">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthHandler;