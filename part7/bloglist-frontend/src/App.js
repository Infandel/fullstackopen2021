import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/userReducer'
import NavBar from './components/NavBar'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Togglable from './components/Togglable'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  //for testing purposes
  const onSubmit = () => {
    console.log('submitted')
  }

  if (user === null) {
    return (
      <>
        <h1>Log in to application</h1>
        <Notification />
        <LoginForm />
      </>
    )
  }

  return (
    <>
      <NavBar />
      <Notification />
      <ToastContainer position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}
        pauseOnFocusLoss draggable pauseOnHover
      />
      <Switch>
        <Route path="/blogs/:id">
          <Blog />
        </Route>
        <Route path="/users/:id">
          <User />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <Togglable buttonLabel='Create new Blog'>
            <BlogForm onSubmit={onSubmit} />
          </Togglable>
          <BlogList />
        </Route>
      </Switch>
      <Footer />
    </>
  )
}

export default App