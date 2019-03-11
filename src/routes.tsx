import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { Home, Search } from './pages'

export default (
  <Switch>
    <Route exact={true} path="/" component={Home} />
    <Route path="/search/:query" component={Search} />
    <Route path="*" exact>
      <Redirect to="/" />
    </Route>
  </Switch>
)
