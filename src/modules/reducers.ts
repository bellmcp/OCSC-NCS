import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { loadingBarReducer } from 'react-redux-loading-bar'

import login from 'modules/login/reducer'
import user from 'modules/user/reducer'
import ui from 'modules/ui/reducer'
import ministry from 'modules/ministry/reducer'
import department from 'modules/department/reducer'
import job from 'modules/job/reducer'
import password from 'modules/edit/password/reducer'

export default (history: any) =>
  combineReducers({
    router: connectRouter(history),
    loadingBar: loadingBarReducer,
    login,
    user,
    ui,
    ministry,
    department,
    job,
    password,
  })
