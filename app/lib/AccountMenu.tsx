'use client'
import Login from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { signIn, signOut, useSession } from "next-auth/react";
import * as React from 'react';
import { useLocalStorage } from '../localstorage';
import OnboardingDialog from './OnboardingDialog';
import WelcomeDialog from './WelcomeDialog';

// source: https://mui.com/material-ui/react-menu/#account-menu
export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const session = useSession();
  //console.log(session)
  const [terms, _setTerms] = useLocalStorage("terms", false);
  const [localSchedules, _setLocalSchedules] = useLocalStorage("local_schedules", null);

  return (
    <React.Fragment>
      {!!!terms ? <WelcomeDialog /> : 
        session.status === "authenticated" ? 
          !session.data.user?.name ? <OnboardingDialog /> : 
          localSchedules !== null ? <WelcomeDialog/> : undefined : undefined}
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: "auto" }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>{session?.data?.user?.name ? session?.data?.user?.name[0].toUpperCase() : null}</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose} key="settings">
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        { session.status === "authenticated" ?
          [
            
            <MenuItem onClick={() => signOut()} key="logout">
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          ]
        :
          [
            <MenuItem onClick={() => signIn()} key="signIn">
              <ListItemIcon>
                <Login fontSize="small" />
              </ListItemIcon>
              Login
            </MenuItem>
          ]
        }
        
      </Menu>
    </React.Fragment>
  );
}