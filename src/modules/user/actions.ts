//@ts-nocheck
import axios from 'axios'
import { getCookie } from 'utils/cookies'
import * as uiActions from 'modules/ui/actions'

const ROW_UPDATE_REQUEST = 'ocsc-ncs/user/ROW_UPDATE_REQUEST'
const ROW_UPDATE_SUCCESS = 'ocsc-ncs/user/ROW_UPDATE_SUCCESS'
const ROW_UPDATE_FAILURE = 'ocsc-ncs/user/ROW_UPDATE_FAILURE'

const LOAD_NEW_CIVIL_SERVANTS_REQUEST =
  'ocsc-ncs/user/LOAD_NEW_CIVIL_SERVANTS_REQUEST'
const LOAD_NEW_CIVIL_SERVANTS_SUCCESS =
  'ocsc-ncs/user/LOAD_NEW_CIVIL_SERVANTS_SUCCESS'
const LOAD_NEW_CIVIL_SERVANTS_FAILURE =
  'ocsc-ncs/user/LOAD_NEW_CIVIL_SERVANTS_FAILURE'

function loadRowData(citizenId: string, name: string) {
  return async (dispatch: any) => {
    dispatch({ type: ROW_UPDATE_REQUEST })
    dispatch(uiActions.setFlashMessage('กำลังโหลด...', 'info'))
    try {
      const token = getCookie('token')
      var { data } = await axios.get(`/newcivilservants/${citizenId}`, {
        baseURL: `${process.env.REACT_APP_PORTAL_API_URL}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: ROW_UPDATE_SUCCESS,
        payload: {
          rowData: data,
        },
      })
      dispatch(
        uiActions.setFlashMessage(`อัพเดทข้อมูล ${name} สำเร็จ`, 'success')
      )
    } catch (err) {
      dispatch({ type: ROW_UPDATE_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `อัพเดทข้อมูล ${name} ไม่สำเร็จ เกิดข้อผิดพลาด ${err?.response?.status}`,
          'error'
        )
      )
    }
  }
}

function loadNewCivilServants(departmentId: string) {
  return async (dispatch: any) => {
    dispatch({ type: LOAD_NEW_CIVIL_SERVANTS_REQUEST })
    try {
      const token = getCookie('token')
      var { data } = await axios.get('/newcivilservants', {
        baseURL: `${process.env.REACT_APP_PORTAL_API_URL}`,
        params: {
          departmentId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_NEW_CIVIL_SERVANTS_SUCCESS,
        payload: {
          newCivilServants: data,
        },
      })
      dispatch(uiActions.setFlashMessage('โหลดข้อมูลสำเร็จ', 'success'))
    } catch (err) {
      dispatch({ type: LOAD_NEW_CIVIL_SERVANTS_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดข้อมูลรายชื่อข้าราชการใหม่ไม่สำเร็จ เกิดข้อผิดพลาด ${err?.response?.status}`,
          'error'
        )
      )
    }
  }
}

export {
  ROW_UPDATE_REQUEST,
  ROW_UPDATE_SUCCESS,
  ROW_UPDATE_FAILURE,
  LOAD_NEW_CIVIL_SERVANTS_REQUEST,
  LOAD_NEW_CIVIL_SERVANTS_SUCCESS,
  LOAD_NEW_CIVIL_SERVANTS_FAILURE,
  loadRowData,
  loadNewCivilServants,
}
