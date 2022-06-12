import {
  LOAD_MINISTRY_REQUEST,
  LOAD_MINISTRY_SUCCESS,
  LOAD_MINISTRY_FAILURE,
} from './actions'

const initialState = {
  isLoading: false,
  items: [],
}

export default function (state = initialState, action: any) {
  switch (action.type) {
    case LOAD_MINISTRY_REQUEST:
      return { ...state, isLoading: true, items: [] }
    case LOAD_MINISTRY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: action.payload.ministry,
      }
    case LOAD_MINISTRY_FAILURE:
      return {
        ...state,
        isLoading: false,
        items: action.payload.ministry,
      }
    default:
      return state
  }
}
