// src/components/layouts/MainLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Navbar from '../navigation/Navbar';
import Sidebar from '../navigation/Sidebar';
import AlertMessage from '../ui/AlertMessage';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: theme.spacing(10),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 240,
  },
}));

const MainLayout = () => {
  const classes = useStyles();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { alert } = useSelector((state) => state.ui);

  return (
    <Box className={classes.root}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        className={\`\${classes.content} \${sidebarOpen ? classes.contentShift : ''}\`}
      >
        <Container maxWidth="lg">
          {alert && <AlertMessage alert={alert} />}
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;

// src/components/layouts/AuthLayout.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Container, Paper, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

import AlertMessage from '../ui/AlertMessage';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
  },
  paper: {
    width: '100%',
    maxWidth: 450,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    marginBottom: theme.spacing(2),
  },
}));

const AuthLayout = () => {
  const classes = useStyles();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { alert } = useSelector((state) => state.ui);

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" />;
  }

  return (
    <Box className={classes.root}>
      <Container maxWidth="sm">
        <Paper elevation={3} className={classes.paper}>
          <Typography variant="h4" component="h1" className={classes.logo}>
            Harmful Content Detection
          </Typography>
          {alert && <AlertMessage alert={alert} />}
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;