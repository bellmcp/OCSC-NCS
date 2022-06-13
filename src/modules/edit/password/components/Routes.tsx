import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import Password from './Password'

export default function Routes() {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route path={path}>
        <Password />
      </Route>
    </Switch>
  )
}
