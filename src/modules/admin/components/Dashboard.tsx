//@ts-nocheck
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
  orientation: any,
  eLearning: any,
  jointTraining: any,
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
    orientation,
    eLearning,
    jointTraining,
    lastUpdate,
  }
}

export default function Dashboard() {
  const dispatch = useDispatch()

  const loadNewCivilServants = () => {
    const load_new_civil_servants_action = actions.loadNewCivilServants(2)
    dispatch(load_new_civil_servants_action)
  }

  useEffect(() => {
    const load_new_civil_servants_action = actions.loadNewCivilServants(2)
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
          item.orientation,
          item.eLearning,
          item.jointTraining,
          item.lastUpdate
        )
      )
    )
  }, [newCivilServants])

  const getRowData = (data: any, name: string) => {
    const result = get(data, name)
    if (!result || result === null) {
      return <span style={{ color: 'grey' }}>—</span>
    } else return result
  }

  return (
    <>
      <Toolbar />
      <Container maxWidth='lg' style={{ marginTop: 36, marginBottom: 36 }}>
        <Typography variant='h5' component='h1' style={{ fontWeight: 600 }}>
          ค้นหาข้าราชการใหม่ (บรรจุไม่เกิน 1 ปี)
        </Typography>
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
