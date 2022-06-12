import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
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
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from '@material-ui/icons'
import * as actions from '../actions'
import * as ministryActions from 'modules/ministry/actions'
import * as departmentActions from 'modules/department/actions'
import { isEmpty } from 'lodash'

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

interface MinistryType {
  id: number
  name: string
}

interface DepartmentType {
  id: number
  name: string
}

export default function LoginForm() {
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

  const linkToForgotPassword = () => {
    window.open(`${process.env.REACT_APP_PORTAL_URL}forget`, '_blank')
  }

  const linkToSignUp = () => {
    window.open(`${process.env.REACT_APP_PORTAL_URL}signup`, '_blank')
  }

  const { register, handleSubmit, errors } = useForm({
    mode: 'onSubmit',
    validationSchema: yup.object().shape({
      password: yup.string().required(),
    }),
  })

  const onLogin = (loginInfo: any) => {
    const actionLogin = actions.loadLogin({
      department,
      password: loginInfo.password,
    })
    dispatch(actionLogin)
  }

  const { messageLogin } = useSelector((state: any) => state.login)

  const [ministry, setMinistry] = useState(null)
  const [department, setDepartment] = useState(null)

  const handleChangeMinistry = (event: any) => {
    const value = event.target.value
    setMinistry(value)
    const load_department_action = departmentActions.loadDepartment(value)
    dispatch(load_department_action)
  }

  const handleChangeDepartment = (event: any) => {
    setDepartment(event.target.value)
  }

  useEffect(() => {
    const load_ministry_action = ministryActions.loadMinistry()
    dispatch(load_ministry_action)
  }, [dispatch])

  const { items: ministries } = useSelector((state: any) => state.ministry)
  const { items: departments } = useSelector((state: any) => state.department)

  const [departmentList, setDepartmentList] = useState([])

  useEffect(() => {
    setDepartmentList(departments)
  }, [departments])

  return (
    <Paper className={classes.paper} elevation={0}>
      <Toolbar />
      <Grid container direction='row' justify='center' alignItems='center'>
        <Typography
          component='h1'
          variant='h4'
          style={{ fontWeight: 600, marginBottom: 48 }}
        >
          เข้าสู่ระบบ
        </Typography>
      </Grid>
      <Typography
        component='h2'
        variant='body2'
        color='textSecondary'
      ></Typography>
      <form className={classes.form} noValidate>
        <FormControl fullWidth variant='outlined' style={{ marginBottom: 16 }}>
          <InputLabel>กระทรวง</InputLabel>
          <Select
            inputRef={register}
            name='ministry'
            value={ministry}
            label='กระทรวง'
            variant='outlined'
            onChange={handleChangeMinistry}
            placeholder='โปรดเลือกกระทรวง'
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              style: {
                maxHeight: 380,
              },
              getContentAnchorEl: null,
            }}
          >
            {ministries.map((ministry: MinistryType) => (
              <MenuItem dense key={ministry.id} value={ministry.id}>
                {ministry.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant='outlined'>
          <InputLabel>กรม</InputLabel>
          <Select
            inputRef={register}
            name='department'
            value={department}
            label='กรม'
            variant='outlined'
            onChange={handleChangeDepartment}
            placeholder='โปรดเลือกกรม'
            disabled={isEmpty(departmentList)}
            MenuProps={{
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              style: {
                maxHeight: 380,
              },
              getContentAnchorEl: null,
            }}
          >
            {departmentList.map((department: DepartmentType) => (
              <MenuItem dense key={department.id} value={department.id}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          variant='outlined'
          margin='normal'
          required
          fullWidth
          inputRef={register}
          label='รหัสผ่าน'
          name='password'
          autoComplete='on'
          helperText={errors.password ? 'กรุณากรอกรหัสผ่าน' : null}
          error={!!errors.password}
          style={{ letterSpacing: ' 0.25em' }}
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
          type={values.showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={handleChange('password')}
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
  )
}
