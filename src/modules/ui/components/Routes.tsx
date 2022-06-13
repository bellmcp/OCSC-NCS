import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import PrivateRoute from 'modules/routes/PrivateRoute'
import PrivateAdminRoute from 'modules/routes/PrivateAdminRoute'

import Login from 'modules/login/components/Login'
import AdminLogin from 'modules/adminlogin/components/AdminLogin'

import UserRoutes from 'modules/user/components/Routes'
import PasswordRoutes from 'modules/edit/password/components/Routes'

import NotFound from './NotFound'

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
        component={PasswordRoutes}
        path={`${PATH}/admin/edit/password`}
      />
      <PrivateRoute
        exact
        component={PasswordRoutes}
        path={`${PATH}/edit/password`}
      />

      <PrivateAdminRoute exact component={UserRoutes} path={`${PATH}/admin`} />
      <PrivateRoute exact component={UserRoutes} path={`${PATH}`} />

      <Route exact path={'/'}>
        <Redirect to={`${PATH}`} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}
