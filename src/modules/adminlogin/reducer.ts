import {
  LOAD_ADMIN_LOGIN_REQUEST,
  LOAD_ADMIN_LOGIN_SUCCESS,
  LOAD_ADMIN_LOGIN_FAILURE,
  CLEAR_MESSAGE_ADMIN_LOGIN,
} from './actions'

const initialState = {
  isLoading: false,
  users: [],
  status: [],
  messageLogin: null,
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case LOAD_ADMIN_LOGIN_REQUEST:
      return { ...state, isLoading: true, users: [], messageLogin: [] }
    case LOAD_ADMIN_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        users: action.payload.user,
        status: action.payload.status,
        messageLogin: action.payload.messageLogin,
      }
    case LOAD_ADMIN_LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        status: action.payload.status,
        messageLogin: action.payload.messageLogin,
      }
    case CLEAR_MESSAGE_ADMIN_LOGIN:
      return { ...state, messageLogin: null }
    default:
      return state
  }
}
