import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { get, isEmpty } from 'lodash'

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
  Container,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons'

import * as actions from '../actions'
import * as ministryActions from 'modules/ministry/actions'
import * as departmentActions from 'modules/department/actions'

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

export default function Login() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [ministry, setMinistry] = useState(null)
  const [department, setDepartment] = useState(null)
  const [ministryList, setMinistryList] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  })

  const { items: ministries } = useSelector((state: any) => state.ministry)
  const { items: departments } = useSelector((state: any) => state.department)
  const { messageLogin } = useSelector((state: any) => state.login)

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
      password: yup.string().required(),
    }),
  })

  const getMinistryLabel = (ministryId: string) => {
    const result = ministryList.find(
      (ministry: any) => String(ministry.id) === String(ministryId)
    )
    return get(result, 'name', '')
  }

  const getDepartmentLabel = (departmentId: string) => {
    const result = departmentList.find(
      (department: any) => String(department.id) === String(departmentId)
    )
    return get(result, 'name', '')
  }

  const onLogin = (loginInfo: any) => {
    const actionLogin = actions.loadLogin(
      {
        department,
        password: loginInfo.password,
      },
      ministry,
      department,
      getMinistryLabel(ministry),
      getDepartmentLabel(department)
    )
    dispatch(actionLogin)
  }

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

  useEffect(() => {
    setDepartmentList(departments)
  }, [departments])

  useEffect(() => {
    setMinistryList(ministries)
  }, [ministries])

  return (
    <Container maxWidth='lg'>
      <Grid container direction='row' justify='center' alignItems='center'>
        <Grid item xs={12} md={8} lg={6}>
          <Paper className={classes.paper} elevation={0}>
            <Toolbar />
            <Grid
              container
              direction='row'
              justify='center'
              alignItems='center'
            >
              <Typography
                component='h1'
                variant='h4'
                style={{ fontWeight: 600, marginBottom: 32 }}
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
              <FormControl
                fullWidth
                variant='outlined'
                style={{ marginBottom: 16 }}
              >
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
                  {ministryList.map((ministry: MinistryType) => (
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
        </Grid>
      </Grid>
    </Container>
  )
}
