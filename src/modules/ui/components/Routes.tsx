import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from 'modules/routes/PrivateRoute'
import PrivateAdminRoute from 'modules/routes/PrivateAdminRoute'
import NotFound from './NotFound'

import Login from 'modules/login/components/Login'
import AdminLogin from 'modules/adminlogin/components/Login'

const PATH = process.env.REACT_APP_BASE_PATH

export default function Routes() {
  return (
    <Switch>
      <Route exact path={`${PATH}/admin/login`}>
        <AdminLogin />
      </Route>
      <Route exact path={`${PATH}/login`}>
        <Login />
      </Route>
      <PrivateAdminRoute
        exact
        component={<div>ADMIN DASHBOARD</div>}
        path={`${PATH}/admin`}
      />
      <PrivateRoute exact component={<div>USER DASHBOARD</div>} path={PATH} />
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}
