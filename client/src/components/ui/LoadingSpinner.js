import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  message: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

const LoadingSpinner = ({ message = 'Đang tải...' }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <CircularProgress />
      <Typography variant="body1" className={classes.message}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;