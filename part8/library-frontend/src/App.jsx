import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { useApolloClient, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from './queries'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [recomendBooks, setRecomendBooks] = useState([])
  const [favoriteGenre, setFavoriteGenre] = useState('')
  const [page, setPage] = useState('login')
  const client = useApolloClient()
  const [loadRecBooks, { loading }] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    update: (store, response) => {
      try {
        const booksInStore = store.readQuery({ query: ALL_BOOKS })
        store.writeQuery({
          query: ALL_BOOKS,
          data: {
            ...booksInStore,
            allBooks: [ ...booksInStore.allBooks, response.data.allBooks ]
          }
        })
      } catch(error) {
        console.error(error);
      }
    }
  });

  useEffect(() => {
    const loggedUser = localStorage.getItem('library-user-token')
    const favGenre = localStorage.getItem('library-user-fav-genre')
    if (loggedUser && favGenre) {
      setToken(loggedUser)
      setFavoriteGenre(favGenre)
      setPage('authors')
      loadRecBooks({ variables: { genre: favoriteGenre } })
        .then(allbooks => {
          setRecomendBooks(allbooks.data.allBooks)
          return allbooks
        })
        .catch(error => setErrorMessage(error))

    } else {
      setFavoriteGenre('')
      setToken(null)
      setPage('login')
    }
  }, [token, favoriteGenre, loadRecBooks])

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logOut = () => {
    localStorage.removeItem('library-user-token')
    localStorage.removeItem('library-user-fav-genre')
    setToken(null)
    setFavoriteGenre('')
    setPage('login')
    client.resetStore()
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
          loadRecBooks={loadRecBooks}
        />
        <LoginForm
          show={page === 'login'}
          setPage={setPage}
          setToken={setToken}
          setError={notify}
          setFavoriteGenre={setFavoriteGenre}
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
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logOut}>logout</button>
      </div>

      <Notify errorMessage={errorMessage} />
      <ToastContainer position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}
        pauseOnFocusLoss draggable pauseOnHover
      />
      <Authors
        show={page === 'authors'}
        setError={notify}
        token={token}
      />

      <Books
        show={page === 'books'}
        setError={notify}
      />

      <NewBook
        show={page === 'add'}
        setError={notify}
        client={client}
      />

      <Recommend
        show={page === 'recommend'}
        favoriteGenre={favoriteGenre}
        loading={loading}
        recomendBooks={recomendBooks}
      />

    </div>
  )
}

export default App