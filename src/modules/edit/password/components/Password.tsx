import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import {
  TextField,
  Button,
  FormHelperText,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  Toolbar,
  Grid,
  Chip,
  Container,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons'

import * as actions from '../actions'
import { isLoginAsAdmin } from 'utils/isLogin'

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    padding: theme.spacing(16, 16),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(10, 4),
    },
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

interface State {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  showCurrentPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean
}

export default function Password() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  })

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword })
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  const { register, handleSubmit, errors } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    validationSchema: yup.object().shape({
      currentPassword: yup.string().required('กรุณากรอกรหัสผ่านปัจจุบัน'),
      newPassword: yup.string().required('กรุณากรอกรหัสผ่านใหม่'),
      confirmPassword: yup
        .string()
        .required('กรุณายืนยันรหัสผ่านใหม่')
        .oneOf([yup.ref('newPassword')], 'กรุณากรอกรหัสผ่านใหม่ให้ตรงกัน'),
    }),
  })

  const onSubmit = (submitValues: any) => {
    const values = {
      old: submitValues.currentPassword,
      new: submitValues.newPassword,
    }
    const change_password_action = actions.changePassword(values)
    dispatch(change_password_action)
  }

  const { message } = useSelector((state: any) => state.password)

  const [passwordNotMatched, setPasswordNotMatched] = useState(false)

  useEffect(() => {
    if (values.newPassword !== values.confirmPassword) {
      setPasswordNotMatched(true)
    } else {
      setPasswordNotMatched(false)
    }
  }, [values])

  const hasEmptyFields =
    values.currentPassword === '' ||
    values.newPassword === '' ||
    values.confirmPassword === ''
  const hasError =
    !!errors.currentPassword || !!errors.newPassword || !!errors.confirmPassword

  return (
    <Container maxWidth='lg'>
      <Grid container direction='row' justify='center' alignItems='center'>
        <Grid item xs={12} md={8} lg={6}>
          <Paper className={classes.paper} elevation={0}>
            <Toolbar />
            <Grid
              container
              direction='column'
              justify='center'
              alignItems='center'
            >
              <Typography
                component='h1'
                variant='h4'
                style={{ fontWeight: 600 }}
                gutterBottom
              >
                เปลี่ยนรหัสผ่าน
              </Typography>
              {isLoginAsAdmin() && (
                <Chip
                  label='ผู้ดูแลระบบ'
                  color='primary'
                  variant='outlined'
                  style={{ marginBottom: 16 }}
                />
              )}
            </Grid>
            <form className={classes.form} noValidate>
              <TextField
                autoComplete='new-password'
                inputProps={{
                  autocomplete: 'new-password',
                  form: {
                    autocomplete: 'new-password',
                  },
                }}
                variant='outlined'
                margin='normal'
                required
                fullWidth
                inputRef={register}
                label='รหัสผ่านปัจจุบัน'
                name='currentPassword'
                helperText={errors.currentPassword?.message}
                error={!!errors.currentPassword}
                type={values.showCurrentPassword ? 'text' : 'password'}
                value={values.currentPassword}
                onChange={handleChange('currentPassword')}
                style={{ letterSpacing: ' 0.05em' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={handleClickShowCurrentPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showCurrentPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                autoComplete='new-password'
                inputProps={{
                  autocomplete: 'new-password',
                  form: {
                    autocomplete: 'new-password',
                  },
                }}
                variant='outlined'
                margin='normal'
                required
                fullWidth
                inputRef={register}
                label='รหัสผ่านใหม่'
                name='newPassword'
                helperText={errors.newPassword?.message}
                error={!!errors.newPassword}
                style={{ letterSpacing: ' 0.05em' }}
                type={values.showNewPassword ? 'text' : 'password'}
                value={values.newPassword}
                onChange={handleChange('newPassword')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showNewPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                autoComplete='new-password'
                inputProps={{
                  autocomplete: 'new-password',
                  form: {
                    autocomplete: 'new-password',
                  },
                }}
                variant='outlined'
                margin='normal'
                required
                fullWidth
                inputRef={register}
                label='ยืนยันรหัสผ่านใหม่'
                name='confirmPassword'
                helperText={errors.confirmPassword?.message}
                error={!!errors.confirmPassword}
                style={{ letterSpacing: ' 0.05em' }}
                type={values.showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showConfirmPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormHelperText
                error
                style={{ fontSize: '0.9rem', textAlign: 'center' }}
              >
                {message ? message : ''}
              </FormHelperText>
              <Button
                size='large'
                color='secondary'
                variant='contained'
                className={classes.submit}
                fullWidth
                disabled={hasEmptyFields || hasError || passwordNotMatched}
                type='submit'
                onClick={handleSubmit(onSubmit)}
              >
                เปลี่ยนรหัสผ่าน
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
