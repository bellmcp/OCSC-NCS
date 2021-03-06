import axios from 'axios'
import parseJwt from 'utils/parseJwt'
import { getCookie } from 'utils/cookies'
import * as uiActions from 'modules/ui/actions'
import { isLoginAsAdmin } from 'utils/isLogin'

const CHANGE_PASSWORD_REQUEST = 'ocsc-ncs/edit/password/CHANGE_PASSWORD_REQUEST'
const CHANGE_PASSWORD_SUCCESS = 'ocsc-ncs/edit/password/CHANGE_PASSWORD_SUCCESS'
const CHANGE_PASSWORD_FAILURE = 'ocsc-ncs/edit/password/CHANGE_PASSWORD_FAILURE'
const CLEAR_MESSAGE_CHANGE_PASSWORD =
  'ocsc-ncs/edit/password/CLEAR_MESSAGE_CHANGE_PASSWORD'

function clearMessageChangePassword() {
  return {
    type: CLEAR_MESSAGE_CHANGE_PASSWORD,
  }
}

function changePassword(submitValues: any) {
  return async (dispatch: any) => {
    dispatch({ type: CHANGE_PASSWORD_REQUEST })
    try {
      const isAdmin = isLoginAsAdmin()
      const token = getCookie('token')
      const departmentId = getCookie('departmentId')
      const userId = parseJwt(token).unique_name
      const path = isAdmin
        ? `/admins/${userId}`
        : `/departments/${departmentId}`
      const baseURL = isAdmin
        ? process.env.REACT_APP_PLATFORM_API_URL
        : process.env.REACT_APP_PORTAL_API_URL

      const result = await axios.put(path, submitValues, {
        baseURL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      dispatch({
        type: CHANGE_PASSWORD_SUCCESS,
        payload: {
          user: result.data,
          status: result.status,
          message: null,
        },
      })
      dispatch(uiActions.setFlashMessage('เปลี่ยนรหัสผ่านสำเร็จ', 'success'))
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      dispatch({
        type: CHANGE_PASSWORD_FAILURE,
        payload: {
          status: err?.response?.status,
          message: err?.response?.data?.mesg,
        },
      })
      dispatch(uiActions.setFlashMessage('เปลี่ยนรหัสผ่านไม่สำเร็จ', 'error'))
    }
  }
}

export {
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  CLEAR_MESSAGE_CHANGE_PASSWORD,
  changePassword,
  clearMessageChangePassword,
}
