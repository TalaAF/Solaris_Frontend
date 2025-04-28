// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, CircularProgress } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate('/dashboard'); // Redirect after successful login
    } catch (err) {
      // Error is already handled in AuthContext
      console.error('Login submission error:', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        mx: 'auto',
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;