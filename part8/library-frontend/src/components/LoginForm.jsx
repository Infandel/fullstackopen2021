import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken, show, setPage, setFavoriteGenre }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, { data } ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.networkError.result.errors[0].message)
    }
  })

  useEffect(() => {
    if ( data ) {
      const token = data.login.value
      const favoriteGenre = data.login.favoriteGenre
      setToken(token)
      setFavoriteGenre(favoriteGenre)
      localStorage.setItem('library-user-token', token)
      localStorage.setItem('library-user-fav-genre', favoriteGenre)
    }
  }, [data]) // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
    setPage('authors')
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm