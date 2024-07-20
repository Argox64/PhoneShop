import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthentificationService from '../services/AuthenticationService';
import { isNullOrEmpty } from '@/extensions/stringExtensions';
import { useSession } from '@/components/contexts/AuthProvider';
import { UnauthorizedError } from 'common-types';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token, login } = useSession();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/account'); // Redirige vers la page d'accueil si l'utilisateur est déjà connecté
    }
  }, [token, navigate]); // Va changer de page si vient de se connecter sur un autre onglet par exemple

  const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(email.toLowerCase());
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    if (!validateEmail(email)) {
      setEmailError('Adresse email non valide');
      setLoading(false);
      return;
    }
    if (isNullOrEmpty(password)) {
      setPasswordError('Mot de passe requis');
      setLoading(false);
      return;
    }
    try {
      const response = await AuthentificationService.login(email, password);
      if (response) {
        login(response.data.userData, response.data.tokenType);
        navigate('/');
      } else {
        setError('Mot de passe ou e-mail erroné');
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion. Veuillez réessayer dans quelques instants.');
      if (error instanceof UnauthorizedError) {
        setError('Mot de passe ou e-mail erroné');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOnBlurEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const emailInput = e.target.value;
    if (!validateEmail(emailInput)) {
      setEmailError('Adresse email non valide');
    } else {
      setEmailError('');
    }
  };

  const handleOnBlurPassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const passwordInput = e.target.value;
    if (isNullOrEmpty(passwordInput)) {
      setPasswordError('Mot de passe requis');
    } else {
      setPasswordError('');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Connexion
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adresse Mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleOnBlurEmail}
            error={Boolean(emailError)}
            helperText={emailError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mot de Passe"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handleOnBlurPassword}
            error={Boolean(passwordError)}
            helperText={passwordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
            startIcon={loading && <CircularProgress size={24} />}
          >
            {loading ? 'Connexion en cours...' : 'Se Connecter'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthPage;