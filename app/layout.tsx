'use client';
import './Layout.css';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import SearchIcon from '@mui/icons-material/Search';
import { Theme } from "@mui/material/styles";
import { HTMLAttributes, DetailedHTMLProps } from "react";
import { MUIStyledCommonProps } from "@mui/system";
import { StyledComponent } from "@emotion/styled";
import { LinkProps } from 'next/link';
import Link from 'next/link';

const drawerWidth = 240;

const MyLink = React.forwardRef<HTMLAnchorElement, LinkProps>(function MyLink(
  itemProps,
  ref,
) {
  return <Link ref={ref} {...itemProps} role={undefined} />;
});

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

class NavItem {
  label: string;
  element: JSX.Element;
  page: string;

  constructor(label: string, element: JSX.Element, page: string) {
    this.label = label;
    this.element = element;
    this.page = page;
  }
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader: StyledComponent<MUIStyledCommonProps<Theme>, DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}> = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        <Box id="layoutContainer">
          <CssBaseline />
          <AppBar id="headerBar" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Course Manager
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer id="drawer"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader></DrawerHeader>
            <Divider />
            <List>
              {[
                new NavItem("Schedule", <CalendarViewWeekIcon />, ""),
                new NavItem("Search", <SearchIcon />, "search")
              ].map((item, index) => (
                <Link key={item.label} href={item.page}>
                  <ListItem disablePadding>
                    <ListItemIcon>
                      {item.element}
                    </ListItemIcon>
                    <ListItemText primary={item.label}>
                    </ListItemText>
                  </ListItem>
                </Link>
              ))}
            </List>
          </Drawer>
          <Main id="mainContainer" open={open}>
            {children}
          </Main>
        </Box>
      </body>
    </html>
  );
}