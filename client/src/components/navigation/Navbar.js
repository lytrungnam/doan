import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@material-ui/icons';

import { logout } from '../../store/actions/authActions';
import { toggleSidebar } from '../../store/actions/uiActions';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    backgroundColor: theme.palette.primary.main,
  },
  userButton: {
    marginLeft: theme.spacing(1),
    textTransform: 'none',
  },
  userName: {
    marginLeft: theme.spacing(1),
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          onClick={handleToggleSidebar}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" className={classes.title}>
          Phát Hiện Nội Dung Độc Hại
        </Typography>

        <Tooltip title="Thông báo">
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
        </Tooltip>

        <Button
          color="inherit"
          onClick={handleMenu}
          className={classes.userButton}
          startIcon={
            <Avatar className={classes.avatar}>
              {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          }
        >
          <Typography variant="body1" className={classes.userName}>
            {user ? user.name : 'Người dùng'}
          </Typography>
        </Button>
        
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            component={RouterLink}
            to="/app/settings"
            onClick={handleClose}
          >
            <SettingsIcon fontSize="small" style={{ marginRight: 8 }} />
            Cài đặt
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
            Đăng xuất
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;