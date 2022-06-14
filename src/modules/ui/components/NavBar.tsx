// @ts-nocheck
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getCookie, eraseCookie } from 'utils/cookies'

import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Hidden,
  Button,
  Container,
} from '@material-ui/core'
import { KeyboardArrowDown as ArrowDownIcon } from '@material-ui/icons'
import { grey } from '@material-ui/core/colors'

import { isLoginAsAdmin, isLoginAsUser } from 'utils/isLogin'
import * as uiActions from 'modules/ui/actions'
import NavDropdownMobile from './NavDropdownMobile'
import NavDropdownDesktop from './NavDropdownDesktop'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    appBar: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'saturate(180%) blur(20px)',
      boxShadow: 'rgb(0 0 0 / 15%) 0px 0px 10px',
      [theme.breakpoints.up('sm')]: {
        zIndex: theme.zIndex.drawer + 1,
      },
    },
    menuButton: {
      marginRight: theme.spacing(1),
    },
    title: {
      marginRight: theme.spacing(4),
      '&:hover': {
        cursor: 'pointer',
      },
    },
    logo: {
      display: 'block',
      maxWidth: 110,
      marginRight: theme.spacing(3),
      [theme.breakpoints.down('xs')]: {
        maxWidth: 100,
      },
      '&:hover': {
        cursor: 'pointer',
      },
    },
    link: {
      textDecoration: 'none !important',
    },
    search: {
      position: 'relative',
      backgroundColor: fade(theme.palette.common.white, 0.9),
      borderRadius: theme.shape.borderRadius,
      width: '100%',
    },
    searchIcon: {
      color: grey[400],
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: theme.palette.text.primary,
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      paddingRight: `calc(3em)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.grey[300]}`,
      '&:hover': {
        border: `1px solid ${theme.palette.grey[400]}`,
      },
      '&:focus': {
        border: `1px solid ${theme.palette.primary.main}`,
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
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
    noDecorationLink: {
      textDecoration: 'none',
    },
    navMenu: {
      minWidth: '270px',
    },
    navItem: {
      color: theme.palette.text.primary,
    },
    navItemActive: {
      color: theme.palette.primary.main,
    },
    badge: {
      zIndex: 10,
    },
    divider: {
      width: 2,
      height: 32,
      margin: theme.spacing(2),
      backgroundColor: '#A7A8AB',
    },
    bold: {
      fontWeight: 600,
    },
    topScrollPaper: {
      alignItems: 'flex-start',
    },
    topPaperScrollBody: {
      verticalAlign: 'top',
    },
  })
)

export default function NavBar(props) {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const departmentName = getCookie('departmentName')

  const isAdmin = isLoginAsAdmin()
  const isUser = isLoginAsUser()

  const PATH = process.env.REACT_APP_BASE_PATH
  const LogoImage = require('assets/images/logo.svg')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const linkToHome = () => {
    handleMenuClose()
    if (isAdmin) {
      history.push(`${PATH}/admin`)
    } else {
      history.push(`${PATH}`)
    }
  }

  const linkToChangePassword = () => {
    handleMenuClose()
    if (isAdmin) {
      history.push(`${PATH}/admin/edit/password`)
    } else {
      history.push(`${PATH}/edit/password`)
    }
  }

  const logout = () => {
    handleMenuClose()
    eraseCookie('token')
    eraseCookie('ministryId')
    eraseCookie('departmentId')
    eraseCookie('ministryName')
    eraseCookie('departmentName')
    dispatch(uiActions.setFlashMessage('ออกจากระบบเรียบร้อยแล้ว', 'success'))
    if (isAdmin) {
      setTimeout(() => {
        history.push(`${PATH}/admin/login`)
      }, 1000)
    } else if (isUser) {
      setTimeout(() => {
        history.push(`${PATH}/login`)
      }, 1000)
    }
    window.location.reload()
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const mobileMenuId = 'primary-search-account-menu-mobile'

  const getUsernameLabel = () => {
    if (isAdmin) return 'ผู้ดูแลระบบ'
    else if (isUser) return departmentName
    else return 'เข้าสู่ระบบ'
  }

  const checkIsLoggedIn = () => {
    return isAdmin || isUser
  }

  const isLoggedIn = checkIsLoggedIn()
  const usernameLabel = getUsernameLabel()

  return (
    <div className={classes.grow}>
      <AppBar position='fixed' className={classes.appBar} elevation={0}>
        <Container maxWidth='lg'>
          <Toolbar>
            {/* SITE LOGO */}
            <img
              src={LogoImage}
              alt='OCSC Logo'
              className={classes.logo}
              onClick={linkToHome}
            />
            <Hidden mdDown implementation='css'>
              <Typography
                color='textPrimary'
                variant='h6'
                noWrap
                className={classes.title}
                onClick={linkToHome}
              >
                รายงานผลการพัฒนาในช่วงการทดลองปฏิบัติหน้าที่ราชการ
              </Typography>
            </Hidden>
            <Hidden lgUp implementation='css'>
              <Typography
                color='textPrimary'
                variant='h6'
                noWrap
                className={classes.title}
                onClick={linkToHome}
              >
                รายงานผลการพัฒนาฯ
              </Typography>
            </Hidden>
            <div className={classes.grow} />
            {/* DESKTOP DROPDOWN */}
            <div className={classes.sectionDesktop}>
              <Button
                onClick={handleProfileMenuOpen}
                disabled={!isLoggedIn}
                color='primary'
                size='small'
                style={{
                  borderRadius: 50,
                  padding: '8px 10px',
                  margin: '6px 0',
                }}
                startIcon={
                  <Avatar
                    className={isLoggedIn ? classes.loggedIn : classes.small}
                  />
                }
                endIcon={
                  isLoggedIn && <ArrowDownIcon style={{ fontSize: 24 }} />
                }
              >
                <Typography color='textPrimary' className={classes.bold} noWrap>
                  {usernameLabel}
                </Typography>
              </Button>
            </div>
            {/* MOBILE DROPDOWN */}
            <Hidden only={['xs', 'lg', 'md', 'xl']}>
              <div className={classes.grow} />
            </Hidden>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-controls={mobileMenuId}
                onClick={handleMobileMenuOpen}
                color='inherit'
              >
                <Avatar
                  className={isLoggedIn ? classes.loggedIn : classes.small}
                />
              </IconButton>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      <NavDropdownMobile
        isLoggedIn={isLoggedIn}
        logout={logout}
        mobileMenuId={mobileMenuId}
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        isMobileMenuOpen={isMobileMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
        linkToHome={linkToHome}
        linkToChangePassword={linkToChangePassword}
        usernameLabel={usernameLabel}
      />
      <NavDropdownDesktop
        isLoggedIn={isLoggedIn}
        logout={logout}
        linkToHome={linkToHome}
        linkToChangePassword={linkToChangePassword}
        anchorEl={anchorEl}
        menuId={menuId}
        isMenuOpen={isMenuOpen}
        handleMenuClose={handleMenuClose}
      />
    </div>
  )
}
