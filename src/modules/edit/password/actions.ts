import axios from 'axios'
import { push } from 'connected-react-router'
import parseJwt from 'utils/parseJwt'
import { getCookie } from 'utils/cookies'
import * as uiActions from 'modules/ui/actions'
import { isLoginAsAdmin } from 'utils/isLogin'

const CHANGE_PASSWORD_REQUEST =
  'learning-platform/login/CHANGE_PASSWORD_REQUEST'
const CHANGE_PASSWORD_SUCCESS =
  'learning-platform/login/CHANGE_PASSWORD_SUCCESS'
const CHANGE_PASSWORD_FAILURE =
  'learning-platform/login/CHANGE_PASSWORD_FAILURE'
const CLEAR_MESSAGE_CHANGE_PASSWORD =
  'learning-platform/login/CLEAR_MESSAGE_CHANGE_PASSWORD'

const PATH = process.env.REACT_APP_BASE_PATH

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
      })
      dispatch({
        type: CHANGE_PASSWORD_SUCCESS,
        payload: {
          user: result.data,
          status: result.status,
          message: null,
        },
      })
      dispatch(push(isAdmin ? `${PATH}/admin` : `${PATH}`))
      dispatch(uiActions.setFlashMessage('เปลี่ยนรหัสผ่านสำเร็จ', 'success'))
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
