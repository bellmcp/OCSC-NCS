import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get, isEmpty, size } from 'lodash'

import { Toolbar, Container, Typography, Button, Grid } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Stack from '@mui/material/Stack'
import {
  Replay as ReplayIcon,
  Search as SearchIcon,
  UnfoldLess as ShrinkIcon,
  UnfoldMore as ExpandIcon,
} from '@material-ui/icons'

import Table from './Table'
import { isLoginAsAdmin, isLoginAsUser } from 'utils/isLogin'
import { getCookie } from 'utils/cookies'

import * as actions from '../actions'
import * as ministryActions from 'modules/ministry/actions'
import * as departmentActions from 'modules/department/actions'

function createData(
  order: any,
  id: any,
  title: any,
  firstName: any,
  lastName: any,
  jobStartDate: any,
  jobType: any,
  ministry: any,
  department: any,
  jobTitle: any,
  jobLevel: any,
  orientationFlag: any,
  orientationDate: any,
  eLearningFlag: any,
  eLearningDate: any,
  jointTrainingFlag: any,
  jointTrainingDate: any,
  lastUpdate: any
) {
  return {
    order,
    id,
    title,
    firstName,
    lastName,
    jobStartDate,
    jobType,
    ministry,
    department,
    jobTitle,
    jobLevel,
    orientationFlag,
    orientationDate,
    eLearningFlag,
    eLearningDate,
    jointTrainingFlag,
    jointTrainingDate,
    lastUpdate,
  }
}

