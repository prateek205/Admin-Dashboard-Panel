// client/src/components/Navigation.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            Admin Panel
          </Typography>
          
          <Box>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/products"
            >
              Products
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;