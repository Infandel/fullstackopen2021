import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Users = () => {
  const users = useSelector(state => state.users)

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th><h3>User</h3></th>
            <th scope="col"><h3>Blogs created</h3></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <th scope="row"><Link to={`/users/${user.id}`}>{user.username}</Link></th>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

export default Users