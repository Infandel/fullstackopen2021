import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@material-ui/core'

const Users = () => {
  const users = useSelector(state => state.users)

  return (
    <>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><h3>User</h3></TableCell>
              <TableCell ><h3>Blogs created</h3></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user =>
              <TableRow key={user.id}>
                <TableCell ><Link to={`/users/${user.id}`}>{user.username}</Link></TableCell>
                <TableCell >{user.blogs.length}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Users