import React, { useState } from 'react'
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
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons'

import * as actions from '../actions'

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
  password: string
  showPassword: boolean
}

export default function AdminLogin() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  })

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  const { register, handleSubmit, errors } = useForm({
    mode: 'onSubmit',
    validationSchema: yup.object().shape({
      userId: yup
        .string()
        .required('กรุณากรอกเลขประจำตัวประจำตัวประชาชน')
        .matches(/^[0-9]{13}$/, 'กรุณากรอกตัวเลข 13 หลักเท่านั้น'),
      password: yup.string().required(),
    }),
  })

  const onLogin = (loginInfo: object) => {
    const info = { ...loginInfo, role: 'admin' }
    const actionLogin = actions.loadLogin(info)
    dispatch(actionLogin)
  }

  const { messageLogin } = useSelector((state: any) => state.adminlogin)

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
                เข้าสู่ระบบ
              </Typography>
              <Chip
                label='ผู้ดูแลระบบ'
                color='primary'
                variant='outlined'
                style={{ marginBottom: 16, fontSize: 14, fontWeight: 500 }}
              />
            </Grid>
            <form className={classes.form} noValidate>
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                inputRef={register}
                label='เลขประจำตัวประชาชน'
                name='userId'
                helperText={errors.userId?.message}
                error={!!errors.userId}
                style={{ letterSpacing: ' 0.05em' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                inputRef={register}
                label='รหัสผ่าน'
                name='password'
                autoComplete='on'
                helperText={errors.password?.message}
                error={!!errors.password}
                style={{ letterSpacing: ' 0.05em' }}
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? (
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
                {messageLogin ? messageLogin : ''}
              </FormHelperText>
              <Button
                size='large'
                color='secondary'
                variant='contained'
                className={classes.submit}
                fullWidth
                type='submit'
                onClick={handleSubmit(onLogin)}
              >
                เข้าสู่ระบบ
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
