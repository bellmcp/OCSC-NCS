import {
  LOAD_DEPARTMENT_REQUEST,
  LOAD_DEPARTMENT_SUCCESS,
  LOAD_DEPARTMENT_FAILURE,
  LOAD_ALL_DEPARTMENT_REQUEST,
  LOAD_ALL_DEPARTMENT_SUCCESS,
  LOAD_ALL_DEPARTMENT_FAILURE,
} from './actions'

const initialState = {
  isLoading: false,
  items: [],
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case LOAD_ALL_DEPARTMENT_REQUEST:
    case LOAD_DEPARTMENT_REQUEST:
      return { ...state, isLoading: true, items: [] }
    case LOAD_ALL_DEPARTMENT_SUCCESS:
    case LOAD_DEPARTMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: action.payload.department,
      }
    case LOAD_ALL_DEPARTMENT_FAILURE:
    case LOAD_DEPARTMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        items: action.payload.department,
      }
    default:
      return state
  }
}
