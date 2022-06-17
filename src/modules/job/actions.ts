import axios from 'axios'
import { get } from 'lodash'
import * as uiActions from 'modules/ui/actions'

const LOAD_JOB_TYPE_REQUEST = 'ocsc-ncs/ministry/LOAD_JOB_TYPE_REQUEST'
const LOAD_JOB_TYPE_SUCCESS = 'ocsc-ncs/ministry/LOAD_JOB_TYPE_SUCCESS'
const LOAD_JOB_TYPE_FAILURE = 'ocsc-ncs/ministry/LOAD_JOB_TYPE_FAILURE'

const LOAD_JOB_LEVEL_REQUEST = 'ocsc-ncs/ministry/LOAD_JOB_LEVEL_REQUEST'
const LOAD_JOB_LEVEL_SUCCESS = 'ocsc-ncs/ministry/LOAD_JOB_LEVEL_SUCCESS'
const LOAD_JOB_LEVEL_FAILURE = 'ocsc-ncs/ministry/LOAD_JOB_LEVEL_FAILURE'

function loadJobType() {
  return async (dispatch: any) => {
    dispatch({ type: LOAD_JOB_TYPE_REQUEST })
    try {
      var { data } = await axios.get('/jobtypes1', {
        baseURL: process.env.REACT_APP_PORTAL_API_URL,
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_JOB_TYPE_SUCCESS,
        payload: {
          jobTypes: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_JOB_TYPE_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดประเภทตำแหน่งไม่สำเร็จ เกิดข้อผิดพลาด ${get(
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

function loadJobLevel() {
  return async (dispatch: any) => {
    dispatch({ type: LOAD_JOB_LEVEL_REQUEST })
    try {
      var { data } = await axios.get('/joblevels', {
        baseURL: process.env.REACT_APP_PORTAL_API_URL,
      })
      if (data.length === 0) {
        data = []
      }
      dispatch({
        type: LOAD_JOB_LEVEL_SUCCESS,
        payload: {
          jobLevels: data,
        },
      })
    } catch (err) {
      dispatch({ type: LOAD_JOB_LEVEL_FAILURE })
      dispatch(
        uiActions.setFlashMessage(
          `โหลดระดับตำแหน่งไม่สำเร็จ เกิดข้อผิดพลาด ${get(
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
  LOAD_JOB_TYPE_REQUEST,
  LOAD_JOB_TYPE_SUCCESS,
  LOAD_JOB_TYPE_FAILURE,
  LOAD_JOB_LEVEL_REQUEST,
  LOAD_JOB_LEVEL_SUCCESS,
  LOAD_JOB_LEVEL_FAILURE,
  loadJobLevel,
  loadJobType,
}
