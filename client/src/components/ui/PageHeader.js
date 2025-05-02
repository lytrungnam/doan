import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Breadcrumbs, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
  breadcrumbs: {
    marginBottom: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
}));

const PageHeader = ({ title, breadcrumbs, action }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {breadcrumbs && (
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          className={classes.breadcrumbs}
        >
          {breadcrumbs.map((item, index) => (
            <Link
              key={index}
              color="inherit"
              component={RouterLink}
              to={item.link}
            >
              {item.text}
            </Link>
          ))}
          <Typography color="textPrimary">{title}</Typography>
        </Breadcrumbs>
      )}
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1" className={classes.title}>
          {title}
        </Typography>
        {action && action}
      </Box>
    </Box>
  );
};

export default PageHeader;