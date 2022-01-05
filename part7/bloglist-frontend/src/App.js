import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Togglable from './components/Togglable'
import loginService from './services/login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs( blogs )
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const logOut = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLike = () => {
    console.log('toasty')
  }

  const onSubmit = () => {
    console.log('submitted')
  }

  if (user === null) {
    return (
      <>
        <h1>Log in to application</h1>
        <Notification message={errorMessage} />
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
      <Notification message={errorMessage} />
      <ToastContainer position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick rtl={false}
        pauseOnFocusLoss draggable pauseOnHover />
      <Togglable buttonLabel='Create new Blog'>
        <BlogForm
          setBlogs={setBlogs}
          blogs={blogs}
          setErrorMessage={setErrorMessage}
          onSubmit={onSubmit}
        />
      </Togglable>
      <h1>Blogs</h1>
      <ul className="blogs">
        {blogs.sort((prevBlog, nextBlog) => nextBlog.likes - prevBlog.likes).map(blog =>
          <Blog
            key={blog.id}
            userId={user.id}
            blog={blog}
            setBlogs={setBlogs}
            blogs={blogs}
            setErrorMessage={setErrorMessage}
            onLikeClick={handleLike}
          />
        )}
      </ul>
      <Footer />
    </>
  )
}

export default App