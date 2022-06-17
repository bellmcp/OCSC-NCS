import axios from 'axios'
import { get } from 'lodash'
import * as uiActions from 'modules/ui/actions'

const LOAD_DEPARTMENT_REQUEST = 'ocsc-ncs/department/LOAD_DEPARTMENT_REQUEST'
const LOAD_DEPARTMENT_SUCCESS = 'ocsc-ncs/department/LOAD_DEPARTMENT_SUCCESS'
const LOAD_DEPARTMENT_FAILURE = 'ocsc-ncs/department/LOAD_DEPARTMENT_FAILURE'

const LOAD_ALL_DEPARTMENT_REQUEST =
  'ocsc-ncs/department/LOAD_ALL_DEPARTMENT_REQUEST'
const LOAD_ALL_DEPARTMENT_SUCCESS =
  'ocsc-ncs/department/LOAD_ALL_DEPARTMENT_SUCCESS'
const LOAD_ALL_DEPARTMENT_FAILURE =
  'ocsc-ncs/department/LOAD_ALL_DEPARTMENT_FAILURE'

function loadAllDepartment() {
  return async (dispatch: any) => {
    dispatch({ type: LOAD_DEPARTMENT_REQUEST })
    try {
      var { data } = await axios.get('/departments', {
        baseURL: process.env.REACT_APP_PORTAL_API_URL,
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_DEPARTMENT_SUCCESS,
        payload: {
          department: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_DEPARTMENT_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดรายชื่อกรมทั้งหมดไม่สำเร็จ เกิดข้อผิดพลาด ${get(
            err,
            'response.status',
            'บางอย่าง'
          )}`,
          'error'
        )
      )
    }
  }
}

function loadDepartment(ministryId: string) {
  return async (dispatch: any) => {
    dispatch({ type: LOAD_DEPARTMENT_REQUEST })
    try {
      var { data } = await axios.get(`/ministries/${ministryId}/departments`, {
        baseURL: process.env.REACT_APP_PORTAL_API_URL,
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_DEPARTMENT_SUCCESS,
        payload: {
          department: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_DEPARTMENT_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดรายชื่อกรมไม่สำเร็จ เกิดข้อผิดพลาด ${get(
            err,
            'response.status',
            'บางอย่าง'
          )}`,
          'error'
        )
      )
    }
  }
}

export {
  LOAD_DEPARTMENT_REQUEST,
  LOAD_DEPARTMENT_SUCCESS,
  LOAD_DEPARTMENT_FAILURE,
  LOAD_ALL_DEPARTMENT_REQUEST,
  LOAD_ALL_DEPARTMENT_SUCCESS,
  LOAD_ALL_DEPARTMENT_FAILURE,
  loadDepartment,
  loadAllDepartment,
}
