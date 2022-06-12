//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DayJS from 'react-dayjs'
import { get } from 'lodash'

import { Toolbar, Container, Typography, Button, Grid } from '@material-ui/core'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

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

  useEffect(() => {
    const load_new_civil_servants_action = actions.loadNewCivilServants(2)
    dispatch(load_new_civil_servants_action)
  }, [dispatch])

  const { newCivilServants } = useSelector((state: any) => state.user)

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
      <Container maxWidth='lg'>
        <Typography
          variant='h5'
          component='h1'
          style={{ fontWeight: 600, marginTop: 36 }}
        >
          ค้นหาข้าราชการใหม่ (บรรจุไม่เกิน 1 ปี)
        </Typography>
        <Grid container style={{ margin: '12px 0' }} spacing={2}>
          <Grid item xs={3} style={{ paddingLeft: 0 }}>
            <Button variant='outlined' fullWidth>
              นำออกเป็นไฟล์ Excel
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button variant='outlined' fullWidth>
              นำออกเป็นไฟล์ Excel
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant='contained' color='secondary'>
              ค้นหา
            </Button>
          </Grid>
        </Grid>
        <Grid container justify='space-between' style={{ margin: '36px 0' }}>
          <Grid item>
            <Typography variant='h5' component='h1' style={{ fontWeight: 600 }}>
              ผลการค้นหา ({tableData.length} รายการ)
            </Typography>
          </Grid>
          <Grid item>
            <Button variant='outlined'>นำออกเป็นไฟล์ Excel</Button>
          </Grid>
        </Grid>
      </Container>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ลำดับที่</TableCell>
              <TableCell>คำนำหน้าชื่อ</TableCell>
              <TableCell>ชื่อ</TableCell>
              <TableCell>นามสกุล</TableCell>
              <TableCell>วันที่รับราชการ</TableCell>
              <TableCell>ประเภทตำแหน่ง</TableCell>
              <TableCell>กระทรวง</TableCell>
              <TableCell>กรม</TableCell>
              <TableCell>ตำแหน่ง</TableCell>
              <TableCell>ระดับ</TableCell>
              <TableCell>ปฐมนิเทศ</TableCell>
              <TableCell>
                หลักสูตรฝึกอบรมข้าราชการบรรจุใหม่ (E-Learning)
              </TableCell>
              <TableCell>อบรมสัมมนาร่วมกัน</TableCell>
              <TableCell>วันเวลาที่อัพเดทข้อมูล</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row: any) => (
              <TableRow key={row.id}>
                <TableCell component='th' scope='row'>
                  {row.order}
                </TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.firstName}</TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>
                  <DayJS format='DD/MM/YYYY' add={{ years: 543 }}>
                    {row.jobStartDate}
                  </DayJS>
                </TableCell>
                <TableCell>{getRowData(row, 'jobType')}</TableCell>
                <TableCell>{getRowData(row, 'ministry')}</TableCell>
                <TableCell>{getRowData(row, 'department')}</TableCell>
                <TableCell>{getRowData(row, 'jobTitle')}</TableCell>
                <TableCell>{getRowData(row, 'jobLevel')}</TableCell>
                <TableCell>{getRowData(row, 'orientation')}</TableCell>
                <TableCell>{getRowData(row, 'eLearning')}</TableCell>
                <TableCell>{getRowData(row, 'jointTraining')}</TableCell>
                <TableCell>
                  <DayJS format='DD/MM/YYYY' add={{ years: 543 }}>
                    {row.lastUpdate}
                  </DayJS>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
