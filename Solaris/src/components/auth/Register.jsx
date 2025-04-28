// src/components/auth/Register.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, Alert, CircularProgress } from '@mui/material';

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
    
    // Form validation
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    
    setPasswordError('');
    
    try {
      await register({ name, email, password });
      navigate('/dashboard'); // Redirect after successful registration
    } catch (err) {
      // Error is already handled in AuthContext
      console.error('Registration submission error:', err);
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
        Create Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
          {error}
        </Alert>
      )}

      {passwordError && (
        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
          {passwordError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Full Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isRegistering}
        >
          {isRegistering ? <CircularProgress size={24} /> : 'Sign Up'}
        </Button>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;