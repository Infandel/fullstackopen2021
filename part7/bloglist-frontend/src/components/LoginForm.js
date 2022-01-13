import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/signedReducer'
import { Button, TextField } from '@material-ui/core'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = (event) => {
    try {
      event.preventDefault()
      dispatch(login(username, password))
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.warn(exception)
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            data-testid='username'
            label="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            data-testid='password'
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <br />
        <Button variant="contained" color="primary" type="submit">
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm