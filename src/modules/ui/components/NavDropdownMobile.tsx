// @ts-nocheck
import React from 'react'
import {
  MenuItem,
  Menu,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
  MeetingRoom as LogoutIcon,
  ChromeReaderMode as FolderIcon,
  Lock as LockIcon,
} from '@material-ui/icons'
import { grey } from '@material-ui/core/colors'

interface NavDropdownMobileProps {
  isLoggedIn: boolean
  logout: () => void
  mobileMenuId: number
  mobileMoreAnchorEl: any
  isMobileMenuOpen: boolean
  handleMobileMenuClose: () => void
  linkToLogin: () => void
  linkToHome: () => void
  linkToChangePassword: () => void
  usernameLabel: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    small: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      backgroundColor: grey[700],
    },
    loggedIn: {
      color: theme.palette.common.white,
      width: theme.spacing(4),
      height: theme.spacing(4),
      backgroundColor: process.env.REACT_APP_TERTIARY_COLOR_HEX,
    },
    bold: {
      fontWeight: 600,
    },
  })
)

export default function NavDropdownMobile({
  isLoggedIn,
  logout,
  mobileMenuId,
  mobileMoreAnchorEl,
  isMobileMenuOpen,
  handleMobileMenuClose,
  linkToHome,
  linkToChangePassword,
  usernameLabel,
}: NavDropdownMobileProps) {
  const classes = useStyles()

  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <ListItemIcon color='inherit'>
          <Avatar className={isLoggedIn ? classes.loggedIn : classes.small} />
        </ListItemIcon>
        <ListItemText
          className={classes.bold}
          primary={
            <Typography style={{ fontWeight: 600 }}>
              {isLoggedIn ? usernameLabel : 'เข้าสู่ระบบ'}
            </Typography>
          }
        />
      </MenuItem>
      {isLoggedIn && (
        <MenuItem onClick={linkToHome}>
          <ListItemIcon color='inherit'>
            <FolderIcon style={{ margin: 8, marginLeft: 4 }} />
          </ListItemIcon>
          <ListItemText primary='รายงานผลการพัฒนาฯ'></ListItemText>
        </MenuItem>
      )}
      {isLoggedIn && (
        <MenuItem onClick={linkToChangePassword}>
          <ListItemIcon color='inherit'>
            <LockIcon style={{ margin: 8, marginLeft: 4 }} />
          </ListItemIcon>
          <ListItemText primary='เปลี่ยนรหัสผ่าน'></ListItemText>
        </MenuItem>
      )}
      {isLoggedIn && (
        <>
          <Divider />
          <MenuItem onClick={logout}>
            <ListItemIcon color='inherit'>
              <LogoutIcon style={{ margin: 8, marginLeft: 4 }} />
            </ListItemIcon>
            <ListItemText primary='ออกจากระบบ'></ListItemText>
          </MenuItem>
        </>
      )}
    </Menu>
  )
}
