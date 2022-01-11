import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/signedReducer'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const navBarStyle = {
    display: 'flex',
    padding: '0px',
    margin: '0px',
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: '10px',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  }

  const linksStyle = {
    textDecoration: 'none',
  }

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const logOut = () => {
    dispatch(logout())
  }

  return (
    <div style={navBarStyle}>
      <div style={{ display: 'inline-flex', alignItems:'center' }}>
        <Link className="user" style={linksStyle} to={'/blogs/'}>Blogs</Link>
        <Link className="user" style={linksStyle} to={'/users/'}>Users</Link>
      </div>
      <div style={{ marginLeft: 'auto', marginRight: '10px', display: 'flex', alignItems: 'center' }}>
        <div className="user">
          {user.name} logged-in
        </div>
        <button className="button" onClick={logOut}>Log out</button>
      </div>
    </div>
  )
}

export default NavBar