export default function Dashboard() {
  const dispatch = useDispatch()

  const { newCivilServants, isLoading = false } = useSelector(
    (state: any) => state.user
  )
  const { items: ministries } = useSelector((state: any) => state.ministry)
  const { items: departments } = useSelector((state: any) => state.department)

  const [tableData, setTableData] = useState([])
  const [ministryList, setMinistryList] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [ministry, setMinistry] = useState('')
  const [department, setDepartment] = useState('')

  const departmentId = getCookie('departmentId')
  const ministryName = getCookie('ministryName')
  const departmentName = getCookie('departmentName')

  useEffect(() => {
    if (isLoginAsUser()) {
      const load_new_civil_servants_action = actions.loadNewCivilServants(
        String(departmentId)
      )
      dispatch(load_new_civil_servants_action)
    }
  }, [dispatch, departmentId])

  useEffect(() => {
    if (isLoginAsAdmin()) {
      const load_ministry_action = ministryActions.loadMinistry()
      dispatch(load_ministry_action)
    }
  }, [dispatch])

  useEffect(() => {
    setMinistryList(ministries)
  }, [ministries])

  useEffect(() => {
    setDepartmentList(departments)
  }, [departments])

  useEffect(() => {
    setTableData(
      newCivilServants.map((item: any, index: number) =>
        createData(
          index + 1,
          get(item, 'id', 'ไม่มีข้อมูล'),
          item.title,
          item.firstName,
          item.lastName,
          item.jobStartDate,
          item.jobType,
          item.ministry,
          item.department,
          item.jobTitle,
          item.jobLevel,
          item.orientationFlag,
          item.orientationDate,
          item.eLearningFlag,
          item.eLearningDate,
          item.jointTrainingFlag,
          item.jointTrainingDate,
          item.lastUpdate
        )
      )
    )
  }, [newCivilServants])

  const loadNewCivilServants = () => {
    if (isLoginAsAdmin()) {
      const load_new_civil_servants_action = actions.loadNewCivilServants(
        String(department)
      )
      dispatch(load_new_civil_servants_action)
    } else {
      const load_new_civil_servants_action = actions.loadNewCivilServants(
        String(departmentId)
      )
      dispatch(load_new_civil_servants_action)
    }
  }

  const handleChangeMinistry = (event) => {
    const value = event.target.value
    setMinistry(value)
    const load_department_action = departmentActions.loadDepartment(value)
    dispatch(load_department_action)
    setDepartment('')
  }

  const handleChangeDepartment = (event) => {
    setDepartment(event.target.value)
  }

  const renderSearchSection = () => {
    if (isLoginAsAdmin()) {
      return (
        <Grid container style={{ margin: '12px 0' }} spacing={2}>
          <Grid item xs={3} style={{ paddingLeft: 0 }}>
            <FormControl variant='outlined' fullWidth size='small'>
              <InputLabel id='demo-simple-select-label'>กระทรวง</InputLabel>
              <Select
                labelId='demo-simple-select-label'
                value={ministry}
                label='กระทรวง'
                variant='outlined'
                onChange={handleChangeMinistry}
              >
                {ministryList.map((ministry: any) => (
                  <MenuItem
                    dense
                    key={String(ministry.id)}
                    value={String(ministry.id)}
                  >
                    {ministry.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl variant='outlined' fullWidth size='small'>
              <InputLabel id='department-select-label'>กรม</InputLabel>
              <Select
                labelId='department-select-label'
                value={department}
                label='กรม'
                variant='outlined'
                disabled={isEmpty(departmentList)}
                onChange={handleChangeDepartment}
              >
                {departmentList.map((department: any) => (
                  <MenuItem
                    dense
                    key={String(department.id)}
                    value={String(department.id)}
                  >
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant='contained'
              color='secondary'
              style={{ height: 40, width: 92 }}
              disabled={department === ''}
              onClick={loadNewCivilServants}
              startIcon={<SearchIcon />}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      )
    } else if (isLoginAsUser()) {
      return (
        <Grid container style={{ margin: '12px 0' }} spacing={2}>
          <Grid item xs={3} style={{ paddingLeft: 0 }}>
            <FormControl variant='outlined' fullWidth size='small'>
              <InputLabel id='ministry-select-label'>กระทรวง</InputLabel>
              <Select
                labelId='ministry-select-label'
                disabled
                value={ministryName}
                label='กระทรวง'
                variant='outlined'
              >
                <MenuItem dense value={ministryName}>
                  {ministryName}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl variant='outlined' fullWidth size='small'>
              <InputLabel id='department-select-label'>กรม</InputLabel>
              <Select
                labelId='department-select-label'
                disabled
                value={departmentName}
                label='กรม'
                variant='outlined'
              >
                <MenuItem dense value={departmentName}>
                  {departmentName}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant='contained'
              color='secondary'
              disabled
              style={{ height: 40, width: 92 }}
              startIcon={<SearchIcon />}
            >
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      )
    } else {
      return <>ERROR</>
    }
  }

  const [tableMaxWidth, setTableMaxWidth] = useState<any>('lg')

  const handleSwitchTableMaxWidth = () => {
    if (tableMaxWidth === 'lg') setTableMaxWidth(false)
    else setTableMaxWidth('lg')
  }

  return (
    <>
      <Toolbar />
      <Container maxWidth='lg' style={{ marginTop: 36 }}>
        <Typography variant='h5' component='h1' style={{ fontWeight: 600 }}>
          ค้นหาข้าราชการใหม่ (บรรจุไม่เกิน 1 ปี)
        </Typography>
        {renderSearchSection()}
        <Grid container justify='space-between' style={{ margin: '24px 0' }}>
          <Typography variant='h6' component='h1' style={{ fontWeight: 600 }}>
            ผลการค้นหา ({size(tableData)} รายการ)
          </Typography>
          <Stack direction='row' spacing={2}>
            {!isEmpty(tableData) && (
              <Button
                size='small'
                variant='outlined'
                color='secondary'
                onClick={loadNewCivilServants}
                startIcon={<ReplayIcon />}
              >
                โหลดใหม่
              </Button>
            )}
            <Button
              size='small'
              variant='outlined'
              color='secondary'
              onClick={handleSwitchTableMaxWidth}
              startIcon={
                tableMaxWidth === 'lg' ? (
                  <ExpandIcon style={{ transform: 'rotate(90deg)' }} />
                ) : (
                  <ShrinkIcon style={{ transform: 'rotate(90deg)' }} />
                )
              }
            >
              {tableMaxWidth === 'lg' ? 'ขยาย' : 'ย่อ'}ตาราง
            </Button>
          </Stack>
        </Grid>
      </Container>
      <Container maxWidth={tableMaxWidth} style={{ marginBottom: 36 }}>
        <Table tableData={tableData} loading={isLoading} />
      </Container>
    </>
  )
}
