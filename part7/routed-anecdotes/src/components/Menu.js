import React from 'react';
import { Link } from "react-router-dom"

const Menu = () => {
  const style = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={style} to="/">anecdotes</Link>
      <Link style={style} to="/create">create new</Link>
      <Link style={style} to="/about">about</Link>
    </div>
  )
}

export default Menu;