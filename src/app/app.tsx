'use client'

import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import AccountMenu from './lib/AccountMenu';
import Link from "./lib/Link";
import { initGA } from './lib/ga-utils';
import { useLocalStorage } from './localstorage';
import { useSession } from 'next-auth/react';
import WelcomeDialog from './lib/WelcomeDialog';
import MigrationDialog from './lib/MigrationDialog';
import OnboardingDialog from './lib/OnboardingDialog';


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  /*padding: "0 " + theme.spacing(1),*/
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
  }),
  position: "unset"
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

export default function App({
    children,
  }: {
    children: React.ReactNode
  }) {
    const [open, setOpen] = React.useState(false);
    const session = useSession();
  
    const handleDrawerToggle = () => {
      setOpen(!open);
    };

    
    const handleAcceptCookie = () => {
      if (process.env.REACT_APP_GOOGLE_ANALYTICS_ID) {
        initGA(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
      }
    };
    const [terms, _setTerms] = useLocalStorage("terms", false);
    const [analyticsCookieAccepted, _setAnalyticsCookieAccepted] = useLocalStorage("analytics", false);
    const [localSchedules, _setLocalSchedules] = useLocalStorage("local_schedules", null);

    React.useEffect(() => {
      if (analyticsCookieAccepted) {
        handleAcceptCookie();
      }
    }, [analyticsCookieAccepted]);


    return (
        <>
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
                Tarheel Compass
                </Typography>
                <AccountMenu />
              </Toolbar>
            </AppBar>
            <NavDrawer open={open} />
            <div id="main-wrapper">
              <Main id="main-container" open={open}>
                {children}
              </Main>
            </div>
            {!!!terms ? <WelcomeDialog /> : 
              session.status === "authenticated" ? 
                !session.data.user?.name ? <OnboardingDialog /> : 
                localSchedules !== null ? <MigrationDialog /> : undefined : undefined}
          </Box>
        </>
    )
}