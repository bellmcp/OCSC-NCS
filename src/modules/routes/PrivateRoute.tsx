// @ts-nocheck
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isLoginAsUser, isLoginAsAdmin } from 'utils/isLogin'

const PATH = process.env.REACT_APP_BASE_PATH

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoginAsUser()) return <Component {...props} />
        else if (isLoginAsAdmin()) return <Redirect to={`${PATH}/admin`} />
        else return <Redirect to={`${PATH}/login`} />
      }}
    />
  )
}

export default PrivateRoute
