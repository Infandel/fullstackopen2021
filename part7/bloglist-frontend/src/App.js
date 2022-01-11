import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { login, logout } from './reducers/signedReducer'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Togglable from './components/Togglable'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const logOut = () => {
    dispatch(logout())
  }

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
  //for testing purposes
  const handleLike = () => {
    console.log('toasty')
  }
  //for testing purposes
  const onSubmit = () => {
    console.log('submitted')
  }

  if (user === null) {
    return (
      <>
        <h1>Log in to application</h1>
        <Notification />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </>
    )
  }

  return (
    <>
      <div className="user">
        {user.name} logged-in
      </div>
      <div>
        <button className="button" onClick={logOut}>Log out</button>
      </div>
      <Notification />
      <ToastContainer position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}
        pauseOnFocusLoss draggable pauseOnHover
      />
      <Togglable buttonLabel='Create new Blog'>
        <BlogForm
          onSubmit={onSubmit}
        />
      </Togglable>
      <BlogList
        onLikeClick={handleLike}
      />
      <Footer />
    </>
  )
}

export default App