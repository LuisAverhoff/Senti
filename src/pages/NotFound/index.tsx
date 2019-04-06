import React from "react"
import { Link } from "react-router-dom"
import "../../assets/css/404.css"

const NotFound = () => (
  <div id='notfound'>
    <div className='notfound'>
      <div className='notfound-404'>
        <h1>
          4<span>0</span>4
        </h1>
      </div>
      <h2>You have ventured into unknown territory.</h2>
      <Link to='/'>Click here to return home</Link>
    </div>
  </div>
)

export { NotFound }
