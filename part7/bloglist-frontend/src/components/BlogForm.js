import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { createBlog } from '../reducers/blogReducer'
import { showNotification } from '../reducers/notificationReducer'

const BlogForm = ({ toggleVisibility, onSubmit }) => {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')
  const dispatch = useDispatch()

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleURLChange = (event) => {
    setNewURL(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newURL,
    }
    onSubmit(blogObject)
    if (blogObject.title.length > 5) {
      dispatch(createBlog(blogObject))
    } else {
      dispatch(showNotification('Title should be bigger than 5 symbols', 5))
    }
    setNewTitle('')
    setNewAuthor('')
    setNewURL('')
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
        <button data-testid='create' type="submit" onClick={toggleVisibility} className="button">Create</button>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  toggleVisibility: PropTypes.func,
}

export default BlogForm