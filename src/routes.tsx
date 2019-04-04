import React from "react"
import { Route, Switch } from "react-router-dom"
import { Home, Search, NotFound } from "./pages"

export default (
  <Switch>
    <Route exact={true} path='/' component={Home} />
    <Route path='/search/:query' component={Search} />
    <Route component={NotFound} />
  </Switch>
)
