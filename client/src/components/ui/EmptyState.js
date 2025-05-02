import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    textAlign: 'center',
    minHeight: 300,
  },
  icon: {
    fontSize: 64,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  description: {
    marginBottom: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
}));

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink,
  onActionClick,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {Icon && <Icon className={classes.icon} />}
      
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
      
      <Typography variant="body1" className={classes.description}>
        {description}
      </Typography>
      
      {(actionText && actionLink) && (
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to={actionLink}
        >
          {actionText}
        </Button>
      )}
      
      {(actionText && onActionClick) && (
        <Button
          variant="contained"
          color="primary"
          onClick={onActionClick}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;