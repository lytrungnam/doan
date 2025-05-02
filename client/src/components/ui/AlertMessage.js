import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  alert: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

const AlertMessage = ({ alert }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setTimeout(() => dispatch({ type: 'REMOVE_ALERT' }), 300);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={alert.severity} 
        className={classes.alert}
        elevation={6}
        variant="filled"
      >
        {alert.msg}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;