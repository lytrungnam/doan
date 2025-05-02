import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
} from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  Image as ImageIcon,
  Videocam as VideoIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  active: {
    backgroundColor: theme.palette.action.selected,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  
  const [analyzeOpen, setAnalyzeOpen] = React.useState(true);

  const handleAnalyzeClick = () => {
    setAnalyzeOpen(!analyzeOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      text: 'Tổng quan',
      icon: <DashboardIcon />,
      path: '/app/dashboard',
    },
    {
      text: 'Phân tích',
      icon: isActive('/app/analyze/image') || isActive('/app/analyze/video') ? 
        <ExpandLess /> : <ExpandMore />,
      onClick: handleAnalyzeClick,
      open: analyzeOpen,
      subItems: [
        {
          text: 'Ảnh',
          icon: <ImageIcon />,
          path: '/app/analyze/image',
        },
        {
          text: 'Video',
          icon: <VideoIcon />,
          path: '/app/analyze/video',
        },
      ],
    },
    {
      text: 'Lịch sử',
      icon: <HistoryIcon />,
      path: '/app/history',
    },
    {
      text: 'Cài đặt',
      icon: <SettingsIcon />,
      path: '/app/settings',
    },
  ];

  return (
    <Drawer
      variant="permanent"
      className={sidebarOpen ? classes.drawerOpen : classes.drawerClose}
      classes={{
        paper: sidebarOpen ? classes.drawerOpen : classes.drawerClose,
      }}
    >
      <Toolbar />

      <List>
        {menuItems.map((item) => (
          item.subItems ? (
            <React.Fragment key={item.text}>
              <ListItem button onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              
              <Collapse in={item.open && sidebarOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem
                      button
                      key={subItem.text}
                      component={RouterLink}
                      to={subItem.path}
                      className={`${classes.nested} ${isActive(subItem.path) ? classes.active : ''}`}
                    >
                      <ListItemIcon>{subItem.icon}</ListItemIcon>
                      <ListItemText primary={subItem.text} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItem
              button
              key={item.text}
              component={RouterLink}
              to={item.path}
              className={isActive(item.path) ? classes.active : ''}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        ))}
      </List>
      
      <Divider />
    </Drawer>
  );
};

export default Sidebar;