import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'

import Dashboard from './Dashboard'

export default function Routes() {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route path={path}>
        <>ADMIN ROUTES</>
      </Route>
    </Switch>
  )
}
