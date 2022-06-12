// @ts-nocheck
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import LoadingBar from 'react-redux-loading-bar'

import { CssBaseline, Snackbar, IconButton } from '@material-ui/core'
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles'
import { Close as CloseIcon } from '@material-ui/icons'
import Alert from '@material-ui/lab/Alert'

import * as actions from '../actions'
import NavBar from './NavBar'
import Footer from './Footer'
import Routes from './Routes'

export default function Layout() {
  const dispatch = useDispatch()
  const defaultTheme = createMuiTheme()

  const { isSnackbarOpen, flashMessage, alertType } = useSelector(
    (state) => state.ui
  )
  const closeFlashMessage = () => dispatch(actions.clearFlashMessage())

  const theme = createMuiTheme({
    typography: {
      fontFamily: ['Prompt', 'sans-serif'].join(','),
    },
    overrides: {
      MuiToolbar: {
        gutters: {
          [defaultTheme.breakpoints.up('xs')]: {
            paddingLeft: 0,
            paddingRight: 0,
          },
        },
      },
      MuiCardContent: {
        root: {
          padding: 0,
          '&:last-child': {
            paddingBottom: 0,
          },
        },
      },
    },
    breakpoints: {
      values: {
        sm: 670,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette: {
      primary: {
        main: process.env.REACT_APP_PRIMARY_COLOR_HEX,
      },
      secondary: {
        main: process.env.REACT_APP_SECONDARY_COLOR_HEX,
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingBar
        maxProgress={100}
        updateTime={100}
        style={{
          zIndex: 9999999999,
          height: 2,
          backgroundColor: theme.palette.primary.main,
          transition: 'all 5s ease 3s',
        }}
      />
      <NavBar />
      <Routes />
      <Footer />
      <Snackbar
        open={isSnackbarOpen}
        onClose={closeFlashMessage}
        message={flashMessage}
        autoHideDuration={6000}
        action={
          <IconButton
            size='small'
            aria-label='close'
            color='inherit'
            onClick={closeFlashMessage}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        }
      >
        <Alert
          onClose={closeFlashMessage}
          severity={alertType ? alertType : 'info'}
          elevation={6}
          variant='filled'
        >
          {flashMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}
