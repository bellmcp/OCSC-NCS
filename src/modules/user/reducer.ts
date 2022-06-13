import {
  ROW_UPDATE_REQUEST,
  ROW_UPDATE_SUCCESS,
  ROW_UPDATE_FAILURE,
  LOAD_NEW_CIVIL_SERVANTS_REQUEST,
  LOAD_NEW_CIVIL_SERVANTS_SUCCESS,
  LOAD_NEW_CIVIL_SERVANTS_FAILURE,
} from './actions'

const initialState = {
  isLoading: false,
  isUpdating: false,
  items: [],
  newCivilServants: [],
  rowData: [],
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case ROW_UPDATE_REQUEST:
      return {
        ...state,
        isUpdating: true,
        rowData: [],
      }
    case LOAD_NEW_CIVIL_SERVANTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        newCivilServants: [],
      }
    case ROW_UPDATE_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        rowData: action.payload.rowData,
      }
    case LOAD_NEW_CIVIL_SERVANTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        newCivilServants: action.payload.newCivilServants,
      }
    case ROW_UPDATE_FAILURE:
      return {
        ...state,
        isUpdating: false,
        rowData: [],
      }
    case LOAD_NEW_CIVIL_SERVANTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        newCivilServants: [],
      }
    default:
      return state
  }
}
