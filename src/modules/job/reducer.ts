import {
  LOAD_JOB_TYPE_REQUEST,
  LOAD_JOB_TYPE_SUCCESS,
  LOAD_JOB_TYPE_FAILURE,
  LOAD_JOB_LEVEL_REQUEST,
  LOAD_JOB_LEVEL_SUCCESS,
  LOAD_JOB_LEVEL_FAILURE,
} from './actions'

const initialState = {
  isLoading: false,
  jobTypes: [],
  jobLevels: [],
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case LOAD_JOB_TYPE_REQUEST:
      return { ...state, isLoading: true, jobTypes: [] }
    case LOAD_JOB_LEVEL_REQUEST:
      return { ...state, isLoading: true, jobLevels: [] }
    case LOAD_JOB_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        jobTypes: action.payload.jobTypes,
      }
    case LOAD_JOB_LEVEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        jobLevels: action.payload.jobLevels,
      }
    case LOAD_JOB_TYPE_FAILURE:
      return {
        ...state,
        isLoading: false,
        jobTypes: action.payload.jobTypes,
      }
    case LOAD_JOB_LEVEL_FAILURE:
      return {
        ...state,
        isLoading: false,
        jobLevels: action.payload.jobLevels,
      }
    default:
      return state
  }
}
