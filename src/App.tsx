import React, { Component } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import routes from "./routes"

class App extends Component {
  render() {
    return (
      <div>
        <Router>{routes}</Router>
      </div>
    )
  }
}

export default App
