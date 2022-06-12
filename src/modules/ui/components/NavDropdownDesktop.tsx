// @ts-nocheck
import React from 'react'
import {
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
  MeetingRoom as LogoutIcon,
  ChromeReaderMode as FolderIcon,
  Lock as LockIcon,
} from '@material-ui/icons'

interface NavDropdownDesktopProps {
  isLoggedIn: boolean
  logout: () => void
  linkToHome: () => void
  linkToChangePassword: () => void
  anchorEl: any
  menuId: number
  isMenuOpen: boolean
  handleMenuClose: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItemIcon: {
      minWidth: 40,
    },
    loggedIn: {
      color: theme.palette.common.white,
      backgroundColor: process.env.REACT_APP_TERTIARY_COLOR_HEX,
    },
    bold: {
      fontWeight: 600,
    },
  })
)

export default function NavDropdownDesktop({
  isLoggedIn,
  logout,
  linkToHome,
  linkToChangePassword,
  anchorEl,
  menuId,
  isMenuOpen,
  handleMenuClose,
}: NavDropdownDesktopProps) {
  const classes = useStyles()

  return (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {isLoggedIn && (
        <MenuItem onClick={linkToHome}>
          <ListItemIcon className={classes.listItemIcon}>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary='รายงานผลการพัฒนาฯ' />
        </MenuItem>
      )}
      {isLoggedIn && (
        <MenuItem onClick={linkToChangePassword}>
          <ListItemIcon className={classes.listItemIcon}>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary='เปลี่ยนรหัสผ่าน' />
        </MenuItem>
      )}
      {isLoggedIn && (
        <>
          <Divider />
          <MenuItem onClick={logout}>
            <ListItemIcon className={classes.listItemIcon}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary='ออกจากระบบ' />
          </MenuItem>
        </>
      )}
    </Menu>
  )
}
