import {
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_NEW_CIVIL_SERVANTS_REQUEST,
  LOAD_NEW_CIVIL_SERVANTS_SUCCESS,
  LOAD_NEW_CIVIL_SERVANTS_FAILURE,
} from './actions'

const initialState = {
  isLoading: false,
  items: [],
  newCivilServants: [],
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case LOAD_USER_REQUEST:
      return {
        ...state,
        isLoading: true,
        items: [],
      }
    case LOAD_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: action.payload.users,
      }
    case LOAD_USER_FAILURE:
      return {
        ...state,
        isLoading: false,
      }
    case LOAD_NEW_CIVIL_SERVANTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        newCivilServants: [],
      }
    case LOAD_NEW_CIVIL_SERVANTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        newCivilServants: action.payload.newCivilServants,
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
