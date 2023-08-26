'use client'
import './Layout.css';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import SearchIcon from '@mui/icons-material/Search';
import { LinkProps } from 'next/link';
import Link from "./lib/Link";
import { usePathname } from 'next/navigation';
import AccountMenu from './lib/AccountMenu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SessionProvider } from 'next-auth/react';
import {ApolloClient, InMemoryCache, ApolloProvider, NormalizedCacheObject} from '@apollo/client';
import { persistCache, LocalStorageWrapper, CachePersistor } from 'apollo3-cache-persist';
import { ScheduleProvider } from './scheduleManager';
import { useEffect, useState } from 'react';
import { Providers } from './lib/Providers';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

class NavData {
  label: string;
  element: JSX.Element;
  page: string;

  constructor(label: string, element: JSX.Element, page: string) {
    this.label = label;
    this.element = element;
    this.page = page;
  }
}

function NavItem(props: {item: NavData}) {
  const pathname = usePathname();

  return (
    <Link href={props.item.page} className={pathname === (props.item.page) ? "current" : undefined}>
      <ListItem key={props.item.label}>
        <ListItemIcon>
          {props.item.element}
        </ListItemIcon>
        <ListItemText primary={props.item.label}>
        </ListItemText>
      </ListItem>
    </Link>
    )}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  })
}));

interface NavDrawerProps{
  /**
   * If `true`, the component is shown.
   * @default false
   */
  open?: boolean;
}

function NavDrawer(props: NavDrawerProps){
  return (
    <div id="navDrawer" className={props.open ? 'open' : undefined}>
      <List>
      {[
        new NavData("Schedule", <CalendarViewWeekIcon />, "/"),
        new NavData("Search", <SearchIcon />, "/search")
      ].map((item, index) => (
        <NavItem item={item} key={item.page}/>
      ))}</List>
    </div>
  )
}

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {

  const [open, setOpen] = React.useState(false);
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <html lang="en">
      <head>
        <title>Course Manager</title>
      </head>
      <body>
        <Providers>
          <CssBaseline />
            <Box id="layoutContainer">
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
                  <AccountMenu />
                </Toolbar>
              </AppBar>
              <NavDrawer open={open} />
              <Main id="mainContainer" open={open}>
                {children}
              </Main>
            </Box>
        </Providers>
      </body>
    </html>
  );
}