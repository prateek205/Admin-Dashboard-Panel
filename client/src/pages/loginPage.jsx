import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleSocialLogin = (provider) => {
    // Implement social login here
    console.log(`Logging in with ${provider}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper
              elevation={8}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <LockIcon
                  sx={{
                    fontSize: 64,
                    color: 'primary.main',
                    mb: 2,
                    p: 2,
                    bgcolor: 'primary.50',
                    borderRadius: '50%',
                  }}
                />
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Sign in to your admin dashboard
                </Typography>
              </Box>

              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 3, borderRadius: 2 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
                  <Link
                    to="/forgot-password"
                    style={{
                      textDecoration: 'none',
                      color: 'primary.main',
                      fontWeight: 500,
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Or continue with
                  </Typography>
                </Divider>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<GoogleIcon />}
                      onClick={() => handleSocialLogin('google')}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                      }}
                    >
                      Google
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<GitHubIcon />}
                      onClick={() => handleSocialLogin('github')}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                      }}
                    >
                      GitHub
                    </Button>
                  </Grid>
                </Grid>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      style={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    >
                      Create one now
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ pl: { md: 6 }, mt: { xs: 4, md: 0 }, textAlign: 'center' }}>
              <Typography
                variant="h2"
                fontWeight={800}
                color="white"
                sx={{ mb: 3, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
              >
                AdminPanel Pro
              </Typography>
              <Typography
                variant="h5"
                color="white"
                sx={{ opacity: 0.9, mb: 4 }}
              >
                The ultimate solution for managing your business
              </Typography>
              <Box
                component="img"
                src="/dashboard-preview.svg"
                alt="Dashboard Preview"
                sx={{
                  maxWidth: '100%',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                  borderRadius: 4,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;