import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../reducers/signedReducer'

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
          username
          <input
            data-testid='username'
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid='password'
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button data-testid='login-button' type="submit" className="button">login</button>
      </form>
    </div>
  )
}

export default LoginForm