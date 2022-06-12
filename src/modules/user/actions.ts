//@ts-nocheck
import axios from 'axios'
import { getCookie } from 'utils/cookies'
import parseJwt from 'utils/parseJwt'
import * as uiActions from 'modules/ui/actions'

const LOAD_NEW_CIVIL_SERVANTS_REQUEST =
  'learning-platform/user/LOAD_NEW_CIVIL_SERVANTS_REQUEST'
const LOAD_NEW_CIVIL_SERVANTS_SUCCESS =
  'learning-platform/user/LOAD_NEW_CIVIL_SERVANTS_SUCCESS'
const LOAD_NEW_CIVIL_SERVANTS_FAILURE =
  'learning-platform/user/LOAD_NEW_CIVIL_SERVANTS_FAILURE'

const LOAD_USER_REQUEST = 'learning-platform/user/LOAD_USER_REQUEST'
const LOAD_USER_SUCCESS = 'learning-platform/user/LOAD_USER_SUCCESS'
const LOAD_USER_FAILURE = 'learning-platform/user/LOAD_USER_FAILURE'

function loadNewCivilServants(departmentId: string) {
  return async (dispatch: any) => {
    const token = getCookie('token')
    const userId = parseJwt(token).unique_name
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
function loadUser() {
  return async (dispatch: any) => {
    const token = getCookie('token')
    const userId = parseJwt(token).unique_name
    dispatch({ type: LOAD_USER_REQUEST })
    try {
      const token = getCookie('token')
      var { data } = await axios.get(`/Users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_USER_SUCCESS,
        payload: {
          users: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_USER_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดข้อมูลผู้ใช้ไม่สำเร็จ เกิดข้อผิดพลาด ${err?.response?.status}`,
          'error'
        )
      )
    }
  }
}

export {
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_NEW_CIVIL_SERVANTS_REQUEST,
  LOAD_NEW_CIVIL_SERVANTS_SUCCESS,
  LOAD_NEW_CIVIL_SERVANTS_FAILURE,
  loadNewCivilServants,
  loadUser,
}
