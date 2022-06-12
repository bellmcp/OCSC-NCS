import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

import {
  Toolbar,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
} from '@material-ui/core'
import { Replay as ReplayIcon } from '@material-ui/icons'

import TestTable from './TestTable'
import * as actions from '../actions'
import { isLoginAsAdmin, isLoginAsUser } from 'utils/isLogin'

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

  const loadNewCivilServants = () => {
    const load_new_civil_servants_action = actions.loadNewCivilServants(1)
    dispatch(load_new_civil_servants_action)
  }

  useEffect(() => {
    const load_new_civil_servants_action = actions.loadNewCivilServants(1)
    dispatch(load_new_civil_servants_action)
  }, [dispatch])

  const { newCivilServants, isLoading = false } = useSelector(
    (state: any) => state.user
  )

  const [tableData, setTableData] = useState([])

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

  const renderSearchSection = () => {
    if (isLoginAsAdmin()) {
      return <>ADMIN SEARCH</>
    } else if (isLoginAsUser()) {
      return (
        <Grid container style={{ margin: '12px 0' }} spacing={2}>
          <Grid item xs={3} style={{ paddingLeft: 0 }}>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              placeholder='กระทรวง'
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              placeholder='กรม'
            />
          </Grid>
          <Grid item xs={2}>
            <Button variant='contained' color='secondary'>
              ค้นหา
            </Button>
          </Grid>
        </Grid>
      )
    } else {
      return <>ERROR</>
    }
  }

  return (
    <>
      <Toolbar />
      <Container maxWidth='lg' style={{ marginTop: 36, marginBottom: 36 }}>
        <Typography variant='h5' component='h1' style={{ fontWeight: 600 }}>
          ค้นหาข้าราชการใหม่ (บรรจุไม่เกิน 1 ปี)
        </Typography>
        {renderSearchSection()}
        <Grid container justify='space-between' style={{ margin: '24px 0' }}>
          <Typography variant='h6' component='h1' style={{ fontWeight: 600 }}>
            ผลการค้นหา ({tableData.length} รายการ)
          </Typography>
          <Button
            variant='outlined'
            color='secondary'
            onClick={loadNewCivilServants}
            startIcon={<ReplayIcon />}
          >
            โหลดใหม่
          </Button>
        </Grid>
        <TestTable tableData={tableData} loading={isLoading} />
      </Container>
    </>
  )
}
