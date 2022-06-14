import axios from 'axios'
import { get } from 'lodash'
import * as uiActions from 'modules/ui/actions'

const LOAD_MINISTRY_REQUEST = 'ocsc-ncs/ministry/LOAD_MINISTRY_REQUEST'
const LOAD_MINISTRY_SUCCESS = 'ocsc-ncs/ministry/LOAD_MINISTRY_SUCCESS'
const LOAD_MINISTRY_FAILURE = 'ocsc-ncs/ministry/LOAD_MINISTRY_FAILURE'

function loadMinistry() {
  return async (dispatch: any) => {
    dispatch({ type: LOAD_MINISTRY_REQUEST })
    try {
      var { data } = await axios.get('/ministries', {
        baseURL: process.env.REACT_APP_PORTAL_API_URL,
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_MINISTRY_SUCCESS,
        payload: {
          ministry: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_MINISTRY_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดข้อมูลกระทรวงไม่สำเร็จ เกิดข้อผิดพลาด ${get(
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
  LOAD_MINISTRY_REQUEST,
  LOAD_MINISTRY_SUCCESS,
  LOAD_MINISTRY_FAILURE,
  loadMinistry,
}
