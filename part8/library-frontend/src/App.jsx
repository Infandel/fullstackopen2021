import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('login')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('library-user-token')
    if (loggedUserJSON) {
      setToken(loggedUserJSON)
      setPage('authors')
    } else {
      setToken(null)
      setPage('login')
    }
  }, [token])


  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logOut = () => {
    window.localStorage.removeItem('library-user-token')
    setToken(null)
    setPage('login')
  }

  if (!token) {
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>
        <Notify errorMessage={errorMessage} />
        <Authors
          show={page === 'authors'}
          setError={notify}
        />

        <Books
          show={page === 'books'}
        />
        <LoginForm
          show={page === 'login'}
          setPage={setPage}
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={logOut}>logout</button>
      </div>

      <Notify errorMessage={errorMessage} />
      <Authors
        show={page === 'authors'}
        setError={notify}
        token={token}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
        setError={notify}
      />

    </div>
  )
}

export default App