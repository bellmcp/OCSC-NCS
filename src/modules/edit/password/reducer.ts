import {
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILURE,
  CLEAR_MESSAGE_CHANGE_PASSWORD,
} from './actions'

const initialState = {
  isLoading: false,
  users: [],
  status: [],
  message: null,
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case CHANGE_PASSWORD_REQUEST:
      return { ...state, isLoading: true, users: [], message: [] }
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        users: action.payload.user,
        status: action.payload.status,
        message: action.payload.message,
      }
    case CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        status: action.payload.status,
        message: action.payload.message,
      }
    case CLEAR_MESSAGE_CHANGE_PASSWORD:
      return { ...state, message: null }
    default:
      return state
  }
}
