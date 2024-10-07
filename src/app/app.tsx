/* eslint-disable @next/next/no-img-element */
'use client'

import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { createTheme, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import AccountMenu from './lib/AccountMenu';
import Link from 'next/link';
      
import styles from "./app.module.css";
import { initGA, updateGAConsent } from './lib/ga-utils';
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
    <Link href={props.item.page} className={styles.navItem + " " + (pathname === (props.item.page) ? styles.current : "")}>
      <div className={styles.navItemIcon}>{props.item.element}</div>
      <div className={styles.navItemLabel}>{props.item.label}</div>
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
    <div className={styles.navDrawer + " " + (props.open ? styles.open : '')}>
      {[
        new NavData("Schedule", <CalendarViewWeekIcon />, "/"),
        new NavData("Search", <SearchIcon />, "/search")
      ].map((item, index) => (
        <NavItem item={item} key={item.page}/>
      ))}
      <Link href="/legal/privacy" className={styles.privacyPolicyLink}>Privacy Policy</Link>
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

    const [terms, _setTerms] = useLocalStorage("terms", false);
    const [localSchedules, _setLocalSchedules] = useLocalStorage("local_schedules", null);

    React.useEffect(() => {
      initGA();
    }, [])


    return (
        <>
          <CssBaseline />
          <div className={styles.mainContainer}>
            <div className={styles.topBar}>
              <div className={styles.topBarLayer}>
                <Link href="/" className={styles.homeLink}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text*/}
                  <div className={styles.homeIcon}><img src="/favicon.ico"/></div>
                  <div className={styles.homeText}>
                    Tarheel Compass
                  </div>
                </Link>
                <AccountMenu className={styles.accountMenu} />
              </div>
              <div className={styles.navContainer}>

              </div>
            </div>
            <div className={styles.contentContainer}>
              {children}
            </div>
          </div>
          
          {!!!terms ? <WelcomeDialog /> : 
            session.status === "authenticated" ? 
              !session.data.user?.name ? <OnboardingDialog /> : 
              localSchedules !== null ? <MigrationDialog /> : undefined : undefined}
        </>
    )
}