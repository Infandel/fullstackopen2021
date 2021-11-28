import React, { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, setBlogs, blogs, userId, setErrorMessage }) => {

  const blogStyle = {
    padding: '10px',
    margin: '5px',
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: '10px',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
    fontFamily: 'Arial, Helvetica, sans-serif',
  }
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  // Comparing the IDs of creator and current user to display
  // remove button
  const isRemovable = { display: userId === blog.user.id ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const increaseLike = (event) => {
    event.preventDefault()
    const blogId = blog.id
    const chosenBlog = blogs.find(blog => blog.id === blogId)
    const blogObject = {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    blogService
      .update(blogId, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== chosenBlog.id ? blog : returnedBlog))
      })
      .catch(e => {
        setErrorMessage('Something wrong with updating the blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const removeBlog = () => {
    const blogId = blog.id
    if (window.confirm(`Do you want to remove blog ${blog.title} by ${blog.author} ?`)) {
      blogService
        .remove(blogId)
        .then(
          setBlogs(blogs.filter(blog => blog.id !== blogId))
        )
        .catch(e => {
          setErrorMessage('Something wrong with deleting the blog')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <div>
          {blog.title} by {blog.author}
          <button onClick={toggleVisibility} className="button small">View</button>
        </div>
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.title} by {blog.author}
          <button onClick={toggleVisibility} className="button small">Hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          {blog.likes}
          <button onClick={increaseLike} className="button small">Like</button>
        </div>
        <div>{blog.user.name}</div>
        <div style={isRemovable}>
          <button onClick={removeBlog} className="button small danger">Remove</button>
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  blog: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired
}

export default Blog