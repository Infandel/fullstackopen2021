import React, { useState } from 'react'
import { toast } from 'react-toastify'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const BlogForm = ({
  setBlogs, blogs, setErrorMessage, toggleVisibility, onSubmit
}) => {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleURLChange = (event) => {
    setNewURL(event.target.value)
  }

  const notify = (title, author) => toast(`A new blog ${title}! by ${author} added`)

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newURL,
    }
    onSubmit(blogObject)
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewURL('')
        notify(returnedBlog.title, returnedBlog.author)
      })
      .catch(() => {
        setErrorMessage('Something wrong with input')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }
  return (
    <>
      <h1>Create new Blog</h1>
      <form onSubmit={addBlog} data-testid="form">
        <div>
          <label>Title</label>
          <input data-testid='title' value={newTitle} type="text" onChange={handleTitleChange} />
        </div>
        <div>
          <label>Author</label>
          <input data-testid='author' value={newAuthor} type="text" onChange={handleAuthorChange} />
        </div>
        <div>
          <label>URL</label>
          <input data-testid='url' value={newURL} type="text" onChange={handleURLChange} />
        </div>
        <button type="submit" onClick={toggleVisibility} className="button">Create</button>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  toggleVisibility: PropTypes.func,
}

export default BlogForm